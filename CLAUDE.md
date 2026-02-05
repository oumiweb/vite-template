# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vite-based static site development template using FLOCSS + BEM + Handlebars. The project is a Japanese-language static site with component-based architecture.

## Commands

**Package manager: yarn only (npm is prohibited)**

```bash
yarn dev        # Start dev server (SCSS watcher + Vite HMR on localhost:5173)
yarn build      # Format + clean dist + build (runs lint-fix and prettier-fix automatically)
yarn preview    # Preview built site
yarn format     # Run ESLint fix + Stylelint fix + Prettier fix
yarn _lint      # Check only (ESLint + Stylelint)
yarn _prettier  # Check only (Prettier)
```

## Architecture

### Build Pipeline
- **Vite 5** with Handlebars templates, SCSS (via sass-glob-import), PostCSS/Autoprefixer, and image optimization (sharp/vite-plugin-image-optimizer)
- Dev mode auto-converts images to WebP via custom plugin (`bin/vite-plugin-convert-images.js`)
- SCSS glob watcher (`bin/watch-scss-globs.js`) runs alongside Vite via concurrently

### Source Structure (`src/`)
- **HTML pages**: `index.html`, `_components.html`, `contact/index.html`, `contact/complete.html`
- **`components/`**: Handlebars partials loaded via `{{> partial-name}}`. File names match CSS class names (e.g., `p-header.html` → `.p-header`)
- **`data/meta.json`**: Per-page metadata (title, description, ogImage) keyed by page path. Injected into templates as `{{page.title}}`, etc.
- **`assets/styles/`**: FLOCSS structure — `foundation/`, `global/`, `layouts/`, `components/`, `projects/`, `utilities/`. Entry: `style.scss` uses glob imports (`@use "components/**"`)
- **`assets/js/`**: ES modules. Entry: `script.js` imports feature modules (`_drawer.js`, `_mv-slider.js`, `_viewport.js`, `_form-validation.js`)
- **`public/`**: Static assets copied as-is (OGP, favicon). No hash in URLs
- **`assets/images/`**: Content images. Build adds hash for cache busting

### Path Aliases (vite.config.js)
- `@` → `src/assets/styles/`
- `@js` → `src/assets/js/`

### Handlebars
- Partials directory: `src/components/`
- Custom helper: `{{br text}}` converts `\n` to `<br>`
- Context: page metadata from `data/meta.json` + `brTxt` variable

## Coding Conventions

Full details in [doc/coding-guidelines.md](doc/coding-guidelines.md).

### CSS/SCSS — Critical Rules
- **FLOCSS prefixes**: `l-` (layout), `c-` (component), `p-` (project), `u-` (utility)
- **BEM elements must be flat** — never nest `&__element`. Write `.c-card__item {}` as a separate rule, not inside `.c-card {}`
- **Nesting allowed only for**: pseudo-elements/classes (`&:hover`, `&::before`), state classes (`&.is-open`), and `@include mq()`
- **Units**: Use `calc(value * var(--to-rem))` for rem conversion, never raw `px`
- **Logical properties**: Use `margin-block-start`, `padding-inline`, etc. instead of physical properties
- **Modifiers**: `.c-button.c-button--large {}` (not `&--large`)
- **Breakpoints** (mobile-first): `@include mq("sm"|"md"|"lg"|"xl")` — sm:600px, md:768px, lg:1024px, xl:1440px
- **Global imports**: Each SCSS file uses `@use "../global" as *;`

### HTML
- Semantic HTML elements required
- Root-relative paths for assets (`/assets/images/...`, not `./`)
- UTF-8 characters directly (not HTML entities)
- Images: always specify `width`, `height`, `alt`. Use `loading="lazy"` except for MV. Use `fetchpriority="high"` for LCP images

### JavaScript
- ES modules only (`import`/`export`)
- `const`/`let` only (no `var`)
- Update `aria-*` attributes when toggling interactive elements

### Images
- Naming: `category_name_number.ext` (lowercase, underscores) — e.g., `bg_sample.png`, `image_mv_01.webp`
- All images flat in `images/` directory (no subdirectories)

## Git Conventions

Details in [doc/pr-issue-guidelines.md](doc/pr-issue-guidelines.md).

- **Branch names**: `<type>/<summary>` — e.g., `feature/add-header-component`, `fix/resolve-drawer-scroll-issue`
- **Commit messages**: `<type>: <summary>` — types: `add`, `fix`, `update`, `refactor`, `style`, `docs`, `chore`
- **GitHub Flow**: All changes via PR to main. No direct push to main
- **Run `yarn format` before committing**
