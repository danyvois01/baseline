"use client";

import { useTranslation } from "@/providers/locale-provider";

/**
 * AboutContent — localized body of the About page.
 * Renders the brand story sections plus the ATP non-affiliation disclaimer.
 */
export function AboutContent() {
  const { t } = useTranslation();
  const page = t.aboutPage;

  return (
    <article>
      <header className="mb-10">
        <h1 className="text-headline-lg text-foreground mb-2">{page.title}</h1>
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

        {/* ATP non-affiliation disclaimer */}
        <aside className="rounded-xl border border-border-subtle bg-surface-gray/30 p-6">
          <h2 className="text-headline-sm text-foreground mb-3">
            {page.disclaimerTitle}
          </h2>
          <p className="text-body-md text-foreground/70">
            {page.disclaimerBody}
          </p>
        </aside>
      </div>
    </article>
  );
}
