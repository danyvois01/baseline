"use client";

import { useTranslation } from "@/providers/locale-provider";

/**
 * PrivacyContent — localized body of the Privacy Policy page.
 * Renders the sections defined in the i18n dictionaries.
 */
export function PrivacyContent() {
  const { t } = useTranslation();
  const page = t.privacyPage;

  return (
    <article>
      <header className="mb-10">
        <h1 className="text-headline-lg text-foreground mb-2">{page.title}</h1>
        <p className="text-body-sm text-text-muted mb-4">{page.lastUpdated}</p>
        <p className="text-body-lg text-foreground/70">{page.intro}</p>
      </header>

      <div className="flex flex-col gap-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-headline-sm text-foreground mb-3">
              {section.heading}
            </h2>
            <div className="flex flex-col gap-3">
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-body-md text-foreground/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
