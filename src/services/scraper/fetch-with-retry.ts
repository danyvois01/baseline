/**
 * fetchWithRetry — Resilient HTTP fetch with timeout and exponential backoff.
 *
 * Wraps the native fetch with:
 * - Configurable request timeout (AbortController).
 * - Automatic retries on network errors or non-2xx HTTP responses.
 * - Exponential backoff between attempts (base * 2^attempt) with jitter.
 *
 * Designed for ScraperAPI calls where transient failures are expected.
 */

export interface FetchWithRetryOptions {
  /** Maximum number of attempts (first try + retries). Default: 3 */
  maxAttempts?: number;
  /** Request timeout in milliseconds. Default: 30_000 (30s) */
  timeoutMs?: number;
  /** Base delay in milliseconds for exponential backoff. Default: 1_000 (1s) */
  baseDelayMs?: number;
  /** Additional fetch options (headers, cache directives, etc.) */
  fetchOptions?: RequestInit;
}

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_BASE_DELAY_MS = 1_000;

/**
 * An HTTP status that retrying cannot fix (4xx other than 429) — typically an
 * invalid or exhausted ScraperAPI key. Modelled as a class so callers can test
 * it with `instanceof` instead of matching on message text.
 */
export class NonRetryableHttpError extends Error {
  constructor(
    readonly status: number,
    statusText: string,
  ) {
    super(`HTTP ${status}: ${statusText} (non-retryable)`);
    this.name = "NonRetryableHttpError";
  }
}

/**
 * Fetches a URL with automatic retry on failure.
 * Throws after exhausting all attempts with the last encountered error.
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const {
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    baseDelayMs = DEFAULT_BASE_DELAY_MS,
    fetchOptions = {},
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    // Cleared in `finally` so a throwing fetch cannot leave the timer pending.
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      if (response.ok) {
        return response;
      }

      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(
          `HTTP ${response.status}: ${response.statusText}`,
        );
      } else {
        throw new NonRetryableHttpError(response.status, response.statusText);
      }
    } catch (error) {
      // Client errors (bad/expired API key, exhausted quota) will not succeed
      // on retry — surface them immediately instead of burning the backoff.
      if (error instanceof NonRetryableHttpError) {
        throw error;
      }
      lastError =
        error instanceof Error ? error : new Error(String(error));
    } finally {
      clearTimeout(timeoutId);
    }

    if (attempt < maxAttempts - 1) {
      const delay = baseDelayMs * Math.pow(2, attempt);
      const jitter = delay * 0.2 * Math.random();
      await sleep(delay + jitter);
    }
  }

  throw new Error(
    `fetchWithRetry exhausted ${maxAttempts} attempts. Last error: ${lastError?.message}`,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
