---
component_version: "1.0.0"
name: tour-usage
description: >
  Use after component-usage-ux for guided walkthroughs with @techsio/ui-kit Tour:
  tooltip/dialog/floating steps, target resolution, interactive wait effects,
  imperative control, shared action buttons, cleanup and app-owned onboarding policy.
type: core
library: "@techsio/ui-kit"
library_version: "0.3.2"
requires:
  - component-usage-ux
  - zag-compound-components
  - app-token-overrides
sources:
  - "libs/ui/src/molecules/tour.tsx"
  - "libs/ui/src/tokens/components/molecules/_tour.css"
  - "libs/ui/stories/molecules/tour.stories.tsx"
  - "libs/ui/test/tour.spec.ts"
  - "https://zagjs.com/components/react/tour"
---

# @techsio/ui-kit Tour Usage

Use Tour to explain an existing interface. Use Steps for a wizard/progress
workflow, Tooltip for a short contextual hint, and Dialog for an independent
modal task. Tour owns one Zag machine, not nested Tooltip/Dialog machines.

## Setup

```tsx
import { useRef } from "react"
import { Button } from "@techsio/ui-kit/atoms/button"
import { Tour, type TourStep } from "@techsio/ui-kit/molecules/tour"

function WorkspaceGuide() {
  const target = useRef<HTMLButtonElement>(null)
  const steps: TourStep[] = [
    {
      id: "welcome",
      type: "dialog",
      title: "Welcome",
      description: "A quick introduction to your workspace.",
    },
    {
      id: "create",
      target: () => target.current,
      title: "Create a project",
      description: "Start your next project here.",
    },
  ]

  return (
    <Tour steps={steps}>
      <Tour.Trigger>Start guide</Tour.Trigger>
      <Button ref={target}>Create project</Button>
      <Tour.Portal>
        <Tour.Backdrop />
        <Tour.Spotlight />
        <Tour.Positioner>
          <Tour.Arrow />
          <Tour.Content>
            <Tour.CloseTrigger aria-label="Close guide" />
            <Tour.Title />
            <Tour.Description />
            <Tour.ProgressText />
            <Tour.Actions>
              <Tour.ActionTrigger action="skip" theme="borderless">
                Skip guide
              </Tour.ActionTrigger>
              <Tour.ActionTrigger action="prev" theme="outlined">
                Back
              </Tour.ActionTrigger>
              <Tour.Context>
                {(api) => (
                  <Tour.ActionTrigger action={api.lastStep ? "dismiss" : "next"}>
                    {api.lastStep ? "Finish" : "Next"}
                  </Tour.ActionTrigger>
                )}
              </Tour.Context>
            </Tour.Actions>
          </Tour.Content>
        </Tour.Positioner>
      </Tour.Portal>
    </Tour>
  )
}
```

Title and Description default to the current step's React content; provide
children to override it. Put Arrow beside Content in the Positioner so a
scrolling Content does not clip it. Backdrop and Arrow respect the current
step's backdrop/arrow flags. Portal is explicit and has Zag Portal options.

## Public contract

- Root: required initial `steps`, optional `id`, `dir`, machine translations,
  outside/Escape handlers, `closeOnEscape`, `closeOnInteractOutside`,
  `keyboardNavigation`, `preventInteraction`, spotlight geometry and callbacks.
- No automatic start, persisted completion, router, analytics store or global
  onboarding registry. The app owns these decisions.
- No Root `open`, controlled `stepId`, `defaultStepId`, size or visual variant
  props. `steps` initializes the machine; changing the prop does not replace it.
- Context exposes `start(id?)`, `setStep(id)`, `setSteps(steps)`, `addStep`,
  `updateStep`, `removeStep`, `next`, `prev` and Zag
  state/part getters. Use these instead of duplicating machine state.
- Dismiss and skip use ActionTrigger actions or the callback action map,
  not additional Context methods.
- Preserve the active id when replacing steps during a tour. To replace the
  active step with unrelated ids, dismiss first and start after the updated
  step list has rendered. Do not batch setSteps and setStep for a new id in
  one event; the pinned machine can read the previous list in that batch.
- Floating placement accepts center and the twelve side/alignment values.
  Top/bottom start/end follow dir; left/right remain physical viewport sides.
- Trigger accepts an optional starting `stepId`, Button props and a React 19 ref.
  It is disabled for empty or already-active tours.
- ActionTrigger accepts `next | prev | dismiss | skip` or a callback receiving
  the Zag action map. Other props are Button props, including ref, loading and
  disabled. Label the action with children or an explicit aria-label.
- CloseTrigger is an ActionIcon; supports its icon/size/tone/ref props and
  preserves explicit aria-label over the translated default.
- Consumer click handlers run first; `event.preventDefault()` cancels the
  machine action. Controls default to type=button.
- A final-step dismissal follows Zag's semantics: dismissed, then completed.
  Earlier dismissal and skip do not complete the tour. The onStepChange
  `complete` flag means the final step is selected, not that the user finished.
- Use `getProgressText()` / `getProgressPercent()` for displayed progress:
  wait steps are excluded. Machine callback indexes refer to the raw step list.
- Render against `api.open`, not the presence of a step: resolving and waiting
  steps intentionally have no visible overlay.

## Waits, effects and targets

Targets are lazy HTMLElement resolvers. Give every step a unique id and either
a target or an explicit type. A missing target is observed for up to 3000ms in
the pinned release, then ends with not-found. There is no targetTimeout prop
and no automatic skip. Route/loading fallback belongs to the app.

Use type=wait for asynchronous work. It has no panel and is not counted in
visible progress. Effects return cleanup functions. Cancel subscriptions,
timers and pending work in cleanup; do not leave a listener alive after exit.

```tsx
{
  id: "wait-for-connection",
  type: "wait",
  title: "Waiting",
  description: "Connect your account to continue.",
  effect({ next, dismiss }) {
    const controller = new AbortController()
    const button = document.querySelector<HTMLButtonElement>("#connect")
    button?.addEventListener("click", next, { signal: controller.signal })
    // App code may call dismiss on cancellation/error.
    return () => controller.abort()
  },
}
```

For a regular visible step with an effect, call show to display it; wait steps
are shown as a hidden waiting state automatically. Keep targets stable while
their step is visible. Use wait steps when the app changes routes or swaps DOM.

The adapter preserves one machine while correcting pinned Zag 1.41.2 gaps:
skip triggers, effect dismissal/timeout cleanup, final focus return and RTL
boundary navigation, late-target inert handling and overlay/arrow layering.
Re-test these before changing the dependency version.

## Styling and accessibility

Use Tour tokens for panel/arrow/scrim/text/spacing/radius/shadow. Controls retain
Button and ActionIcon tokens; do not restyle them with private Tour colors.
No entry/exit animation is promised. Target coordinates, viewport constraints
and overlay layers are runtime CSS, not fixed design-token values.

Keep Title and Description mounted for the alertdialog's accessible naming.
Translations provide machine labels/progress; visible action labels are app
children and must be translated too. Keyboard arrows do not navigate while
editing an input/textarea/select/contenteditable element.

Validate all themes and viewports used by the app. The repository's strict
APCA gold checks also report inherited shared Button states; do not disable
those checks or silently claim full accessibility certification.

## Validation

```sh
pnpm --dir libs/ui exec tsc --noEmit --incremental false -p tsconfig.json
pnpm --dir libs/ui check:package
pnpm exec playwright test -c libs/ui/test/tour.playwright.config.ts
```

The focused Playwright config expects an already running Storybook on 6006.
Override TOUR_STORYBOOK_URL for another preview; PLAYWRIGHT_CHANNEL selects
an installed browser when needed. Tour stories are tagged tour.

## Figma handoff

The component is code-owned pending an explicit component-to-figma migration.
Do not create a fake Code Connect URL or claim that Figma is synchronized.
Carry the visual/runtime coverage matrix into the handoff; verify dependent
Button/ActionIcon instances, alias chains and real Storybook screenshots first.
