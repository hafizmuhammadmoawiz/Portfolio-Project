# Portfolio source code map

This note documents existing file relationships; it does not change application behavior.

## Application entry and composition
- `src/main.tsx` mounts the React application.
- `src/App.tsx` composes the page sections, owns theme state, and coordinates the flight transition.
- `src/index.css` loads Tailwind CSS v4, defines theme tokens, shared styles, and flight animation keyframes.

## Components
- `src/components/Navbar.tsx` uses navigation/site settings from `src/config/site.ts`; its theme and flight actions are passed from `App.tsx`.
- `src/components/Hero.tsx` uses site details, `NetworkCanvas.tsx`, and `Terminal.tsx`; its CTA calls the flight callback supplied by `App.tsx`.
- `src/components/FlightTransition.tsx` displays the plane and trail while `App.tsx` manages its active state and completion.
- `src/components/Contact.tsx` uses `ContactForm.tsx`, `NetworkCanvas.tsx`, `Reveal.tsx`, and site contact settings.
- `src/components/Certifications.tsx` reads `src/data/certifications.ts` and uses shared reveal/heading UI from `Reveal.tsx`.
- `src/components/Education.tsx` reads education entries from `src/data/timeline.ts` and uses `Reveal.tsx`.
- Other section components (`About.tsx`, `Skills.tsx`, `Projects.tsx`, `Experience.tsx`) render the corresponding portfolio sections and consume data modules where applicable.

## Shared data and utilities
- `src/config/site.ts`: site identity, links, and navigation configuration.
- `src/data/`: portfolio content such as skills, projects, timeline, and certifications.
- `src/hooks/useTheme.ts`: theme state/types used by the application and navigation.
- `src/lib/`: shared application helpers and API/store utilities.

## Editor warning settings
- `.vscode/settings.json` suppresses Tailwind's canonical-class suggestions and generic CSS validator warnings in this workspace.
- These are editor diagnostics only; this setting does not change CSS output or application runtime.
