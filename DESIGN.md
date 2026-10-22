# design direction

This file records the direction the site already has. It is not a new
direction, and it was written after the site shipped. The dials below were
inferred from the CSS, copy, and components on 2026-10-22 and approved by the
owner.

## dials

**ENERGY 1 / RHYTHM 2 / MOTION 1**

- **ENERGY 1:** quiet, plain, technical. The site explains and gets out of the
  way. No launch voice, no countdowns, no promotion.
- **RHYTHM 2:** a steady reading rhythm with varied section shapes: rules,
  open project rows, day moments, guide cards. Not a uniform stack, not a
  loud editorial collage.
- **MOTION 1:** motion only where it carries a function. Menus open, focus
  moves, the header tucks on scroll. No entrance animations, no floating
  cards, no decorative loops.

## design read

- **Subject:** small, forkable Linux tools that do one job and leave.
- **Audience:** Linux users who read a README, run a script, and want to know
  what touches their system.
- **Feeling:** calm, competent, slightly domestic. The maid name is a joke
  about upkeep, not a character brand.
- **One visual risk:** sixteen named themes and a lowercase voice could read
  as a gimmick. The restraint, real tool copy, and flat surfaces keep it
  grounded.

## identity

- Lowercase, direct, first-person-plural copy. Short sentences. No marketing
  adjectives.
- The brand is text, not a logo. The name is set in the site's sans stack,
  with a small "project" suffix.
- The recurring gesture is the quiet accent marker at the edge of a project
  row, like a margin note.
- The theme family is a first-class feature, not decoration. The default is
  `maidware`: teal on a near-black blue.

## palette

- Each theme has two core colors and one accent. The 16 themes are presets,
  not one page wearing 16 colors.
- Default `maidware`: background `#1a1b26`, text `#d7dae0`, accent `#5cb9ae`.
- Light themes invert the same roles. Teal, terracotta, rose, green, blue, and
  violet each have a dark and a light expression.
- Contrast is checked at 4.5:1 for normal text across every theme.

## typography

- System sans for prose. It is fast, familiar, and fits the plain page.
- Monospace for commands, paths, and small section labels. The mono labels are
  metadata, not headings.
- Atkinson Hyperlegible is an optional reading face. The accessibility menu
  also offers larger text, more space, and underlined links.

## layout

- One fluid column that grows into a layout. Content never shrinks into a
  narrow card grid on the way up.
- 65rem maximum measure on large screens. Project rows use a 34rem text
  column with room for a detail column.
- The hero headline is the single focal point on the home page. Interior pages
  use their page heading.
- Projects are open rows with a margin marker, not framed cards. Cards are
  reserved for peer items: the five tools and the six principles.
- Equal cards are intentional for peer content. Every card stays identical so
  no tool or principle looks primary.

## icons

- Inline SVG, Lucide-style geometry, one stroke weight.
- Each icon maps to its feature: refresh for updates, upload for file send,
  Bluetooth mark for audio, search, plus for first aid.
- No sparkles, stars, robots, or decorative magic marks.

## motion

- Menus and focus rings use short transitions with a clear state change.
- The header tucks away on scroll down and returns on scroll up or focus.
- `prefers-reduced-motion` removes transitions and smooth scrolling.
- Static content does not lift, float, or fade in on hover or load.

## guardrails

- No gradients, glass, glow, or floating cards on the site.
- No invented statistics, testimonials, team members, or customer logos.
- No generic CTAs. Buttons say what they do.
- No em dashes in new copy. No marketing buzzwords.
- 44px minimum tap targets on phones and touch screens.
- Every theme must keep body, muted, accent, and code text at 4.5:1.
- The site must work without JavaScript for reading. Scripts add theme,
  accessibility, menu, and copy conveniences.

## note on the gate

The design read above is a record of the shipped direction. It was not
declared before the first build. A future redesign should start from this file
and update the dials before writing code.
