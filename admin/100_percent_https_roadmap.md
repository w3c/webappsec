(Note: These were discussion notes for a chat with WebAppSec and the TAG the week of July 14.  I'd consider them somewhat muddled in their thinking and am working on a follow up document that clarifies much of this after we talked through these ideas. -Brad)

100% HTTPS: Speculations on a Roadmap for the entire Web
======================================

Is “Just turn on TLS” and s/http/https/g good enough? 
----------------------------------
* Mixed content and secure <--> insecure information flows can violate the invariants of secure contexts.
* Need a plan to manage upgrading static content, including URLs-as-data and URLs-as-stable-identifiers, to work with secure transports.
* What would it look like if 'http' was a potentially secure scheme?
* How do we avoid flag days as we move to an all secure web?

What does 'secure' http mean?
-----------
* Subsetting?
* Upgrade to all properties of https w/possibility of downgrade attacks

Terminology
-----------
* Resource = some information addressable by a URL / URI
* Application = a graph of resources instantiated in a user agent and labeled with a Web Origin security principal

E.g.: HTTP GET/POST send data from an application to a resource, XHR reads data from a resource into an application, postMessage sends data between two applications

Starting Assumptions
----------------------------------
* Axiom 1: Users cannot meaningfully deal with nuanced security models.  A resource is either secure or it is not.
* Axiom 2: Secure means that the source of information is authenticated and it has privacy and integrity guarantees in transit between the source and the user.
* Axiom 3: (controversial?) We should not ask users to make exceptions or bypass security. (follows from Axiom 1)
* Axiom 4: Applications must be able to require a security contract from user agents on behalf of users.

e.g. 4 if Facebook is going to send a security token somewhere on your behalf, it wants to be sure it will never do so over an insecure channel or one that is only “optimistically” secure.

TimBL: users must be able to control how the user agent trusts on their behalf

The Invariants
----------------------------------
From the Biba and Bell-LaPadula formal integrity models.
* No read up
* No read down / No write up
* No write down
* Tranquility

Complications: Each origin is the authority over its own information flows. User agents try to enforce the contracts an origin requests. Origins can read/write insecurely, but user agents also try to protect users from some classes of incorrect or dangerous actions.

No Read Up
---------------
* Insecure content cannot read secure content.
* Complicated in the context of the Web.
 - Same Origin Policy puts http & https in different origins for application instances, so http application cannot read from https application.
 - But an http resource can request and read or transclude resources with an https scheme.

No Read Down / No Write Up
---------------------------
* A resource should not read information at a lower integrity level than itself.
 - Mixed content blocking
* A resource should not write information to a higher integrity level than itself.
 - Same Origin Policy enforces this for application contexts, but…
 - http resources can GET/POST to https resources
 - Cookies (even w/secure flag) can be written by http and are sent to https
* Distinct invariants, but the web is very bad a data/code separation.
* Even if we wanted to make an exception to Read Down (e.g. to read an open data source that is served only over http) it is impossible to guarantee that No Write Up isn’t also violated. 
 - “optionally blockable” mixed content attempts this distinction, but XHR + JS is not strongly typed enough to allow read down without write up in such an application
* There is also metadata and other information leakage possible in a secure->insecure read operation

No Write Down
-------------
 - Not enforced by today’s browsers unless you ask for it.
 - If an application uses an https URL as the target of a write, it is expressing a no-write-down contract for the user agent to follow.
 - These contracts are important to applications and will be a stumbling block making http URLs acceptable for “general use” through optimistic upgrade w/o guarantees.
 - Content-Security-Policy: upgrade-insecure-navigations *

Tranquility
-----------
* An application does not change between secure/insecure while it is being accessed. 
* Can’t “break the lock” with an insecure XHR after a secure page has loaded.
* This will be an issue to solve for optimistic upgrades of applications addressed by http URLs.
* Much of the complexity of the mixed content model comes from browsers demanding tranquility on behalf of the user from applications that do not self-enforce a tranquil contract.
* Browsers consider the lock a guarantee that they are making to the user, or a promise they won’t let an origin break.
 - Tranquility begins at conception: the moment you type “https” in the address bar or see it in a link.
* There is no way in browsers today to use a secure transport but opt out of mandatory high-security tranquility.

HSTS and Mixed Content
------------
* Currently Mixed Content blocks happen before HSTS upgrades
* Good to identify broken links, bad to make HSTS the most useful possible migration tool

Scheme Upgrading
------------
* Upgrade Insecure Resources Draft
 - Try to modify the scheme of all subresource fetches from http->https
 - And same-origin navigation
* Not a complete solution
 - CSP for form action can help some...
 - postMessage (COWL CSP directive may help)
 - non-same-origin navigations can be risky with GET data
 - what to do with local data?

Transparent (w/http scheme intact) Upgrading
---------
* “Security properties of the Web shouldn’t depend on the s” – paraphrasing TBL 
* http URLs should ideally remain stable identifiers even as we upgrade to secure transports everywhere
* EKR has opined that Mozilla wants to be able to upgrade http URLs to full https equivalency, including checks for valid certificates

Upgrade-related work in the IETF
--------------------------------
* Opportunistic Security
 - https://tools.ietf.org/html/rfc7435 
* TRYTLS
 - New DNS record type w/similar semantics to upgrade-insecure-requests: _http.hostname IN TRYTLS sec-port
 - https://tools.ietf.org/html/draft-hoffman-trytls-02
 - See also: http://tools.ietf.org/html/draft-hoffman-server-has-tls-05
   - Abandoned but revivable w/o fallback language

* HTTP/2 AltSvc
 - https://tools.ietf.org/html/draft-ietf-httpbis-http2-encryption-02
 - DANE TLSRtype?

Transparent Upgrading – What does it mean for the web security model?
----------------
* How to handle tranquility?
* Request to load HTML is upgraded successfully to “full TLS”.   Some earlier resource instance already exists in the browser which was not upgraded.
* Or a later request fails to upgrade.
* What origin-labeled local data does it see? Which HTML messages?

What new primitives do we need?
--------------
* A way for http, upgrade-eligible resources to opt-out of a tranquility contract?
 - Optimistically secure, but no UX guarantees
 - Not eligible for participation in information flows from a tranquil HTTPS resource
 - HTTP header on a per-resource basis, or a TLS flag on a per-origin basis?
 
New SOP and Data Flow Rules?
--------------
* (http) and (http + secure upgrade + tranquil: false) are same origin
* Neither are same origin with (http + secure upgrade)
* No Write Down contracts of https apps that want to accept upgradable http URLs requires that [(http), (http + secure upgrade + tranquil: false)] be hard-blocked for navigation, post message, form submission & mixed content
 - Though tranquil: false might be treated as optionally blockable content is today (e.g. img)
* Browsers need to indicate understanding these contracts before applications will attempt them.
 - DOM feature detection is too late, need a request header; and responses may vary

What about localStorage, indexedDB?
------------
* HSTS directive to one-time migrate http-origin client-side data to https-origin?
* Other alternative is to RT through server or postMessage between windows. :(

Other Issues
----------
* DTDs and Namespaces in XML

Grab bag
---------
* How do we protect anonymous expression on the web in a world of 100% authenticated content? 
 - Are Let’s Encrypt and other free DV issuance enough?





Issues
=========
* What does opting-in to this for servers look like?
* HTTPS Everwhere rules are mostly not "http and https" are equivalent sites
  - some cert errors
  - some Forbes.com stuff
  - mixed content can break lots of stuff
* What about functions only available in secure contexts


Outcomes
=========
* "Problem Analysis" document
   - iframes
   - powerful features
   - local storage instability
* Browsers do phishing protections - why not an HTTPS-Everywhere like list, and make it easy for adminsitrators that don't care much  (Yan says it breaks things, Mike says it takes away control over migrations)
* 

