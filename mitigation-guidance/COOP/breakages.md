# Understanding COOP Breakages

COOP can break things, but it is relatively rare and easy to diagnose. COOP can only cause a breakage if there is a popup involved (see the [FAQ entry "What counts as a popup?"](./faq.md)). So if there is no popup involved, then COOP is not the root cause of the breakage. 

If you used COOP's report-only mode before enabling enforcement, and something has broken from a popup, it is likely one of the three COOP reporting gaps described in the "Coop Reporting Gaps" section. Try to understand the breakage and whether or not it could fall into any of those gaps. 

Another good first step when debugging a breakage is to change the COOP policy to `same-origin-allow-popups` and see whether this fixes it. Oftentimes this policy is necessary, and it represents only a minimal weakening of security. 

One final noteworthy bit here is that enforcing COOP can change the behavior of `window.open` in two different ways:

1. If `window.open` is called from an iframe and the parent page enforces `COOP: same-origin`, then `window.open` will return `null`. This is indistinguishable from how `window.open` behaves if opening the popup is blocked, yet in this case the popup is opened. 
2. Otherwise, the return `window` object will act as if it is pointed to a closed popup. This means the `closed` attribute will be true, and calling any of the methods or setting any fields will do nothing.
