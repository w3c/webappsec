# FAQ

## How does a strict CSP work in browsers that don't support CSP3?

When you use a nonce-based policy with strict-dynamic, compatible browsers only execute scripts whose nonce attribute matches the value set in the policy header, as well as scripts dynamically added to the page by scripts with the proper nonce.

* The policy is also backwards compatible with browsers that don't support CSP3: 
Browsers that do not support the CSP3 standard ignore `strict-dynamic`. These browsers see `script-src 'nonce-...' https: http:` which provides minimal protection against XSS vulnerabilities but allows the application to function.
* Browsers that do not support the CSP2 standard ignore 'strict-dynamic' and 'nonce-*'. These browsers see `script-src 'unsafe-inline' https: http:` which does not provide any protection against XSS vulnerabilities but allows the application to function normally.

See [here](https://caniuse.com/?search=strict-dynamic) for up-to-date information on which browsers support strict-dynamic.