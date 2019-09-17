# WebAppSec @ TPAC 2019

Sept. 17th and 19th, 8:30 - 18:00 at the [Hilton Fukuoka Sea Hawk](https://www3.hilton.com/en/hotels/japan/hilton-fukuoka-sea-hawk-FUKHIHI/index.html).

[WebEx info](https://www.w3.org/2019/09/webappsec-tpac.html) (Requires W3C member login.  Ask on IRC if you have difficulty.)

## Minutes

**<https://bit.ly/webappsec-minutes-tpac-2019>**

## Sept. 17th ([Sumire - 3F](https://www.w3.org/2019/09/TPAC/schedule.html#map))

* 9:00 - 9:15 - Introductions, problem statements, framing the next day and a half.
  * Artur Janc's ["Baby Steps Towards the Precipice"](https://www.arturjanc.com/usenix2019/) is helpful reading.
* [Deian will dial in at some point to discuss [`Sec-Same-Origin`](https://docs.google.com/document/d/1wKWuN61MIY5AZYNeR2JQ1MB6A1Bmj0k3RFJVh1ktufw/edit#)]
* 9:15 - 10:00 - **Secure Transport**
  * [MIX2](https://w3c.github.io/webappsec-mixed-content/level2.html)
    * FPWD?
  * HSTS fingerprinting: [Apple's mitigations](https://webkit.org/blog/8146/protecting-against-hsts-abuse/), [Strict-Navigation-Security](https://github.com/mikewest/strict-navigation-security)
    * [`SameSite=None;Secure`](https://mikewest.github.io/cookie-incrementalism/draft-west-cookie-incrementalism.html#rfc.section.3.2)
    * ["same site" && schemes](https://github.com/whatwg/url/issues/448)
    * RFC6797bis?
  * Intranet / Internet: is [CORS-RFC1918](https://wicg.github.io/cors-rfc1918/) the right goal?
* 10:00 - 10:30 - [Continuous specification](https://www.w3.org/wiki/Evergreen_Standards) ([plh@](https://github.com/plh), [wseltzer@](https://github.com/wseltzer))
* 10:30 - 11:00 - **☕ Coffee**
* 11:00 - 12:15 - **Injection**
  * [Trusted Types](https://github.com/WICG/trusted-types) ([@koto](https://github.com/koto))
  * ["Strict CSP"](https://csp.withgoogle.com/docs/strict-csp.html) && [CSP Next](https://github.com/mikewest/csp-next)  
* 12:15 - 13:30 - 😋 Lunch 😋
* 13:30 - 14:45 - **Authentication**
  * [`/.well-known/change-password`](https://wicg.github.io/change-password-url/index.html)
  * [`IsLoggedIn` API](https://lists.w3.org/Archives/Public/public-webappsec/2019Sep/0004.html) ([@johnwilander](https://github.com/johnwilander))
  * [HTTPStateTokens](https://github.com/mikewest/http-state-tokens)
  * [Credential Management](https://w3c.github.io/webappsec-credential-management/)
* 14:45 - 15:30 - **Feature Controls**
  * [Feature/Document/* Policy](https://www.w3.org/TR/feature-policy/) ([@clelland](https://github.com/clelland))
    * [Cookie Controls](https://github.com/w3c/webappsec-feature-policy/issues/85)
    * [`<meta>`](https://github.com/w3c/webappsec-feature-policy/issues/55)
  * Protecting/sandboxing `<iframe>` sites (history.length, caches, window[i])
* 15:30 - 16:00 - ☕ Coffee ☕
* 16:00 - 17:00 - **Origins, and Sites, and Entities, oh my.**
  * ["same site" && schemes](https://github.com/whatwg/url/issues/448)
  * [First-Party Sets](https://github.com/krgovind/first-party-sets)
  * [Public Suffix List](https://publicsuffix.org/), and [its problems](https://github.com/sleevi/psl-problems/)


## Sept. 19th ([Navis C, 1F](https://www.w3.org/2019/09/TPAC/schedule.html#map)) 

* 12:00 - 13:00 - 😋 Lunch 😋
* 13:00 - 14:30 - **CSRF / 👻Spectre👻 / XSLeaks**
  * [Fetch Metadata](https://github.com/w3c/webappsec-fetch-metadata)
  * COOP
  * [CORP](https://fetch.spec.whatwg.org/#cross-origin-resource-policy-header)
  * [COEP](https://github.com/mikewest/corpp)
  * Double-keyed (or more) caches
  * Origin-level isolation
  * [Origin Policy](https://wicg.github.io/origin-policy/)
* 15:00 - 15:30 - ☕ Coffee ☕
* 15:30 - 16:00 - Cleanup
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
* 16:00 - 17:00 - Scoping the group, in light of everything above.
    * [Charter](https://www.w3.org/2019/03/webappsec-2019-charter.html) still reasonable?
    * Putting privacy more clearly in scope and make browser privacy policies part of the security review process?
    * Relationship with other groups (TAG, PING, HTTPbis, etc.)
    * Security reviews of upcoming features.
    * Various browsers' launch processes

---

## Leftover Topics

* Cooperative deprecations (MIME sniffing, `document.domain`, DOM clobbering, etc)
* ???
    
Suggestions? https://github.com/w3c/webappsec/issues/555 would be a great place to make them.
