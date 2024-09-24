WebAppSec @ TPAC 2024 - 2024.09.23
==================================

Attendees
---------

* Mike West (Google)
* Dan Veditz (Mozilla)
* Ari Chivukula (Google Chrome)
* Paul Zuehlcke (Mozilla)
* Simon Pieters (Mozilla)
* Matthew Finkel (Apple)
* Marian Harbach (Google Chrome)
* Carlos Ibarra Lopez (Google Chrome)
* Mike Taylor (Google Wave 👋)
* Aaron Selya (Google Chrome)
* Joe DeBlasio (Google Chrome)
* Anna Weine (Mozilla, remote)
* Chris Fredrickson (Google Chrome)
* Sanket Joshi (Microsoft)
* Siye Liu (Microsoft)
* Camille Lamy (Google Chrome)
* Emily Stark (Google Chrome)
* Dominic Farolino (Google Chrome)
* Kyra Seevers (Google Chrome)
* Simone Onofri (W3C)
* Simon Friedberger (Mozilla)
* Dylan Cutler (Google Chrome)
* Nick Doty (CDT)
* Balazs Engedy (Google Chrome)
* Shivani Sharma (Google Chrome)
* Anusha Muley (Google Chrome)
* David Dworken (Google)
* Lukas Weichselbaum (Google)
* Chris Thompson (Google Chrome, remote)
* Daniel Huigens (Proton)
* Bumblefudge (Protocol Labs)
* Robbie McElrath (Google Chrome)
* Siye Liu (Microsoft)
* Artur Janc (Google Security)
* Hiroshige Hayashizaki (Google Chrome)
* Sasha Firsov (Web Components, XML/XSLT groups)
* Domenic Denicola (Google Chrome)
* Aaron Shim (Google)
* John Wilander (Apple WebKit)
* Johann Hofmann (Google Chrome)

Agenda
------

* **9:00 - 9:15**: ☕ and agenda bashing.
* **9:15 - 9:45**: Crypto
  * (~15m) Web Crypto (@twiss)
    * Algorithms (modernizing, post-modernizing)
    * Curve 25519
    * Streaming
    * Feature Detection
  * (~15m) [Remote cryptokeys](https://github.com/WebKit/explainers/tree/main/remote-cryptokeys) (@marcoscaceres, @estark37) [Try to move this to Thursday.]
* **9:45 - 10:30**: Application Integrity/Transparency (@ddworken)
  * (~25m) Extensions to SRI
    * Additional content types
    * Additional assertion types ([signatures](https://github.com/mikewest/signature-based-sri), etc))
    * `require-sri-for` (@yoavweiss)
  * (~20m) Signing / Packaging
* **10:30 - 11:00**: ☕ & 🍰 @ [Lanai Deck, Fifth Floor](https://www.w3.org/2024/09/TPAC/schedule.html#map)
* **11:00 - 12:00**: CSP
    * (~15m) Should the threat model include exfiltration? (@yoavweiss)
    * (~20m) How can we improve adoption? (@simoneonofri, @johnwilander)
        * Docs & recommendations?  
        * [CSP Next](https://github.com/WICG/csp-next)?
    * (~15m) Could we [require injection mitigation](https://mikewest.github.io/injection-mitigated/) for interesting APIs? (@mikewest)
    * (~10m) What's left before putting CSP into "living CR" mode?
* **12:00 - 12:10**: https://github.com/w3c/webappsec-permissions-policy/issues/273 (@siliu1, @sanketj)
* **12:10 - 12:30**: **Breakout pitch session**. There are a number of breakout sessions ([grid](https://www.w3.org/2024/09/TPAC/breakouts.html#grid), [details](https://www.w3.org/2024/09/TPAC/breakouts.html#intro)) on 25.09.2024 that are relevant to this community. Let's talk about them a bit so folks can plan accordingly.

Crypto
------

* Daniel:
    * Curve 25519
        * Good news! All implementations have shipped Ed25519: Still behind a feature flag in Chrome. X25519 is getting there as well.
        * Less good news! Impl of ed25519 isn't exactly the same in all implementations. Safari shipped a randomized varient that's proposed in IETF, but no RFC yet. Still a bit of discussion about how to refer to the RFC or the draft in the WebCrypto specification. It wasn't discussed at IETF, but reached out on mailing list and informal conclusion is that there's not yet concensus about what the `Ed25519` name should mean: randomized signatures or not?
        * Proposal: refer to EdDSA as defined by "RFC8032 or its successors", and adopt a formal change once the RFCs are done.
        * Other minor details. Might be niche incompatibilities we should work out.
        * Questions:
            * Javier: We've been talking about this over the last few weeks. How to prevent the issues raised for merging the PR into WebCrypto. Is the current proposal enough to unblock that? Apple was looped in to approve the PR. Does that align with our needs? https://github.com/w3c/webcrypto/pull/362
            * Daniel: Anne? Opinions?
            * Anne: Hard time hearing.
            * Daniel: Explaining references: is it sufficient?
            * Anne: Probably OK, but language is not specific enough to write tests against. Might be better to simply leave an issue marker in the spec, or put it in a note. The general idea of "the current RFC and its successor" makes sense, but need to guide testers and implementers. Might not be consensus, but I don't think changing the name is an option at this point.
            * Daniel: Seems like it's still up for the IETF to decide, but agree that just leaving an issue about it in the spec is probably fine.
    * More modern algorithms:
        * Mozilla expressed interest in SHA-3. Other algorithms folks have expressed interest in.
        * Modern Algorithms draft: move to WICG?
            * Mike West: Moving to WICG seems like the right next step. Post a link, we can provide expression of interest.
            * https://github.com/twiss/webcrypto-modern-algos (for now)
        * Post-Quantum Algorithms. Could add to that draft or make another.
        * Matt Finkel: Developer interest in these?
        * Daniel: Several were asked for on WebCrypto's issue tracker. Argon2 (better key derivation function), SHA3, ChaChaPoly. Others were added to round out the offering (kMAC, etc).
        * Matt: Higher-level interface than `.subtle`?
        * Daniel: Yes. David Benjamin from Chrome was interested in adding HPKE. Ben Beurdouche from Mozilla as well. Not sure if in this draft or a separate, but would make sense.
    * Feature Detection:
        * `subtle.crypto.supports()` function can be used to check whether an algorithm is supported. Might be too late given the support for curve 25519 in Safari, et al. Already need to try/catch.
        * Does it make sense to add a function for feature detection for additional algorithms in the future? Ideally all would be implemented, but would be helpful to developers to have explicit detection. But maybe try/catch is enough? Maybe we're too late?
        * Anne: If try/catch works, then I don't think we need it. For other things, like testing dictionary members, the work is even more complex, but we still endorse it. If we're just removing try/catch, it might not be worth doing.
        * Daniel: Testing support for options when passing the algorithm identifier dictionary: might want to specify option for deterministic or randomized variant of ed25519, might want to know about support. Try/catch, plus manual inspection of whether the browser did what you asked.
        * Anne: With try/catch and an frozen options dictionary should be doable.
        * Daniel: Ok, might not be a good idea. But the pattern you're suggesting seems convoluted. Other APIs have `supports()`.
        * Anne: Motivated by not being able to use that pattern.
        * Mike Taylor: The try/catch egronomics are pretty crappy. If we can provide an API, that seems better. I agree that the current pattern exists, but it's not intuitive. That said, not specific to this API. Generally, ergnomicis are better with an API.
        * Anne: Should we design that on a per-API basis? Should be generic?
        * Mike Taylor: If you want to solve the generic problem, great! On the point of it being too late given Safari's support, I'd generally say no. If we agree that the API would be better, we should ship it and it becomes less of a problem over time, and hope that Safari ships it as well.
        * Simon Pieters: Unknown values in the dictionary. Shouldn't it throw if you pass in an unknown value?
        * Daniel: We generally ignore.
        * Simon: No, if the key's supported with an unknown value, we'd throw.
        * Daniel: Yes. 
        
Application Integrity
---------------------

* David Dworken: Integrity for the Web [slides link TBD]
    * Web vs. Native apps.
        * Native has a single bundle, signatures, potentially strong guarantees of integrity and transparency.
        * Web is more dynamic runtimes. No entire-app integrity, no transparency between users.
    * Because of this gap:
        * Applications like Signal don't exist on the web. They've looked at the threat model the web offers, and can't find a way to reassure users that this class of E2E applications are running the code they expect.  
        * Folks are implementing polyfills to try to make this work. Extensions like CodeVerify that check application bundles for a website. Has to be an extension, compromises made because it's not a web platform native API.
        * Many subresources can't be checked by SRI today.
            * Google Analytics is dynamic, doesn't fit static hashes well.
            * ES Modules, Service Workers.
        * Supply chain risks.
    * What if the web tried to solve this?
        * Talking with some developers about this. It'd be nice if we could address it.
        * Goal is to solve the Signal problem, while also making it possible for smaller applications to progressively deploy integrity checking. Early ideas floating around. Looking for broader thoughts on the problem. Is it a problem worth solving?
    * Ilya G: PCI requirements for checkout. IFrame was a suffiicent security perimeter for PCIv3, doesn't work for PCIv4. It's a problem for a large population of ecommerce sites.
    * David Dworken: Let's talk about some of the early ideas we have:
        * Want to aim for solutions that offer strong integrity.
        * Goal is to design something that can solve these problems, but also smaller scoped problem.
        * Intermediate milestonres:
            * SRI with Signatures
            * SRI for more resource types
            * document-level `require-sri-for`
            * origin-level `require-sri-for`
            * Committed origin-level `require-sri-for`
    * Nick Doty: Earlier, you suggested integrity meant same code delivered to each user. Important problem, but not the entire problem. Might be forced to deliver malicious code. Could deliver it to everyone, which would still be bad. Would be nice to have some sort of trust/review representation.
    * David: Right! What if we could offer stronger transparency? Something like CT for application code. Possible to see the application code logged: this is the bundle that clients saw. Might be possible to audit those bundles. Further down the road. The ecommerce use case doesn't need this full solution, but if we think about it now, it might be possible to solve in the long run.
    * Nick Doty: This adds value in the ecommerce case too.
    * Ilya: Right now we're looking at this for dynamic cases, no solution.
    * Emily: Is Shopify's need for hash-based SRI for more resource types? Or is signature-based necessary?
    * Yoav: I don't think there's a need for more resource types. We care about JavaScript. Regarding signatures: that seems very useful. Seems like a good way to validate that a party we trust is the one providing the code.
    * Emily: PCI security requirements would allow signatures?
    * Ilya: Not a PCI compliance expert. Something of a moving target. Want to defend parent page, but requirements shift depending on who you talk to. Deploy a crawler, fingerprint all the resources on your page, say that's your app. Would be ideal to know which resources are loaded and their content.
    * Yoav: Ideally, we could have signatures and hashes.
    * Emily: Just wondering if signatures are plausibly useful. Sounds like yes.
    * Chris Thompson: To Nick's point about integrity: at some point do we need some form of versioning? Strongest versions of protections here would allow users to not automatically upgrade to the next version. Signature-based SRI doesn't allow pre-auditing, just validates source. That's perhaps a stepping stone, but is there a path to something that has versionions more deeply embedded.
    * David: Seems plausible to me. Aiming for maximal security, non-automatic updates could be useful. But pretty far down the road, more pressing problems.
    * Benjamin: New WG at IETF: Keytrans. Might be useful for this, anything around CT for non-certificates. Latest draft from mcmillion, working with Signal, seems like it's going in a good direction (https://datatracker.ietf.org/wg/keytrans/about/). https://datatracker.ietf.org/doc/html/draft-keytrans-mcmillion-protocol
    * Robbie: Two different solutions here. Stronger SRI and CT-style log. For the latter, need to know all the resources ahead of time. For Signal, the model is that the server can't be trusted. SRI doesn't address that use case. Is SRI shorter-term, lighter-weight?
    * David: Yes. Long-term goal might allow some sort of committed, origin-level SRI promise. Might allow to defend against malicious server.
    * Yoav: 1st party origin?
    * David: Yes. But true that more immediate milestones, verifying just this one third-party resource would be useful.
    * Robbie: In the transparency approach, that would not just be subresources, but also the main resource?
    * David: Yes, would need to address all of that.
    * Daniel Huigens: Supply Chain Integrity Transparency Trust (SCITT) WG at the IETF. Mentioned this there as well, they seemed to be interested in working on this as well. (https://datatracker.ietf.org/wg/scitt/about/)
    * Emily: We talk about this as "Signal on the web", but Signal hasn't been super explicit about whether this is what's blocking them. So we should be looking for intent from other developers, not overindexing on Signal.
    * Daniel: My understanding is that they've said this at some point, though a while ago. Proton is strongly interested in this use case. Other applications as well that could benefit. We tend to focus on applications that use E2EE as being the sole use case for this, but others: any web application that does all its work client side. Note-taking app: Still want guarantees about behavior, like "doesn't send notes to the server".
    * Matt Finkel: A few variants of this. In earlier discussions, concerns about the threat model. If we're trying to provide something similar to integrity/authenticity of native apps, that excludes some of the lighter-weight proposals.
    * David: I'd agree. We'll bring actual proposals with a real threat model.
    * mkwst: small things that don't address the whole problem can still be very useful
    * Ben Goering: Mastodon. People want to fix DMs. But client-side encryption on the web has this same problem (for example, https://github.com/w3c/tpac2024-breakouts/issues/89). Signal-aside, the W3C social-sphere would be interested here. Crypto wallets too. Integrity could help. Breakout!
    * Camille: +1 to Mike. Several different threat models, different solutions that address them. New web apps might need the bigger threat model, while existing apps might benefit from smaller stepping stones that add integrity in important places. Those might not evolve into the larger threat model ever, but would still be ideal to address.
    * Yoav: Is there appetite for `require-sri-for`? This would be very useful for the commerce case. Could potentially help elsewhere as well. This was removed from Chromium in ~2020 because modules and workers?
    * Dan Veditz: Also dynamic scripts like Analytics.
    * Yoav: Fair. Modules were fixed. Workers still don't have it, but not relevent for our specific threat model. For the dynamic case, it's tricky to deploy, though it's possible to think of a design in which versioned URLs could help. Shopify's use case is mostly for `report-only`. Would help us understand when scripts change. Would be even better to expose hashes as part of the report. Does that sound reasonable?
    * Dan Veditz: Sounds like a reasonable request. Might need a discussion of making reporting better for CSP generally.
    * [Artur and Yoav to chat about similar proposals.]
    * Aaron Selya: Auditing. Would you expect a failed audit to surface something to users? Break the application?
    * David: No answer yet! Let's figure out how to do the audit before determining what impact it has. Maybe similar to TLS errors? Out of scope at this point.
    * Dan Veditz: Reporting as well.
    * Emily: CORS requirements for SRI: is that not a deployment blocker for Shopify?
    * Yoav: For the scenarios we have in mind, it's a reasonable request to the third-parties. Could be a deployment hurdle at large. But we should make CORS easier; if that turned out to be an issue at call sites, a document policy to force CORS requests would be helpful.
    * Dan Veditz: Sites that supply libraries should already provide the script with CORS headers, but shouldn't be hard to convince.
    * Artur: We require CORS for SRI because you could otherwise detect the hash of content. Signature-based SRI might remove that problem, as there's no longer one version of the code.
    * Mike: signature-based SRI has an inherent server opt-in, which might make this problem easier (either the signature opt-in could itself serve as a CORS opt-in, or at the very least, the server operator already has to do something so they can set CORS headers too)
     * Dan: How would signature-based SRI work?
     * David: `<script integrity="[public key]">`. Response would send a signature that matched that key. Simplest thing possible, solves the GA use case.
     * Dan: Much like the CORS case, the library provider would have to opt-in.
     * Anne: Is the key validated, or just a string match?
     * Dan: Provider would provide a signature for the contents, and you would check it.
     * Ben: what if the key leaks?
     * David: Complexity! Key rotation! Resource finding! Rollback prevention! Classic problems. But even if we ship the most basic version, that would still provide value.
     * Ben: DID-based SRI. Rotatable identifiers.
     * David: Could do something like that? I want to find a small thing we can do more quickly. I'm motivated by a simple proposal.
     * Matt: IETF has been working on this exact problem for years. [Links will be provided.]
     * [OHTTP key retrieval](https://www.rfc-editor.org/rfc/rfc9458.html#name-key-configuration-media-typ)
     * [Privacy Pass key retrieval](https://www.rfc-editor.org/rfc/rfc9578.html#name-configuration)
     * [Preliminary key consistency protocol](https://datatracker.ietf.org/doc/draft-ietf-privacypass-key-consistency/)
     * Camille: Chromium implemenentation. Signature-based SRI without rotation, etc is very simple to implement. If we need to handle key management and transparency, much larger project. If the simple version is helpful, could be worthwhile to ship while we work out more complicated proposals.
     * Daniel Huigens: Straw-proposal for simple transparency. Source code transparency at TPAC 2023: <https://github.com/WICG/proposals/issues/124>. I don't think it has to be very complicated or take a lot of time. Transparency can give you things you want on the integrity front as well, if you're happy with having only detection and not prevention (like Certificate Transparency). Everything boils down to detection anyway, if integrity requires auditing. If good transparency, perhaps we need less work on integrity.
     * Camille: Still seems more complicated than per-resource checks. Those are easy given SRI implementation. Transparency requires requests to transparency server, perf issues, transparency scope (packages or per-resource, etc).
     * Daniel: Specific proposal doesn't require that. Information is in the certificate. Doesn't need to be complicated.
     * Emily: Does require a new server and log.
     * Daniel: Up in the air. Doesn't really require that. Variants with advantages and disadvantages. Could put everything in the cert.
     * Emily: I wouldn't want to put things in the CT logs than we currently do. Fragile ecosystem.
     * Ben: Working on really big files to IPFS for a while. Browser tabs can easily crash just hashing a large file (BLAKE3, merkle trees, etc). Would be ideal for SRI to support incrementally-verifiable hashing algorithms (https://github.com/BLAKE3-team/BLAKE3-IETF).
     * David: Let's keep that on the radar, but most of our current use cases are JavaScript.

CSP
---

### Exfiltration

* Yoav: Essentially, I think there's a case to be made that CSP right now is not an anti-exfiltration mechanism, but that it could be if we covered known gaps. Wouldn't be a complete anti-exfiltration solution: doesn't protect from side-channels, SPECTRE, same-process leaks, etc. But I think it could provide a useful way to make exfiltration more expensive and harder for attackers. My specific use case: ecommerce. Skimming attacks. Related to previous conversation around SRI. It would be useful to raise the bar for attackers to prevent CC information from leaking from checkout pages. CSP could be made to do that.

* Artur: I think it's a nice goal. The problem historically is that it seems like CSP _solves_ a problem, but looking into those solutions from a realistic perspective doesn't match. Allow-list based CSP, good example. We thought that a list-based approach was going to solve the problem, but in practice, it turned out that almost none were actually useful against XSS. Research showed that 99% of policies were bypassable. My worry is that exfiltration will be similar. We could cover the remaining sources of network requests, navigations, RTC, etc. The other thing is postMessage, BroadcastChannel, etc. These could be restricted! But checkout pages will also want to load third-party analytics. If you allowlist this in your CSP, you'll create an exfiltration vector.

* Yoav: Yes. Any third-party origin I load resources from would be an exfiltration vector. At the same time, it will raise the bar. Attackers will need to find reflection attacks on those origins, redirects, etc. 

* Artur: Analytics vendor: Most sites trust 3-5 vendors. Attackers can create an account on those origins. Agree that it's not as generic as sending data to `evil.com`, but the protection isn't robust. Similar discussion for script-execution mitigations. Raising the bar is false security. Do we want to do a bunch of work in CSP that gets us closer to a goal that seems hard to achive in practice? Perhaps the answer is yes! If people want to build something that doesn't have the guarantees they think it does, that might be fine. But we got into trouble in the past because policies were bypassable.

* Yoav: The argument that attackers can use already-existing providers to exfiltrate data is good.

* mkwst: one wrinkle here: It's true that we don't see allowlists as providing complete security, but we also see that sites like Google do use them to reduce the attack surface. Some things like Broadcast Channel seem outside CSP's model.

* Artur: Let's argue. No one is arguing for removing containment from CSP. There's value in saying that an application can only load resource types from trusted servers. But it's worth thinking through the value of `img-src` in your policy. What's the risk of allowing images from `evil.com`? The only value from these directives is that data can't be sent to external hosts.

* Mike: UI redressing?

* Dan: Reputational hits. Porn on homepage.

* Artur: ASCII art is just as bad. Could be valuable to restrict absolutely everything, but still attacks remain viable as described before. ASCII art is bad enough.

* mkwst: I agree that in practice there will be a lot of potential places to exfiltrate to on a real web site. But at a platform level it makes sense to have a place like CSP that can control where Fetch can load things from

* Artur: Mostly agree. Some directives create XS leaks, so let's avoid that. But if we create these capabilities, do they give us good properties. If the answer's no, but we don't care, then sure. That could be reasonable. We might only differ in our opinions about those two conditions.

* Daniel: Supply chain attacks. Can the primitives we give them, plus the things they do, provide reasonable defense?

* Camille: Navigation and XS Leaks. We have a version of `navigate-to` in Chrome, but it's leaky, and we're not going to ship it in that form. Anything with redirects is particularly sensitive for navigation because partitioning. Would be issues in handling redirects for navigations, that's a large open hole. As long as that hole exists, not sure about the rest.

* Sasha: Not talking about page with single vendor, but multiple vendors on a page. We need to talk about insulation, not script in a particular application, but rather isolation between different players. Were implementations in the past: caja, etc. Would be good to have a security boundary within an application. Analytics: would be good to expose only those events to the script. Then you wouldn't need to include the script into your application, could segregate it off. That would solve the problem in general. Generic architectural principles.
    Declarative Custom Elements as no-JS programming  lays out the base for microapplication insulation.  The samples available in ref implementation https://github.com/EPA-WG/custom-element
* Anne: What are the specific types of exfiltration are we concerned with here?

* Yoav: https://github.com/w3c/webappsec/issues/656. Preconnect, prefetch (DNS), WebRTC, top-level navigations. 

* Anne: WebRTC is handled (but not implemented). I think we should handle preconnect and dns-prefetch as they're conceptually fairly similar to subresource fetches. Top-level navigations seems fraught.


### Adoption

* Simone: discussion in the SWAG CG around helping developers understand our technologies. First agenda point was around CSP, were proposals about adoption. Work with MDN folks to create simpler/better documentation. Security by cut/paste isn't goodm but we could do better. Training for developers. Some developers and security folks were suggesting that CSP is too complex, and that a subset would be helpful. CSP Next popped up here. Happy to bring more people into that CSP to give better advice.

* Lukas Weichselbaum: We've deployed CSP at scale for many years now. Several categories:
    * legacy problem of browser support, this was hard in the past. Not an issue today.
    * Understanding CSP is hard. That's not hard to address. The tricky part is that the underlying application needs to change to become compatible with CSP/Trusted Types. You need to stop using unsafe patterns, that's the biggest blocker for CSP at scale across the internet.
    * Two ways to address:
        * Subset of CSP that's easy to deploy at scale that gives some of the beenfits (URL hashes added to `script-src`, for instance: https://github.com/w3c/webappsec-csp/issues/574).
        * Make sure developers don't need to understand CSP by building it into the framework. Did this internally at Google, allowed massive scale.
    * For new applications, this is a tractable problem.
* Aaron Shim: Additional points. The real answer isn't one or the other, it's both. Unification betwen developers and security professionals. Need to change how folks think about development patterns. In-depth conversations in the SWAG-CG.

* John Wilander: Between CSP2 and 3, back-compat grievences. We gave feedback back then that one part of the adoption problem is that the spec is massive. Lots of things you _can_ do, developers think they need to do it all, fail, and stop. Would be ideal to break out the scripting part, give developers a clear story. Mike wrote a CSP Next proposal, still living in WICG: https://github.com/WICG/csp-next. I still like it, 5 years later!
    * Call it Scripting Policy, not CSP Next: <https://wicg.github.io/csp-next/scripting-policy.html>
    * Disallow  eval()-like affordances. Simplification. Fewer affordances. That goes against the application to legacy applications, but simpler story going forward.
    * Skip hashes if possible (can SRI take care of that?) or skip nonces. Basically only do one of them. That's easier too. Can ask developers which they prefer.
    * Simplify Trusted Types by not supporting allow list cherry-picking. Just say "If you want TT, you need to do TT."
    * Require report-to. Don't do this if you're not accepting reports!
    * Consider privilege policy. Potentially say that script I'm including from a third-party source shouldn't be allowed to do everything. As I'm saying this, I think I favor not doing it, but need to mention it.
* Artur: I like the idea of us being opinionated about how to deploy CSP. Your proposal is basically us making a call about how to develop applications. We have hashes and nonces because applications are different. Nonces require dynamic systems, but hashes are helpful for static content. Hard to say one or the other, though I agree that it would simplify the story. We've tried to simplify CSP, saying you don't need to use all the directives. Opinionated stance will hurt adoption. Would we say Scripting Policy would only work for a subset of applications?

* John: You're right. I'm suggesting we explore the idea of the opinionated new thing, and refer the legacy hodgepodge to CSP3. "You need all the bells and whistles, use CSP3."

* Camille: We've been discussing this for years. Issues we've had around clearer engagement from all browsers: shipping Scripting Policy in Chrome only isn't helpful. CSP works everywhere. Also, I wonder whether this is expressed as a subset of existing CSP. Easier to implement: just translate to CSP. Also, skeptical of dropping hashes. They're useful at Google.

* David: To add to Artur: a service might adopt scripting policy, but then some magical JavaScript library needs eval, and they'll migrate away from SP to CSP3 to use it. That's even harder. Might be easier in the beginning, but could lead to dropping completly.

* Domenic: This idea has been floating around for years, but we're not sure who would use this. It would be nice if we could write docs pointing to a simple thing. But I don't think the docs are the problem. Making this work is the problem. Would people be more secure if we shipped this?

* John: Camille were you interested in ease of implementation?

* Camille: Many things we could fix, but only so many engineers. If things are easy to implement, we can give developers something useful quickly.

* John: Great point. Should be easy to implement. We were late to CSP because of the back-compat, we were unhappy about the transition between 2-3. This would be a new thing, could be easier.

* John: `eval()`. I think it's inherent in what I'm proposing that a new opinionated thing would not be for them. But let's progress the web, let modern web sites do the right thing going forward.

* John: To Domenic: might just be hard for applications.

### [InjectionMitigated]

* Mike: https://github.com/mikewest/injection-mitigated

* Mike: Let's make sure complex powerful APIs are scoped to the website you granted permission to, and not injected code. A strict CSP policy is the best current way to do this. We could follow-up on the idea of other attributes added to IDL like [SecureContext] and cross-origin isolation. The linked document defines isolation in terms of strict CSP, and if a context is deemed "strict enough" then the API would be exposed, and if it isn't then the API is not available to script. Interested in feedback. It's simple in concept. Implemented in chrome behind a flag (combined with isolated origins but that's an implementation detail). Could this be applied to things going forward, and could we apply it to existing APIs looking backwards?

* Lukas: The underlying idea is to disable dangerous APIs that commonly lead to XSS?

* Mike: No, the APIs would be interesting independent of their XSS-causing ability.

* Camille: Excited about this. I remember reading about XSS-gadgets injected into many pages, would use all the capabilies exposed on those pages. But experience with cross-origin isolation deployments. It's a complicated story. If we go in that direction, we need to agree on the sufficient condition, and that we have a nice development story for websites that need to deploy strict CSP. Otherwise, we run into concerns around deployment impossibility. Work on deployability?

* John: A few things:
    * Is this static? Once we decide on a security level sufficient for an API, will it stay that way forever?
    * Removal of existing APIs: Geolocation. That will cause breakage. No-op rather than removal?
    * Levels of CSP security? Mid-good? Extra-good? Or expanding SecureContexts?
    
* Mike: We know what a strict CSP looks like: strict-dynamic with TrustedTypes is a pretty solid foundation. We don't need to invent something new. I agree the IDL attribute is wrong for existing APIs. Removing the exposure of the API would cause breakage so we'll have to do something else there. 

* Camille: Sites have CSP right now.

* Domenic: COI is different from CSP. Hasn't been successful yet. Interested in understanding what APIs we'd apply this to. If you're not protecting yourself from XSS then in principle you shouldn't really get access to any APIs, so I'm having a hard time figuring out what a good bar would be.

* Mike: I tend to agree, but in practice we can't be so strict. My suggestion is to try for APIs that require permissions, e.g. Web USB or Geolocation.

Permission Policy: Autofocus
----------------------------

https://github.com/w3c/webappsec-permissions-policy/issues/273
https://github.com/whatwg/html/issues/4326
https://github.com/whatwg/html/pull/4585

* Siye: Issue around permission policy and autofocus. Proposal made many years ago to restrict focus from being stolen by frames without user activation. Would be ideal to get resolution to these questions:
    * Default value of the policy? `self`? `*`?
    * Discussion in HTML spec. Default value should be `self`. Ian Clelland suggested that abuse mitigation would tend towards `self`. But concerned about existing implementation in Chromium. Some issues in Docs(?). Existing implementation is disabled: found additional issues as well. Tab key navigation into iframe. But that seems like an implementation bug.
    * So `self` seems reasonable. Should start a new experiement
    
* Mike: `self` seems right if we can ship it. Gathering data would be helpful. Any feedback from other vendors?

* Shivani: Fenced Frames have this behavior. Implementation could have overlap, so perhaps we could look into this together. The specific implementation bug noted doesn't exist for Fenced Frames.

* Anne: I vaguely recollect that WebKit doesn't allow cross-origin focus today, which would allow the default to be more strict.

* Intention here is to prevent third-party content.

* Anne: Need to know impact on other implementations before moving forward. Add tests for this, see what implementations do, then decide.

* Domenic: Delta between `autofocus` attribute and `focus()` element. Aligning the latter to the former could address this.

* Anne: Open a dedicated issue with findings adjacent to the PR? Having discussion in the PR alongside the changes to the text is very confusing.

* Should we still allow automatic focus from the parent into the child? Intention is to prevent programatic focus-stealing from the frame. If initiated from the parent?

* Mike: Seems philosophically reasonable to me.

* Domenic: Delegation sounds right.

Breakouts
---------

* Mike's preselected highlights:
    * 8:30 - 9:30: Permissions UXR (<https://bit.ly/3XToxLm>), Deprecation (<https://bit.ly/3MSQsF1>)
    * 10:00 - 11:00: PEPC (<https://bit.ly/3zC3fsb>), DBSC (<https://bit.ly/3XyXKCQ>)
    * 11:15 - 12:15: Purposeful Permissions (<https://bit.ly/3MVbXF5>), Cookie Layering (<https://bit.ly/47JH4wX>)
    * 13:15 - 14:15: Security Guidance (<https://bit.ly/3ZwmoGz>), Local HTTPS (<https://bit.ly/47yvlkN>)
    * 14:45 - 15:45: :visited Partitioning (<https://bit.ly/3XU2KDs>), Threat Modeling (<https://bit.ly/3ZAQhpw>)
    * 16:00 - 16:45: Spec UI (<https://bit.ly/47xV8K1>)
    
* Others' probably-better suggestions:
    * 8:30 - 9:30: Fenced Frames (<https://bit.ly/3Bg9RNt>)
    * 10:00 - 11:00: Future of Popups/Popins (<https://bit.ly/3XUGRE2>)
    * 13:15 - 14:15: Cross-origin view transitions (<https://bit.ly/4gxofkD>), Harmonizing Identity-Related API Proposals (<https://bit.ly/4gEwdsn>)
    * 14:45 - 15:45: E2E on social web (<https://bit.ly/47CJwoS>)
    * 16:00 - 16:45: Prompt spam and `requestStorageAccessFor` (<https://bit.ly/3zqjVD7>) 

* Nick: Permissions stuff on the screen. You should attend all of it. Purposeful Permissions with Serge, Alexandra. Need input from browser vendors, but also need input from non-vendors. If you're a site that needs to ask for something from users, we want input!
