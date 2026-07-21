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
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(
          `HTTP ${response.status}: ${response.statusText}`,
        );
      } else {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} (non-retryable)`,
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("non-retryable")
      ) {
        throw error;
      }
      lastError =
        error instanceof Error ? error : new Error(String(error));
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
