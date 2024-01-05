# Rolling out Fetch Metadata Policies

## Understanding Fetch Metadata Headers

There are three different Fetch Metadata headers. Fetch metadata protections inspect some or all of these headers to determine whether a request should be blocked. 

### Sec-Fetch-Site

[`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site) tells you the relationship between the page that initiated the request and your service. It has one of four values:

1. `same-origin` if the initiating page has the same scheme, hostname, and port as your service. 
2. `same-site` if the initiating page has the same registrable domain as your service. 
3. `cross-site` if the initiating page has a different registrable domain than your service. 
4. `none` if there is no initiating page (e.g. the user triggered a navigation). 

Generally FM isolation policies are focused on blocking cross-site requests. For more information on the difference between same-origin and same-site, see [this article](https://web.dev/same-site-same-origin/).

### Sec-Fetch-Mode

[`Sec-Fetch-Mode`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode) tells you the [request mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode) of the request. It can have one of five values: `cors`, `navigate`, `no-cors`, `same-origin`, `websocket`. 

Generally FM isolation policies are focused on blocking `no-cors` requests, but specialized policies may be used for blocking `navigate` or `websocket` requests.

### Sec-Fetch-Dest

[`Sec-Fetch-Dest`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest) tells you the destination of the request. For example, a request triggered via `<img src="...">` would have a `Sec-Fetch-Dest: image` header. 

Some FM isolation policies used the destination to block certain types of requests. The destination is also very useful for understanding reported violations and determining the source of the violation.

## Implementing Fetch Metadata Policies 

Below we outline a number of different FM isolation policies. These policies are described in psuedocode that returns whether or not a request is allowed by the policy. Generally, policies are enabled in three phases:

### Report-Only

Enable a report-only policy where your code logs the result of the policy, the FM headers, and the URL for all requests. This is a safe change that does not cause the service to reject any requests. 

### Exemptions

Based on the collected data from step one, build a list of endpoints that are incompatible with the policy that you want to exempt in order to avoid breaking existing use cases. Embed this list in your service so that it skips applying the policy for these endpoints. As you do this, the number of logged violations should approach zero. 

### Enforcement 

Once you have exempted all endpoints that need to be accessed cross-site, enable enforcement by changing the service to respond with a 403 error to requests blocked by the policy. 

Note that these are described as separate policies in order to make it easier to roll them out, even though [the web.dev article on Fetch Metadata protections](https://web.dev/fetch-metadata/) merges these policies into one policy.

## Resource Isolation Policy (RIP)

Resource Isolation Policy prevents other websites from requesting your resources. Blocking such traffic mitigates common web vulnerabilities such as XSRF, Spectre, and XS-Leaks. RIP can be enabled for endpoints that are not intended to be loaded in a cross-site context. It does not impact resource requests coming from your application as well as direct navigations.

```
def is_allowed_by_rip(req):
  # Allow requests from browsers which don't send Fetch Metadata
  if not req['headers']['sec-fetch-site']:
    return True

  # Allow same-site and browser-initiated requests
  if req['headers']['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
    return True

  # Allow simple top-level navigations, this includes embeds
  if req['headers']['sec-fetch-mode'] == 'navigate' and req.method == 'GET':
      return True

  # Reject all other requests
  return False
```

Once you enable enforcement, you can also set a `Cross-Origin-Resource-Policy: same-site` header on all endpoints that are not exempted from RIP. This will help extend these protections even to browsers that do not support FM headers. 

Generally, RIP is a robust mitigation that is useful to apply to all services.

## Framing Isolation Policy (FIP) 

In order to augment RIP to defend against attacks that use requests triggered by iframes, a Framing Isolation Policy can be deployed. Rather than relying on [client-side framing protections like CSP `frame-ancestors` or `X-Frame-Options`](https://xsleaks.dev/docs/defenses/opt-in/xfo/), framing isolation makes your service reject requests from cross-site iframes so the browser never has to process them. This guards against browser bugs and vulnerabilities taking advantage of browser side channels. 

```
# Reject cross-site requests to protect from CSRF, XSSI, XS-Leaks, and other bugs
def is_allowed_by_fip(req):
  # Allow requests from browsers which don't send Fetch Metadata
  if not req['headers']['sec-fetch-site'] or not req['headers']['sec-fetch-mode'] or not req['headers']['sec-fetch-dest']:
    return True

  # Allow non-navigational requests
  if req['headers']['sec-fetch-mode'] not in ('navigate', 'nested-navigate'):
    return True

  # Allow requests not originated from embeddable elements
  if req['headers']['sec-fetch-dest'] not in ('frame', 'iframe', 'embed', 'object'):
      return True

  # Reject all other requests
  return False
```

Generally it makes sense to deploy FIP in combination with [client-side framing protections](https://xsleaks.dev/docs/defenses/opt-in/xfo/) so that a given endpoint either enforces FIP and sets restrictive framing protection headers, or is exempted from FIP and does not set any framing protection headers.

## Common Difficulties

### Noisy Reports 

Fetch Metadata reports for large websites tend to be very noisy. Oftentimes third-party sites or chrome extensions will trigger cross-site requests that are possible for a service to block without it impacting the service. This means it is generally not practical to aim for exempting all endpoints with violations, and instead human judgement is needed to look at violation reports and determine if they need an exemption or not. 

For example, if an endpoint that returns HTML is being referenced cross-site with a `Sec-Fetch-Dest` of `image`, this violation likely does not need to be exempted.  

### Cross-Browser Compatibility 

Not all browsers support Fetch Metadata so these mitigations cannot be relied on in all cases. Thus, it is generally recommended to use fetch metadata isolation policies as an additional mitigation combined with other defenses. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site#browser_compatibility) for up-to-date information on which browsers support Fetch Metadata. 