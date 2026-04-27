# Design System

## Visual Theme

The page is a mobile-first survey with an Airbnb-inspired, product-register treatment. It should feel calm, tactile, and premium, with white-leaning warm surfaces, rounded controls, clear progress, and one coral primary action. Design serves completion speed, so decoration must not compete with form clarity.

Physical scene: a busy executive or developer opens the survey on a phone in daylight, likely between meetings, and needs a polished but low-friction way to answer before context switches.

## Color Strategy

Restrained. Use tinted neutrals for the interface and Rausch coral only for the primary CTA, selected progress, and small brand moments.

Core tokens:

- Rausch: `oklch(63.7% 0.237 17.9)`, primary action and selected progress
- Deep Rausch: `oklch(55.3% 0.231 17.3)`, hover and pressed action states
- Plus Magenta: `oklch(42.9% 0.164 355.1)`, terminal stop in narrow progress gradients
- Ink: `oklch(24.4% 0.006 24)`, main text and selected chips
- Charcoal: `oklch(33.7% 0.006 24)`, secondary emphasis
- Ash: `oklch(48.4% 0.006 24)`, metadata and helper text
- Canvas: `oklch(99.2% 0.004 24)`, primary surface
- Soft: `oklch(96.8% 0.006 24)`, secondary surface
- Hairline: `oklch(88.4% 0.005 24)`, borders

## Typography

Use the existing single-family stack: Airbnb Cereal VF when available, then Circular and native sans fallbacks. Keep labels dense and confident with 700 to 850 weights. Body copy should stay around 15px to 16px on mobile with a comfortable line height and a maximum line length near 65 characters.

## Components

- Topbar: compact brand mark, current scene, and duration pill.
- Intro: short editorial title, one paragraph, and circular completion indicator.
- Scene strip: four clear scene states, current and done states must be visually distinct.
- Progress card: sticky status prompt with a narrow progress bar.
- Panels: form sections with visible section numbers, strong headings, and active focus affordance.
- Role options: two large touch targets with selected state, hover, focus, and active states.
- Chips: pill controls with selected, hover, focus, and active states.
- Sticky submit: bottom action bar on mobile, centered floating bar on larger screens.
- Feedback: success and error messages with semantic color tokens and recovery-oriented copy.

## Layout

Mobile is the primary target. Use a 14px page gutter on small screens, 16px to 20px panel padding, and 8px to 14px gaps inside form groups. Touch targets must be at least 44px high. Desktop should not become a wide landing page, it should remain a centered mobile-quality form with more breathing room.

## Motion

Use short ease-out motion for state changes. Animate opacity and transform only. Progress changes can animate over about 360ms, while button feedback should remain around 120ms to 160ms. Respect `prefers-reduced-motion`.

## Copy

Korean copy should be direct and reassuring. Avoid exam-like language. Labels can be brief, but prompts should explain the next action clearly. Do not add decorative slogans if they do not help completion.
