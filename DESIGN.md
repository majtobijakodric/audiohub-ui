# Design System Document: Utilitarian Precision

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Sonic Blueprint."**

Moving away from the decorative and the branded, this system adopts a philosophy of "Radical Functionalism." It treats the desktop application interface not as a marketing tool, but as a high-precision instrument—akin to a technical schematic or a professional mixing console. By stripping away rounded corners, shadows, and borders, we shift the user's focus entirely toward the data and the audio workflow. The "premium" feel is derived from perfect alignment, generous whitespace, and an uncompromising commitment to a binary aesthetic.

## 2. Colors & Surface Logic
The palette is strictly monochromatic, leveraging high-contrast ratios to ensure legibility and a "mechanical" feel.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for defining sections. In this system, boundaries are created through **Tonal Blocking**. By placing a `surface-container-high` element against a `surface` background, we create a clear but borderless structural division.

### Surface Hierarchy & Nesting
Depth is achieved through the "Stacked Vellum" principle. Rather than using shadows to lift elements, we use a progression of surface tiers to denote importance and nesting:
* **Base Layer:** `surface` (#f9f9f9)
* **Secondary Workspaces:** `surface-container-low` (#f3f3f3)
* **Active Components:** `surface-container-highest` (#e2e2e2)
* **Modal/Overlay Layers:** `surface-bright` (#f9f9f9) but distinguished by a `surface-dim` (#dadada) backdrop.

### Signature Textures
While the system is flat, "visual soul" is added through **Micro-Gradients**. Use a subtle linear gradient from `primary` (#000000) to `primary-container` (#3b3b3b) on primary action buttons. This prevents the black from feeling "dead" on the screen, giving it the sheen of anodized aluminum.

## 3. Typography
The typography is the backbone of the utilitarian aesthetic. We use **Inter** for its neutral, neo-grotesque clarity, treating text as a functional data point.

* **Display (Large Scale):** Use `display-lg` (3.5rem) for main track titles or timecodes. These should be tracked tightly (-0.02em) to feel architectural.
* **Headlines & Titles:** `headline-sm` (1.5rem) and `title-lg` (1.375rem) serve as section headers. They must be set in Semi-Bold to provide high-contrast anchors for the eye.
* **Body & Labels:** `body-md` (0.875rem) is the workhorse for all metadata. Labels (`label-md`) must be used for all input headers, often in all-caps with a +0.05em letter spacing to mimic technical equipment labeling.

## 4. Elevation & Depth
In a system with **0px border-radius**, traditional elevation feels out of place. We replace "lift" with **Tonal Layering**.

* **The Layering Principle:** To highlight a specific audio track, change its background from `surface` to `surface-container-high`. This "recesses" or "projects" the content without the need for a 3D shadow.
* **The "Ghost Border" Fallback:** In high-density audio waveforms or complex grids where background shifts aren't enough, use a "Ghost Border": the `outline-variant` token at 15% opacity. It should be felt, not seen.
* **Glassmorphism & Depth:** For floating playback controls, use a `surface` color with 80% opacity and a `backdrop-blur` of 20px. This allows the movement of audio waveforms to be visible beneath the controls, creating an integrated, professional feel.

## 5. Components

### Buttons
* **Primary:** Solid `primary` (#000000) with `on_primary` (#e2e2e2) text. 0px border-radius. High contrast is mandatory.
* **Secondary:** `outline` (#777777) ghost style with 1px width (the only exception to the no-border rule, used for "interactive" affordance).
* **Tertiary:** Text-only, using `primary` for the label. Underline only on hover.

### Input Fields
* **Structure:** No enclosing box. Use a `surface-container-highest` bottom-border (2px) only.
* **State:** When focused, the bottom border transitions to `primary` (#000000).
* **Labels:** Always persistent `label-sm` above the input. Never use placeholder text as a label.

### Lists & Cards
* **The Divider Rule:** Forbid 1px horizontal lines. Separate list items using 0.4rem (`spacing-2`) of vertical whitespace or alternating `surface` and `surface-container-low` backgrounds (zebra striping).
* **Audio Waveforms:** Use `primary` for the foreground and `surface-variant` for the background track.

### Specialized Audio Components
* **Level Meters:** Use `primary` for active segments and `surface-container-highest` for inactive. In error states (clipping), use `error` (#ba1a1a).
* **Knobs/Sliders:** Represented as linear bars. Use `primary-fixed` (#5e5e5e) for the track and `primary` for the "thumb" or active fill.

## 6. Do’s and Don’ts

### Do
* **Do** use the Spacing Scale (specifically `spacing-8` and `spacing-12`) to create "Active Voids"—large areas of whitespace that separate functional groups.
* **Do** align everything to a strict 4px grid. In a utilitarian system, a 1px misalignment is a failure.
* **Do** respect system preferences. In Dark Mode, `surface` becomes the darkest tone and `on-surface` becomes the lightest.

### Don’t
* **Don’t** use rounded corners (`0px` is the absolute rule).
* **Don’t** use drop shadows. If an element needs to stand out, use a higher-contrast background color.
* **Don’t** add branding or "personality." The utility of the tool is the brand.
* **Don’t** use icons without labels unless they are universally understood transport controls (Play, Pause, Stop).