# WebAppSec @ TPAC 2019

Sept. 17th and 19th, 8:30 - 18:00 at the [Hilton Fukuoka Sea Hawk](https://www3.hilton.com/en/hotels/japan/hilton-fukuoka-sea-hawk-FUKHIHI/index.html).

[WebEx info](https://www.w3.org/2019/09/webappsec-tpac.html) (Requires W3C member login.  Ask on IRC if you have difficulty.)

## Sept. 17th ([Sumire - 3F](https://www.w3.org/2019/09/TPAC/schedule.html#map), [Minutes](https://cryptpad.w3ctag.org/code/#/2/code/edit/dzuWzpkucqW3VtOzc13CAoMZ/))

* 9:00 - 9:30 - Introductions, problem statements, framing the next day and a half.
* 9:30 - 10:00 - [Something california-friendly, e.g. `Sec-Origin`]
* 10:00 - 10:30 - [Continuous specification](https://www.w3.org/wiki/Evergreen_Standards) ([plh@](https://github.com/plh), [wseltzer@](https://github.com/wseltzer))
* 10:30 - 11:00 - ☕ Coffee
* 11:00 - 12:00 **CSRF / 👻Spectre👻 / XSLeaks**
  * [Fetch Metadata](https://github.com/w3c/webappsec-fetch-metadata)
  * COOP/[CORP](https://fetch.spec.whatwg.org/#cross-origin-resource-policy-header)/[COEP](https://github.com/mikewest/corpp)
  * Double-keyed (or more) caches
  * Origin-level isolation
* 12:00 - 12:30 - **Networky things**
  * [MIX2](https://w3c.github.io/webappsec-mixed-content/level2.html)
  * HSTS: [Apple's mitigations](https://webkit.org/blog/8146/protecting-against-hsts-abuse/), [Strict-Navigation-Security](https://github.com/mikewest/strict-navigation-security)
  * Intranet / Internet: [CORS-RFC1918](https://wicg.github.io/cors-rfc1918/)
* 12:30 - 13:30 - 😋 Lunch 😋
* 13:30 - 14:30 - **Authentication**
  * [`IsLoggedIn` API](https://lists.w3.org/Archives/Public/public-webappsec/2019Sep/0004.html) ([@johnwilander](https://github.com/johnwilander))
  * [HTTPStateTokens](https://github.com/mikewest/http-state-tokens) / Cookies
* 14:30 - 15:30 - **Feature Controls**
  * [Feature/Document/* Policy](https://www.w3.org/TR/feature-policy/) ([@clelland](https://github.com/clelland))
    * [Cookie Controls](https://github.com/w3c/webappsec-feature-policy/issues/85)
    * [`<meta>`](https://github.com/w3c/webappsec-feature-policy/issues/55)
  * Protecting/sandboxing `<iframe>` sites (history.length, caches, window[i])
  * [Origin Policy](https://wicg.github.io/origin-policy/)
* 15:30 - 16:00 - ☕ Coffee ☕
* 16:00 - 17:00 - **Injection**
  * [Trusted Types](https://github.com/WICG/trusted-types) ([@koto](https://github.com/koto))
  * [CSP3](https://github.com/w3c/webappsec-csp)
  * [CSP Next](https://github.com/mikewest/csp-next)

## Sept. 19th ([Navis C, 1F](https://www.w3.org/2019/09/TPAC/schedule.html#map)) 

(_We'll fill day 2 will topics that we didn't get through on day 1, as the schedule is optimistic._)

* 12:00 - 13:00 - 😋 Lunch 😋
* 13:00 - 14:00 - Cleanup
  * Moving CRs to Recommendations: 
    * [Referrer Policy](https://www.w3.org/TR/referrer-policy/)
    * [Secure Contexts](https://www.w3.org/TR/secure-contexts/)
    * [Mixed Content](https://www.w3.org/TR/mixed-content/)
    * [Upgrade Insecure Requests](https://www.w3.org/TR/upgrade-insecure-requests/)
  * Getting to CR: 
    * [Clear-Site-Data](https://www.w3.org/TR/clear-site-data/)
    * [Credential Management](https://www.w3.org/TR/credential-management/)
    * [Embedded Enforcement](https://www.w3.org/TR/csp-embedded-enforcement/)
  * Should we obsolete [UI Security and Visibility API](https://www.w3.org/TR/UISecurity/) in favor of [IntersectionObserver v2](https://w3c.github.io/IntersectionObserver/v2/)
* 14:00 - 14:30 - Process things.
    * [Charter](https://www.w3.org/2019/03/webappsec-2019-charter.html) still reasonable?
    * Putting privacy more clearly in scope and make browser privacy policies part of the security review process?
    * Relationship with other groups (TAG, PING, HTTPbis, etc.)
    * Security reviews of upcoming features.
    * Various browsers' launch processes

---

## Leftover Topics

* ???
    
Suggestions? https://github.com/w3c/webappsec/issues/555 would be a great place to make them.
