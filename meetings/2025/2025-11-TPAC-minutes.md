# WebAppSec WG - TPAC 2025-11

## Monday, 2025-11-10

**Participants:**

* Mike West, Google
* Simone Onofri, W3C
* Tom Van Goethem, Google Chrome
* Dan Veditz, Mozilla (remote)
* Artur Janc, Google
* Marian Harbach, Google Chrome
* Camille Lamy, Google
* Simon Wijckmans, cside
* Chris Fredrickson, Google Chrome
* Joe DeBlasio, Google Chrome (remote)
* Carlos Ibarra Lopez, Google Chrome
*Fabio Rocha, Microsoft
*David Risney, Microsoft
*Shunya Shishido, Google Chrome
*Antonio Sartori, Google Chrome
*Nidhi Jaju, Google Chrome
* Ari Chivukula, Google Chrome
* Anna Weine, Mozilla
* Dan Rubery, Google Chrome
* Mike Taylor, Google Chrome
* Kouhei Ueno, Google Chrome
*  Amir Sharif, W3C Invited Expert
* Pascoe, Apple
* John Wilander, Apple
* Matthew FInkel, Apple WebKit
* Dominic Farolino, Google Chrome
* _Your name here!_

Agenda: https://github.com/w3c/webappsec/blob/main/meetings/2025/2025-11-TPAC-agenda.md

### [HTTP Link header on subresources](https://docs.google.com/document/d/1OeqpA9JoCXrgIMpq-ujLuZF1tG9MNF5SA0zTuIFtZis/edit)

Takashi: from Chrome Loading. Restriction on Link Header on subresrouces
Speaking about link - we have two types of link - one in resp header, one in HTML
the unique thing about the former is that they can appear in subresource responces. like image

primary motivation - vulnerabilities have been resported to Chromium that exploits the processing of link rel resp header appearing on subresources
not unique to Chrome - I see this as a lack of spec of how to process subresource lnk rel 

Will go through 2025 CVE. talk about mitigation, seeking for fb

First on the CVE - Referrer leakage. Attacker can steal OAuth, etc secret info in the referrer url by injecting img tag to the victim page. The scenario is as follows - in the victim.example they have oauth secret in the URL. let's say that the attacker can inject their own images to the website. say attacker.example/image.png. In the example, the attacker may respond with a link=rel preload for log.png. Chromium, sbject to the vuln, issued the preload fetch request with the Referrer poloicy of the document, which in turn leaked the full url with the secret. The referrer value being the victim pages one.

victim.example serves the img tag with the src url -> attacker.example/image.png with a malicious link rel=preload -> attacker/log endpoint is fetched with the sensitive token in the referrer

Currently, this vuln is fixed, however how to process the link is different among different ua.s
Chromium preload from link header - now doesn't send any referrer. Safari currently sends Referrer with( more restriction). Firefox doesn't handle any link header on subresources - no request sent.

link rel=preload,connect,... can be dangerous as shown here. Referrer leak is the real problem. ?? Privacy leakage.. Possibility of unforeseen risks here.
link header itself is widely used - google fonts has preconnect hint served and this has positive gain
pinterest does images
shopify has another rel types.

http archive analysis - ...% point to cross-site. ..% on subresources. Widely used
Top 10 rel types. 29% preconnect. 3% preload

Primary issue - HTML spec do not include processing model for how to process link for subresrouces. Found existing discussion but no conclusion seems to be reached. 

link header on subresources - ambiguity on: who should be client (initiator document, or subresource itself). Seems like the root confusion.

For this, I propose the following otpions:
    1. deprecate all link header on subresources.
2.  deprecate all link header that can make network fetches. 
3. deprecate on cross-origin subresources (however >50% of the use-cases affected - httparchive data)
4. deprecate crossorigin subresources that result in HTTP fetch (sound quite safe - we lose opportunity for preload feature)
5. dns-preload/preload + allowing compression-dictionary that is newly proposed. compression dictionary fetch can be limited to be safe.
6. keep the status quo. we apply sanitization to the requst to ensure safe. - still needs clarification on the fetch

these are the proposals. open to suggestions/thoughts. 

domfarolino - Google Chrome: Preload was always sent to the attacker url, no sanitization?
tnak: original document policy was applied. the GET request - 
hiroshige: just follow normal request - follows Referrer Policy specified by the ... is directly applied
domfa: Default on the web was... / if the resource that had link preload on it specifid - we could set it to unsafe and .. is that the vuln? -> yes
domf: I like proposal 4 - somewhat surgical, but works. one included we only allow preloads - on link rel preload data url would work but http band - this sounds complicated so banning HTTP *fetch* sounds simpler.

domf: I want to ask about Option 6. Is this basically - just spec the processing model? clean up so we don't run into ... / spec the processing mode and we can iron out the complexity.
tnak: yes. spec. cleanup and needs some impl change but basically spec clean up and clarification. the other options are simply banning
domf: gotcha
domf: kinda like Opt 6. we could keep the performance benefit. There is some appeal to that. I want to hear the room on the cross vendor input. What would the other browsers think? or should we delete the whole thing?

dveditz: I have opinions - It seems like the fundamental problem. is referere being sent ... referrer polciy. This seems broken. the original with the link header - the answer - it would be useful to send something or not would be useful or not. You should be using the original document's referrer policy and ignore the referrer policy specified on the subresource. % CSS where the CSS is the client. Ignore the link policy on the link header .vs.
domf: CSS is not the only case where the CSS is the new referrer. This is also the case for module scripts.
domf: Should we spec all that? or do we want to deprecate the whole thing?
dveditz: seems simple enough - it seems quite clear. We could do this on top of types, but that seems much dicier. Any types could  be intact - ...

artur Google Security: CSP is not yet touched. What Dan has hinted at - we want to apply policies of the document - original resource - we are leaking the ... similar for the CSP, if the document is loading the resource. Img src allowlist. If img wants to load outside of the allowlist - it is ... from CSP perspective. broader - link requests alignd with all the security policies of the document. Refferr policy - but there are other policies. Conceptualy, it makes sense to have the document policy to be respected when the resources are loaded. If we are to pursue Opt 6 - it seems reasonable to respect all doc policy.
tnak: i dont have ... for restriction doc - i was more here for if ??? additional restrictions specific to subresource prefetch - basic auth are disabled, ... there are some issues beyond policiies tbh. i couldn't find the comprehensive list of the subresource restrictions.
artur: ...

mkwst: where is the right place for this conversation?
tnak: please directly talk to tnak/hiroshige or leave comments on doc or the issue
domf: would like to hear more from WebKit. HTML editor hat on - this is fun to spec/ but otoh maybe we should just kill it.
dveditz: link to the original issue?
tnak: thanks all

### Integrity: Signature-based checks for [subresources](https://wicg.github.io/signature-based-sri/#threat-model) and [inline](https://mikewest.github.io/inline-integrity/) content

[Slides](https://github.com/w3c/webappsec/blob/main/meetings/2025/2025-11-10-signature-based-integrity.pdf)

mkwst: Let's talk about signature-based integrity. There are remote resources and inline resources (e.g. <script>). [Mike describes slide showing the current HTTP header signature mechanism].

Allows servers to prove the provenance of their content. Very flexible model. Slide shows only signing unencoded-digest, but could sign some request headers, response headers, or some other metadata.

Initiators of requests can also require that requests are signed by certain keys. Examples in Content-Security-Policy or integrity attribute. Combined, give a measure of supply chain integrity.

Several open questions. Replacement attacks let an attacker replace one signed resource with another. If the server has signed bad.js previously, the attack can respond to a request for good.js with bad.js. bad.js can be an old version of good.js, in which case it's a rollback attack. Similarly, can serve a redirect to some other endpoint with a signature. Mike's conclusion is that it's good to do something about these attacks, but it's not clear whether these should be required or optional. For example, expiration dates can help here. Should sites be able to require that signatures have expiration dates? What about key rotation?

Hash-based integrity guarantees a particular resource. Signature-based integrity only guarantees that the resource was signed by a party who has the key. Do developers understand the difference in guarantees here? 

Some of this was motivated by regulatory requirements (e.g. payments needs PCI DSS). Does this satisfy those obligations?

Key compromise is a big problem for signature based integrity. Today sites have to serve a new key in their policies. Could do better here at the cost of more complexity. For example including keys in DNS. Is this work necessary? How should it be shaped?

Integrity for inline resources seem less necessary, given that the key, content, and signature will all be in the same request. But page service is complicated. CDNs will help combine requests to resolve third-party dependencies, for example. Also happens at large sites, where different teams develop different parts of the site, and a proxy stitches it all together.

If a site specifies the integrity attribtue, proxies or CDNs could include the signature along with content when creating the response. Open questions here:

Is this a reasonable spelling? For example, could combine signature and key

Could this be extended to apply to subresources that don't include a signature themselves? Looks like two overlapping mechanisms.

Artur requested Mike's opinions on these questions. The current spec is minimal, doing the weakest possible mechanisms with the lowest compleixty. Goal is to figure out if this works at all, especially key deployment problems. Mike's expectation is that the tag: "ed25519-integrity" will be the inital profile, and we'll create a new one when the needs are better understood. Mike feels that redirects are important now, but replacement/rollbacks can come later. Can sites sign their redirects? Are those keys the same as the keys signing content? Key rotation is probably a separate mechanism, currently very weak and will need to be addressed.

John recommends being clear with the naming to help developers understand their supply chain vs content integrity

Simon points out that end developers may not prioiritze and understand this space, and we may be better focusing on operational folks. 

John - we had similar discussions for CSP. Settled on that we need some mechanism for the developers who have to care (e.g. PCI DSS), or highly motivated developers. Then we solve spelling to make it simpler for common sites.

Nick points out that payments is moving towards passkeys on a very slow timescale, driven by regulators over a decade. Compliance and regulatory frameworks would drive this very quickly, but it's hard to convince regulators. Could put effort into making this low-effort to deploy.

Simon - sometimes hard to get developer resources for things like this. That motivated external solutions, like static scanners

Mike - want to have this for later so that other people can look at what exists and what people have already solved.

### `:visited` partitioning updates by miketaylr@ and aaj@
[Slides](https://docs.google.com/presentation/d/1LPZOOwkmPZ1ZCTt--lIRWLegahpNIhSFIG-vnApzi1U/edit?slide=id.p#slide=id.p)

mike taylor: [Has very good slides.]

...: "A final* update on `:visited` link partitioning". Working on this for a few years. Kyra Seevers should get all the credit. Fixing a decades old xsleak: cross-origin history leakage. Successfully launched this in Chrome. Want to talk about what we've learned, bugs, experience. Ideally we'll get this better-specified in CSS Selectors. Would love another implementer on board so we can solidify that spec.

...: "Triple-key partitioning with self-links support" Similar to storage partitioning schemes: separated by top-level site and current document. Self-links is different from other partitioned mechanisms, because each navigation has two parties (source and destination origin) that learn about the navigation. Self-links means we store in both places (which doesn't leak).

...: Things to look out for: users will notice if `:visited` stops working for `history.pushState()`, `<a rel="noopener,noreferreer">`, `<a target=_blank>`, web extensions using `chrome.history.addUrl()`. These considerations might be specific to Chromium's implementation, ymmv. Bugs linked later in the slides.

...: Things to look out for: collect information in the paritioned database prior to launch to avoid suprising users when you launch, some concerns around system health given the additional storage requirements (turned out to be marginal in our implementation), consider how this works with your process model (site isolation made our initial implementation unworkable; needed to rethink what access each renderer process could reasonably have).

...: Odds & Ends: 404 handling: Chrome didn't initially add these to history, which lead to another `:visited` attack.

Artur: Less relevant for other browsers, but Chrome's 404 handling was a leak in itself that made partitioning difficult.

Mike Taylor: Cross-device sync: if you sync history across devices, you may ponder whether visitedness should be synced. Chrome doesn't. Might be a potential privacy risk that could create a cross-device identifier. Probably doesn't, but we decided not to ship it.

...: Not yet ready to get rid of the `:visited` mitigations because history partioning hasn't launched on Android WebView. Working on it.

...: A list of bugs!

Artur: Followup from last TPAC: we weren't sure whether users would notice this or be bothered by `:visited` no longer being global. After enabling this for ~6 months, it seems like people are ok with that. It looks to be shippable.

Mike Taylor: Reddit moderation use case: extension that opens hundreds of linch, maybe can take that into account.

Matt Finkel: Defined triple-keying: what's the third key? 

Mike Taylor: Link URL, top-level site, and document origin.

Artur: Partition is top-level site and immediate document origin. Third part is link URL. No ancestor chain bit. Looked into it, since it's part of the storage key. Should we just use the storage key? In the end we decided it had no privacy benefit.



### [MLS Protocol](https://github.com/mozilla/explainers/blob/main/MessagingLayerSecurity.md) Proposal
[Slides] (https://docs.google.com/presentation/d/1YdBASYh8ir_TXdV0cr7bb1zgm2_xLNOzWKAN33jubFM/edit?usp=sharing) - lmk if does not work 

### Agentic Browsing


### Security IG's [Threat Model for the Web](https://github.com/w3c/threat-model-web/)
[slides](https://docs.google.com/presentation/d/1UbPYMLeIvqTPQkqojN20szWjP-o4wGQPn8Gmc9NqcDc/edit?slide=id.p1#slide=id.p1)


### Trusted Types status


### Admin: [Path to CR](https://docs.google.com/presentation/d/1oZl2bQRilHIqutdXseKNYgngXhJqHci8XGf1xPSHMQY/edit?slide=id.g399047bc435_0_33#slide=id.g399047bc435_0_33), maintenance, guardrails.


### Feedback on W3C process


### Integrity: [Web Application Integrity, Consistency, and Transparency](https://docs.google.com/document/d/16-cvBkWYrKlZHXkWRFvKGEifdcMthUfv-LxIbg6bx2o/edit?usp=sharing)


### Injection: CSP and other primitives


## Tuesday, 2025-11-11

### [**Local Network Access**](https://github.com/WICG/local-network-access) updates


### Exfiltration: [Connection Allowlists](https://github.com/mikewest/anti-exfil)? CSP++?


### `postMessage()`/[`Origin`](https://mikewest.github.io/origin-api/)


### Injection: Followup discussion on CSP and next steps.


### TBD: ???








