# FAQ

## Is deploying Resource Isolation Policy enough to protect from CSRF and XSSI vulnerabilities? 

It depends on which browsers your application supports. The latest versions of Chrome, Firefox, and Safari all support Fetch Metadata headers so RIP can be used as a primary defense in these browsers. But some other browsers (and older browser versions) don’t support Fetch Metadata headers, so we still recommend adopting other defenses and using RIP as a secondary defense. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site#browser_compatibility) for more information on browser compatibility. 

## Does this break browser extensions accessing resources from my application? 

No, it shouldn't. When browser extensions request a resource from a site they have `host` permissions to access, the request is sent as `Sec-Fetch-Site: none` and thus it will not be blocked by any of these isolation policies. 
