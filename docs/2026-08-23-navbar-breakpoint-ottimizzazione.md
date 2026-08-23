# Design Document — Ottimizzazione Breakpoint Navbar Desktop (`lg` vs `xl`)

**Data:** 2026-08-23  
**Autore:** Antigravity  
**Stato:** In attesa di approvazione  

---

## 1. Obiettivo
Garantire che la barra di navigazione desktop completa (menu centrale su Home e tab integrati su Classifiche) rimanga visibile e perfettamente proporzionata su tutti i monitor di computer portatili standard (risoluzione 1080p con scaling Windows al 125%/150% o viewport tra 1024px e 1280px a zoom 100%), senza collassare prematuramente nella modalità mobile/tablet.

---

## 2. Analisi del Problema Attuale
- Attualmente in `src/components/layout/top-nav-bar.tsx`:
  - I link centrali del menu usano `hidden xl:flex` (attivo solo da `1280px` in su).
  - La barra secondaria mobile/tablet per le classifiche usa `xl:hidden`.
- Sui portatili Windows tipici (es. schermi 14"-15.6" Full HD con ingrandimento di sistema al 125% o 150%), la larghezza effettiva della finestra è tra `1050px` e `1200px`.
- Di conseguenza, a zoom 100%, l'applicazione considerava lo schermo come "tablet/mobile", nascondendo il menu centrale in Home e facendo scendere i tab in una barra aggiuntiva sotto l'header.

---

## 3. Piano di Implementazione
1. **Abbassamento del Breakpoint da `xl` a `lg`**:
   - Spostare i link centrali da `hidden xl:flex` a `hidden lg:flex` (attivi già a partire da `1024px`).
   - Spostare la barra mobile da `xl:hidden` a `lg:hidden`.
2. **Adattamento Fluido dello Spacing & Typography**:
   - Inserire padding e font proporzionati tra `lg` (1024px-1279px) e `xl` (1280px+):
     - Voci di navigazione: `px-2.5 xl:px-3.5 py-1.5 xl:py-2.5 text-xs xl:text-sm`.
     - Pulsante CTA destro ("Vai alle Classifiche" / "Torna alla Home"): `px-3 xl:px-6 py-2 xl:py-2.5 text-xs xl:text-sm`.
     - Logo: scalatura morbida per non saturare lo spazio su schermi compatti.
3. **Verifica & Test**:
   - Test con `tsc --noEmit` e `npm run build`.
   - Verifica sia a zoom 100% che a zoom 90%/110%.
