# Web Application Security WG
[Wednesday September 12, 2022 00:00 UTC](https://www.timeanddate.com/worldclock/fixedtime.html?iso=20220913T0000)
(16:00 California, 01:00 Berlin)

## Attendees (36 in room + 7 on zoom)

* Mike Taylor, Google
* Artur Janc, Google
* Sam Weiler, W3C/MIT
* Jonathan Hao, Google
* Daniel Huigens, Proton
* Yifan Luo, Google
* Matthew Finkel, Apple (observer)
* Ian Clelland, Google
* Arthur Sonzogni, Google
* Erik Anderson, Microsoft
* Camille Lamy, Google
* Johann Hofmann, Google Chrome
* Anne van Kesteren, Apple (observer)
* Theresa O'Connor, Apple (observer)
* John Wilander, Apple (observer)
* Aram Zucker-Scharff, The Washington Post (observer)
* Dan Veditz (Mozilla, co-chair)
* Mike West (Google, co-chair)
* Balazs Engedy, Google Chrome (observer)
* Geun-Hyung Kim, Gooroomee (observer)
* Nick Doty, CDT
* David Dworken, Google
* Ben Kelly, Google
* Bartosz Niemczura, Meta
* Wendy Seltzer (W3C)
* .. and lots of others

## Agenda

* Intro, agenda bashing, SotW.
* Web Crypto
    * Curve25519 and Curve448
    * Other more modern algorithms (OCB, Argon2, SHA-3, ...)
    * Feature detection (of those algorithms)?
    * Streaming
* [Permissions / {Permissions,Document}-Policy](https://docs.google.com/presentation/d/15it8jJH_-MpJlBEeVqqqO4D3kBAVqviLfExMUH9lSNc/edit?usp=sharing&resourcekey=0-Wef_iErKP6c37dBl-8WvPw)
    * Interesting bugs:
        * [#208](https://github.com/w3c/webappsec-permissions-policy/issues/208): How do I disable everything?
        * [#401](https://github.com/w3c/webappsec-permissions-policy/issues/401): Permissions Policy JS API
        * [#479](https://github.com/w3c/webappsec-permissions-policy/issues/479): Client Hint delegation to multiple subdomains
        * [#480](https://github.com/w3c/webappsec-permissions-policy/issues/480): Denying self while still allowing subframes
    * Permissions Workshop
    * Registry

## Minutes 

Mike: We've been doing some things re: WebCrypto.  are the right people in the room for WebCrypto? 

Daniel: I'm here.

Mike: Q's are re: curves/algs
...

Jake Holland: I chair the multicast CG; working on adding multicast to QUIC.  Aiming to get into a browser ultimately.  Would like some feedback re: what's needed for browser inclusion.

Mike: I've added it; [[agenda link](https://docs.google.com/document/d/1gXvLPz1Fd3i51diHnFtYYRTszTQFpjYPlbncpXlnlLA/edit)]

Mike: the instances of cross-origin isolated pages is very small. A big spike went up to 0.0046%(??) of page views
https://mitigation.supply/#isolation . There are a lot of blockers to deployment. We need to tweek the ways they can be deployed to make it more deployable. There's also network isolation in addition to process isolation, to prevent access to the theoretically-closed intranet from the public internets. There's a ton of interest in privacy (examples given). That dovetails with the work we want to do from a security POV. Softer boundaries are more acceptible in the privacy space, security tends to view things as a binary "secure or not". We can still make things more probabalistic security if we don't insist of full-proof complete protection.

...: Appreciate all y'all taking the time at a very busy TPAC to be here

## Web Crypto

Daniel: Was a WebCrypto WG a long time ago, now it's folded into WebAppSec for maintenance and extension. Several ideas for extension: Curve25519 and Curve448. Other ideas about new, more modern algorithms. Original idea was to expose cryptographic framworks used by TLS (primarily) and put them in the browser. By now, the ones included back then are outdated. We should look at CFRG, find cryptographic primitives to add to Web Crypto. Web developers chose algorithms based on what's in Web Crypto. We should give them modern algorithms. Push them in the right direction. OCB (an AEAD algorithm), Argon2 (key derivation), SHA-3 (hash). Do we want feature-detection of these algorithms? Right now, you can detect only by trying to use one and failing/succeeding. Spec doesn't mandate any algorithms. Seems like a problem. Developers want streaming capability. Proposal in WINTER CG?, streaming encryption/decryption. We might want to discuss that as well.

Domenic: why not try/catch for feature detection? Seems just as good as if/else

Daniel: Different reasons it might fail. Throwing an error requires developers to figure out what happened (picked the wrong algorithm vs. holding it wrong). But yes, try/catch is good enough, just requires extra code to check "`NotSupportedError`" vs. other DOMException names.

The streaming encryption proposal was in the WINTER CG:
https://github.com/wintercg/proposal-webcrypto-streams

JohnW: Apple update. We do have an engineer working on curve 25519, the other we might have to file.

MikeW: I worry about adding algorithms just because we can. What criteria do we use to evaluate what new things should be added? Are there standard, tested libraries? Is there software already using it?

Daniel: The bar should be more modern and more secure algorithms that improve the security that the web has. Should look at CFRG for guidance. PBKDF2 is weakest algorithm in web crypto, the one most in need of replacement. Browsers don't have an implementation of Argon2 because it's not related to TLS. We'd need to implement that. That seems worth it, because web applications have that use case of client-side encryption. Want to store encrypted user data on the server. Might derive a key from the password using Argon2, encrypt the data, upload. 

Mike: Who needs this?

Daniel: Proton, for instance! Can implement in JavaScript, but would be better to rely on the browser implementation.

Mike: Delta between JavaScript and C++ impls?

dveditz: Some of the right folks aren't in the room.

Mike: what are folks willing to implement? What is used enough that it's worth carrying the code in the browser for everyone, vs. a polyfill for the one or two sites that might use it?

Daniel: I agree.

Mike: This might be a good set of topics for a more focused discussion in the WG, pull the right folks from various browsers who have opinions

Daniel: CFRG recommendations might be the common thread. CFRG and/or NIST.

Daniel: Streaming: for authenticated encryption, you don't want to do streaming decryption because you want to wait for the authentication at the end. If we only add for non-authenticated models, we would be encouraging those (which isn't as secure). Good debate to be had about whether we should add streaming decryption at all, or whether we should start with streaming hashing or signing instead.

Mike: Both signing and hashing seem uncontrovercial. Sharp edges?

Daniel: Streaming signing relies on having a hash to begin with. Extension of streaming hashing. Probably can't have streaming signing for Curve25519.

dveditz: Feature detection?

Daniel: `isFeatureSupported(algo)`. Might also be interesting to see if a specific operation is supported, but the algorithms seem most useful.

Domenic: I think you'd want the operation as well because not all operations are supported for all algorithms

Daniel: Spec now requires implementation of operations for the algorithms you do support. Some browsers don't support certain options in certain operations. Might want `isThisOperationSupportedWithTheseOptions(operation, options)`. Other option is to get everyone to implement everything. :)

  - chat suggestion from hyojin: isTypeSupported() (for checking codec availability in client side) could be referred for considering the API of crypto algorithm availability. (https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/isTypeSupported))


## Permissions

Ian: I'm the editor of the Permissions-Policy spec (some of the issues are olde enough they have "Feature" policy on them).


[Slides](https://docs.google.com/presentation/d/15it8jJH_-MpJlBEeVqqqO4D3kBAVqviLfExMUH9lSNc/edit?usp=sharing&resourcekey=0-Wef_iErKP6c37dBl-8WvPw)

- https://github.com/w3c/webappsec-permissions-policy/issues/208
- https://github.com/w3c/webappsec-permissions-policy/issues/189

Ian: Chrome has 72 permissions, and turning them all off takes a 1500 char header. What about a "\*=()" POlicy? Then we have the "sandbox" policy. If we add a new thing, any site that defined that in the past might break. Most features have a default allow list of "self". we could make it easy to disable all of those. "default-self=()"

Annevk: doesn't that have the same breakage problem if we add a new default-self policy?

Sam: "everything before v45 off" in some way? If there's an ordered definition list.

Ian: would there be multiple ranges?

Erik: sounds like we're trying to turn a large footgun into a bunch of little footguns?

Ian: we haven't really categorized all the features, but turning on/off by categories might be a way forward.

??: that could have the same breakage problem

JohnW: opt out of standardized things, but can't opt out of experimental things?

??: it's not just experimental, it's evolution. Some of the "experimental" eventually becomes standard.

annevk: 

Aram: https://github.com/w3c/webappsec-permissions-policy/issues/208#issuecomment-1244733130 

Ian: The fear is "new things are scary"

annevk: are we concerned about future things, or about the fact that the current set is already too long?

Domenic: spcify things in the spec by "year added" and let people turn things off by year.

Johann: sounds like they want a security mode that's kind of like sandboxing

JohnW: I've brought this up before, but something like on OS linking: "on or after XXX", you opt in to the new thing but can't use the old thing any more.

annevk: we need to accept that most web sites will never opt in to this kind of scheme. what do we do with those?

Ian: #401 old Permissions Policy API (spelled FeaturePolicy). Used on nearly a quarter of websites! probably can't disable now. There are some origin-specific variants that are hardly used.

annevk: permissions.query() might be a way our of this

Ian: is it blocked by the user, by policy, by the browser not implementing it? permissions.query() doesn't cover all the same cases as document.featurePolicy()

Balazs: today featurepolicy() says everything is present in a non-secure context, but permissions.query() only works in secure contexts.

Mike: _how_ is the featurepolicy API being used. If we keep it, but return null or some other fixed value, what would break?

Aram: this is used for browser fingerprinting. not always the best way, but it's being used a lot for that. A significant amount of this use might be people in Chrome origin trials where this is a recommended way to check for things.
- Examples: 
  - https://developer.chrome.com/en/docs/privacy-sandbox/topics/
  - https://developer.chrome.com/blog/privacy-sandbox-unified-origin-trial/ (search for "document.featurePolicy")
  - https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy/
  - Also: maybe this is because "Permissions.query()" doesn't appear to be supported by Android Webview according to https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query 
  
Ian: #479 Client Hint delegation to multiple subdomains

Ian: We propose a wildcard scheme, but just allowed in the leftmost label of a domain (any number of labels, unlike certificate wildcards which are only one label)

Mike: what does permission policy do with ports today? if it cares about ports we should specify it the same as CSP so it can use the same parser/model. This might require changing the wording of CSP? But if it doesn't care about ports then we have to make that clear

npdoty: do we want to encourage developers to make decisions about all their subdomains at once? Seems convenient, but then sometimes you're providing access to a CNAME that is actually some other company.
https://github.com/w3ctag/design-reviews/issues/765#issuecomment-1221115603

Ian: if you're using this you'd need to be careful. It is possible to exclude domains as well

Aram: I agree, this is something that happens commonly -- developers don't know some other dept outsourced some functionality. Seems like they could accidentally enable something they didn't intend. 

David: we're worried about cnames doing bad things, but these permissions seem like minor things compared to access to other things that are wildcarded like domain cookies.

Aram: Also nothing that there is the instance where sites can give control to a subdomain for a vendor like a shop while still controlling the headers via cache. 


Ian: #480 denying self while still allowing subframes

...: This came up in the context of unload. Does it make sense? but it does separate the ability to use the feature from the ability to set policy. reduces attack surface? Proposed "!self" syntax. I'm not convinced of the utility

annevk: please don't use bang -- means something else in CSS. spell out "not"

ian: concern was if you denied your self but allowed for frames then an attacker in a compromised page could then embed themself in a frame and get the ability back.

??: if I want to restrict camera access and limit it to our approved video vendor that should be possible.

Aram: +1
(npdoty: +1)

ian: currently you have to allow self in order to allow anything else.

mike: some different name perhaps? "delegation-only" brainstorm to avoid confusing variations on use of "self"

erik: "skip-self"?

mike: to come back to an earlier point, do you want to fix the problem of self-embedding?

Ian: yes, it's too easy to self-embed.  "not self" doesn't mean "everyone yes", you still have to add the allowed domains explicitly to the header in addition to disallowing your own origin.

## Permissions workshop

Balazs: early stage planning a workshop on permissions. want to involve browser vendors, site developers, UX researchers. Talking about novel powerful capbilities, permission mechanisms other than prompts, the permission API of course.

...: looking for people to be on the program committee. please reach out to me or to Sam W if you'd like to be involved or want to nominate someone you know (with their permission, please)

...: Held in Munich, Germany, 5-6 December. Hybrid, so both local and remote participants welcome! Maybe around 30 people locally depending on the state of Covid restrictions at the time.

npdoty: is the workshop on permissions starting from scratch? what did we learn from the previous instances? why haven't we made progress on previous iterations?

mt: are cookie prompts in scope? it was last time

Balazs: we'd like to make cookies and advertising issues specifically out of scope, and are intentionally wanting to look for non-prompting permission management models.

Balazs: Bit more info at https://github.com/w3c/strategy/issues/348. Stay tuned for a more formal announcement once we have all the approvals, but even now, please don't hesitate to reach out to weiler@w3.org or engedy@chromium.org if you are interested!

## permission registry

MikeT: we had a meeting

dveditz: Does the registry need to be a separate document, or should it fold into the policy/API docs.

miketaylr: In practice, it wasn't one document. Cataloged the integration with permissions, things were out of sync. It seems generally useful to have one location to see all the permissions, whether through policy or API.

annevk: Why can't it be in the permissions spec? Probably also need IDL enums for passing into queries, etc.

miketaylr: Doesn't capture permission policy?

annevk: Would be good to fold policy into that doc as well. Should use permissions API rather than the `featurePolicy.*` APIs, for example.

miketaylr: Out of time.
