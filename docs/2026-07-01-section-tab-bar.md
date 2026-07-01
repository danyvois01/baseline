# Section Tab Bar — Navigazione sezioni homepage

## Obiettivo

Sostituire il dot navigator laterale (visibile solo su xl) con una Tab Bar orizzontale sticky che permetta di navigare rapidamente tra le sezioni della homepage su tutti i breakpoint. La TopNavBar diventa non-sticky e scorre via con la pagina.

## Modifiche proposte

### TopNavBar

#### [MODIFY] [top-nav-bar.tsx](file:///c:/Users/danie/Desktop/ATP/src/components/layout/top-nav-bar.tsx)

- Rimuovere `sticky top-0` dall'`<header>` → diventa un header statico nel flusso normale della pagina.

---

### Nuovo componente Section Tab Bar

#### [NEW] [section-tab-bar.tsx](file:///c:/Users/danie/Desktop/ATP/src/components/homepage/section-tab-bar.tsx)

Barra orizzontale di pill/tab che:
- Si posiziona nel DOM tra l'Hero e la RankingSection
- Usa `sticky top-0 z-50` per ancorarsi al top del viewport quando ci si scrolla sopra
- Traccia la sezione attiva tramite scroll position (stesso meccanismo del SectionNavigator attuale)
- Tab: `Ranking · Tornei · Stagione · Punteggio · Dizionario`
- Pill attiva: `bg-baseline-lime text-deep-navy` (coerente con lo stile pill della TopNavBar)
- Pill inattiva: `text-text-secondary hover:bg-surface-gray`
- Sfondo: `bg-surface-white` con `border-b border-border-subtle` (light), supporto dark mode
- Su mobile: scroll orizzontale (`overflow-x-auto`) con scrollbar nascosta
- Click su una pill → smooth scroll alla sezione corrispondente
- Altezza compatta: `h-12` (~48px)

---

### Homepage page.tsx

#### [MODIFY] [page.tsx](file:///c:/Users/danie/Desktop/ATP/src/app/page.tsx)

- Rimuovere `<SectionNavigator>` (dot nav laterale)
- Aggiungere `<SectionTabBar>` dopo `<HeroSection />`
- Passare le sezioni (escluso hero) come prop

---

### Cleanup

#### [DELETE logico] [section-navigator.tsx](file:///c:/Users/danie/Desktop/ATP/src/components/homepage/section-navigator.tsx)

- Rimuovere il componente e il suo export dal barrel file `index.ts`

---

## Verifiche

- La TopNavBar scorre via con la pagina (non sticky)
- La Section Tab Bar si ancora al top quando si supera l'hero
- La pill attiva si aggiorna correttamente durante lo scroll
- Click sulle pill esegue smooth scroll alla sezione
- Su mobile le tab sono scrollabili orizzontalmente
- Dark mode supportato
