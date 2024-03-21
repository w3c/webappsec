# Cross-Origin Opener Policy (COOP)

[Cross Origin Opener Policy (COOP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) is an isolation mechanism that can be used to protect a site's top level `window` object from third-party sites. This defends against [Tabnabbing](https://en.wikipedia.org/wiki/Tabnabbing) and many [XS-Leaks](https://xsleaks.dev/). COOP can also be combined with [COEP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) in order to achieve process-isolation and access additional powerful web APIs. See [this web.dev article](https://web.dev/coop-coep/) for more background information and an introduction to defending your site with COOP.

## Table of Contents

- [Rolling out COOP](./rollouts.md)
- [Understanding COOP Breakages](./breakages.md)
- [FAQ](./faq.md)
