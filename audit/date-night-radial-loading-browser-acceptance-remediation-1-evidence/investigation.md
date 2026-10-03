# Shared Slider investigation

Authority a1a6a2d2dc718e86f85e1b94769000d200262945; branch created directly from 7b33c6aeb34a625bb9ff0e6427f68821c27ddd74 after fresh main and production checks.

All eight call sites inspected in full: Dinner distance, price and adventure; Date Night distance and mood; Nightlife distance, price and energy. Every caller supplies aria-label. None currently supplies aria-labelledby. Six are single-thumb, two are controlled two-thumb price ranges. Therefore multiple thumbs are existing supported behavior, not hypothetical.

The actual installed Radix Thumb renders span role=slider and spreads thumbProps on that element. Root receives the wrapper naming attributes but has no slider role. Accessible names are not inherited from that ancestor. Radix owns pointer, keyboard, value and focus behavior; its default range names are Minimum/Maximum or numbered values.

Remediation design: destructure aria-label and aria-labelledby from Root props and forward naming to each Thumb. Preserve exact names on single thumbs. For ranges, append minimum/maximum (two values) or value N (three or more). For aria-labelledby ranges, append a unique hidden referenced suffix to the external label IDs. Preserve default Radix naming when no name is supplied. Keep all other root props, values, events, classes and ticks untouched.

The permanent Chromium regression renders actual React/Slider/Radix without mocks, blocks all network and queries getByRole(slider, exact accessible name). The original controlled radial harness and preload remain byte-identical. First hosted regression run stopped on Vite returning an array; no case executed and no product RED claimed for that setup failure. The corrected test is rerunning with runtime source still identical to the start.
