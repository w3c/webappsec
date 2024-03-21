# FAQ

## What benefit does same-origin have over same-origin-allow-popups?

A significant benefit! We generally recommend that sites enforce a COOP policy of `same-origin` if possible. Suppose that your site, `example.com` is a social network. If a user receives a message from someone else, they can click on a link and it will open the link in a popup. If your site uses `same-origin-allow-popups` then that opened site gets a reference to your site's `window` object and thus can still do many XS-Leak attacks.

## What about restrict-properties? 

We generally recommend thinking about restrict-properties as a relaxation compared to same-origin, but a reasonable one that sites can use if necessary. For example, if you have a specific page that needs to be opened in a popup, consider using restrict-properties to protect it. This provides more protections than same-origin-allow-popups and also makes it possible to achieve cross-origin isolation. The one downside to using restrict-properties is that it is currently a Chromium-only feature.

## What counts as a popup?

For the purposes of COOP, a popup is a new tab or a new window that is created via `window.open` or setting a `target="foo"` attribute on an anchor tag. Note that browser-created modals (like `alert` and `confirm`) and HTML modals overlaid on top of an existing page are not popups.
