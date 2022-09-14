# Web Application Security WG
[Tuesday September 13, 2022 23:00 UTC](https://www.timeanddate.com/worldclock/fixedtime.html?iso=20220913T2300) <br>
(16:00 California, 01:00 Sept 14 Berlin)<br>

## Attendees  
(30 in room + 8 on zoom)

* You?
* Arthur Sonzogni (Google)
* Dan Veditz (Mozilla, Co-chair)
* Mike West (Google, Co-chair)
* Artur Janc (Google)
* Bartosz Niemczura (Meta)
* Yifan Luo (Google)
* Camille Lamy (Google)
* Johann Hofmann (Google Chrome)
* Daniel Huigens (Proton)
* David Dworken (Google)
* Matthew Finkel, Apple (observer)
* Jonathan Hao (Google)
* Maria Mandlis (Google)
* Edward Qiu (Meta)
* Jeffrey Yasskin (Google Chrome)
* Mike Taylor (Google)
* Daniel Vogelheim (Google Chrome, "Injection mitigation" only)
* Jake Holland (Akamai, observer)
* Erik Anderson (Microsoft)
* Sarah Heimlich (Google)
* Martin Thomson (Mozilla)
* Colin Bendell (Shopify)
* David Dworken (Google)
* Yoav Weiss (Google)
* Brianna Goldstein (Google)


## [Agenda](https://docs.google.com/document/d/1gXvLPz1Fd3i51diHnFtYYRTszTQFpjYPlbncpXlnlLA/edit)

New Stuff
* arcsjs and the related WICG proposal
* Exposing "public static resource" metadata: [whatwg/html#8143 -  the role of CORP & TAO](https://github.com/whatwg/html/issues/8143)
* Multicast in quic–what will it take to add this to browsers?
https://grumpyoldtroll.github.io/draft-jholland-quic-multicast/draft-jholland-quic-multicast.html 
* Moar?

...break...

Partitioning designs for HTTP cache & network state [Penciling this in pending conversations around the breakout session’s scheduling]


### New Stuff

#### Arcs

Sarah: [ArcsJS](https://github.com/project-oak/arcsjs-chromium/tree/main/doc/explainer): Policy Protected Data Access for Untrusted Components. [Slides.](https://docs.google.com/presentation/d/1SGCx2ioyVa4kyLvnYCuhg4clKltZKzqygqzGWlQbZIM/edit?usp=sharing) Aiming to be a privacy preserving framework for the open web. Brings the code to user data, rather than data to the code.

...: Lightweight components, policy language, UI composition.

...: Components execute in secure environments, immutable functions. They can be wired up to each other in interesting ways.

...: Policy language that aims to provide provable privacy in the presence of untrusted code.

...: Create composed user experience that combines trusted and untrusted code visually.

...: Plugin, extension examples: font picker.

Ray: (_brief [demo](https://project-oak.github.io/arcsjs-chromium/demo/quill/index.html)_) Replacing font picker of Quill with a plugin that can exfiltrate one picked font without revealing the rest to the containing page, similar story for file picker, and image workflows.

Sarah: We'd love feedback and discussion!

Mike: More detail about components? Sounds like worklets...

Ray: they're a kind of Worker, a function that takes an input and has an output. the output is a JSON object that can be mapped to a template to generate the HTML output. Each component can't see anything done by other components. There's a data-based description language ("opaque", "private") and it's enforced that types of data can't be given to other contexts without user interaction. User clicking on a font-name, that one font's name could have the private tag removed. This avoids extra permission dialogs, which users tire of.

Berni: Ray described the current implementation. There are some gaps in the platform that make things harder. You could imagine a write-only DOM where you can't read the DOM, but can attach events and etc. Could have multiple components on the screen that can collaborate without leaking data.

Ray: If you squint, you can imagine these as Web Components with a locked-down Shadow DOM.

Mike: Side channels?

Ray: Separate project around covert channels. L1+L2 cache attacks, mitigations, oblivious RAM, etc. Research we're doing on the side. Haven't included that in Arcs for the moment.

Berni: The threat model must include these. We can constrain activity in some ways, but need to consider privileged advisaries.

Jonathan: What's the selling point for developers? Anti-fingerprinting?

Berni: Can we allow certain APIs in ways that are provably safe, not fingerprinting, not exfiltrating data. Could remove permission dialogs if this was part of the platform, as the data couldn't be abused. Don't need friction to prevent malicious access if the access is restricted.

...: User flow in which I click on the camera, see a viewfinder, and click on something that takes a picture. In that case we don't need to grant camera permission if we ensure that the camera data can't leave the component without the user's consent.

Ray: Composition aspect of the system is also compelling.

Sarah: Breakout session at 1:30 tomorrow.

#### Public Static Resources

Yoav: Exposing "public static resource" metadata: whatwg/html#8143 [the role of CORP & TAO](https://github.com/whatwg/html/issues/8143). Right now there's no way of explaining to the browser that a given resource is intended to be completely public, and is static. Discussion around changing `ACAO:*`. Not clear that we can change the semantics there, but something like `ACAO: public` might be acceptable.

Domenic: Spelling. If a thing is very super public, they won't want it to break in other browsers. So they might want `*` and `public` for back-compat. Or a third header.

MikeW: could rely on the fact that the browser knows whether credentials were actually sent, so we could safely reuse the "*" value and not have to introduce another header. Need to think about this more.

Camille: If the developer marks something as public, they explicitly want the resource available. The cookied-or-not proposal would leak whether credentials were present on a request.

Artur: Similar on the Storage Access API, whether it's possible to understand whether a given request had credentials. I think we're already in that state, but this could expand the scope.

Artur: What's the use case? Convinience?

Yoav: Use case is image CDNs, other providers that serve resources that are always public. We've been asking them to pile on header after header: CORS, TAO, CORP, getting confusing. I'm personally interested in Timing-Allow-Origin, would be great if there was one single thing developers could do to opt-in in this way.

Eric: We serve with `ACAO:*`. Had to enable additional indicators for the ~same thing later. Wanted a way to say "We don't care. Do whatever you want with this resource."

Domenic: It would be nice to avoid `ACAO:*` requiring folks to change `<img>` tags.

Erik: Proposal to gate future image formats behind CORS. We want folks to be albe to easily upgrade to that model.

Camille: Only subresources, or also documents?

Domenic: I think there's as much justification for folks to say "Frame me, scrape me, do whatever. I'm public." But we could restrict to subresources if that keeps things simpler.

Camille: Documents have access to different data than subresources, storage partition for the origin, etc. Maybe _this_ document is public but other documents on your origin aren't; that still creates risk of side-channel leakage.

Yoav: For TAO, this doesn't matter, as it's request-specific. For other use cases I'm not sure.

dveditz: I'm not sure the lack of this header would prevent folks from loading the resource as a document?

domenic: We're not going to change the iframe model. Not going to make them same-origin.

Yoav: Right now there might be differences with regard to resource timing.

Yifan: If the resource shouldn't differ per user, so perhaps we could treat documents as credentialless.

Artur: If it's only subresources, don't need to worry about that.

Martin: I don't think Mike's suggestion is viable. Can't condition behavior on specific requests given connection lifetimes diverge from request lifetimes. Connection is credentialed and outlives the request.

Domenic: Cookieless domains are common. That's the use case here.

Martin: Reduces utility of the feature. Lots of public resources (.well-known, etc) that are public but wouldn't meet this standard.

dveditz: If they say it's public and static, but I've seen a cookie in the past on this connection, the server still might modify the resource? Why don't we trust the server's declaration that they didn't?

jbroman: This is similar to not having Vary: Cookie, and Cache-Control: public (for Authorization).

Yoav: If we have cookies on the connection, servers can and will rely on the cookie to personalize resources later?

Martin: Saying it's possible footgun.

Yoav: CORS requests on the one hand, no-cors on the other. Different behavior?

Martin: If the response claims to be public, we take it at it's word.

Kouhei: If we request on the no-credentials socket, this could work, but not on the credentiled socket. We need to know beforehand if we are making request on either of those.

Domenic: This variant is controvercial because CORS was designed to make sure that there's really no way that resources could be accidentally exposed. Maybe we can change that now.

Camille: We already trust the server to set CORP, ACAO, TAO. This seems reasonable. We can define a new thing, write good blog posts, etc.

#### Multicast

Network capacity problem. Solution we're exploring is multicast; has potential to solve the scaling problem. Want to put it into a browser because web video is important. If we want to get to a point where ISPs aren't the only way to watch large-scale sources, this looks like the most plausible solution. Security challenges. Looking for feedback from a security perspective in particular. Open question about eventual browser support. Issues come from the underlying protocol. Sending identical packets to many receivers. Can encrypt the traffic, but we can likely figure out the content of those packets. What impact does that have on confidentiality? Cheap traffic detector, but also decoupling receiver from sender. Point of monitoring for ISPs. Fact that you've joined a channel is a new exposure to the local network. Has potential privacy considerations.

That said, it's encrypted and integrity-protected. Checkable points against observers who are subject to regulation. But not the same thing as TLS. If that's a blocker, then we might not be able to solve the scaling problem, it's worth reevaluating the security model to see if we can convince ourselves that the approach spelled out here is viable.

Breakout tomorrow 11:15:

- meeting: https://www.w3.org/events/meetings/527d52eb-f8df-4875-844b-09a27a67d772
- slides: https://docs.google.com/presentation/d/11dnGTxKtmSbjo8Wc6eR39v7l_8kcHzu84wt3VMh93Oo
- spec: https://grumpyoldtroll.github.io/draft-jholland-quic-multicast/draft-jholland-quic-multicast.html


### Cache and network state partitioning

Artur: ([Slides](#todo(aaj)))

...: We must partition network state for privacy/anti-tracking. The two main designs have problems: double-keying is bad for security. Triple-keying is bad for performance. ([doc](https://docs.google.com/document/d/1UPjO44CMekDDXIKlih570Z6SOvKQnWzKoDe7APN_GHg/edit))

...: Double-keying creates a storage key from the top-level site and the resource. Triple-keying takes nested frames' sites into account as well.

...: Sharing network state is bad for security. An attacker executing code within the same network state partition as a victim can leak interesting information. Long history of xsleaks exploiting cache, etc. ([A brief history of timing attacks](#todo(aaj))). Double-keying is incompatible with the same-origin policy insofar as it puts embedded resources into the same partition as the attacker.

...: Good thing about double-keying is that know the performance hit is acceptable. Bad thing is that it retains an information leak (and in some cases causes a minor security regression). Resource like `jquery.js`. With single-keyed cache, the attacker can learn that the resource is cached, period. With double-keyed cache, the attacker can learn that a resource is cached on a particular site if they can become embedded on that site.

...: Triple-keying would align partitioning model with the same-origin policy. Small performance impact for HTTP cache, but large impact for network state.

Brianna: Experiments in Chrome: Triple-key causes ~4% regression at 50th percentile in first-contentful paint for third-party iframes. Double-key had much less impact.

...: Similar trend in all navigations, not just embedded cross-origin: lower impact, 0.8% at 50th percentile.

Martin: Do you know where the hit comes from?

Brianna: More connections.

Yoav: Slow start. New TPC connections to the same origins. That's my suspicion. Haven't been able to scope it down past that at scale.

Paul: What kind of study? Normal user, fresh browser?

Brianna: Running on 1% of stable users.

Artur: We're confident the impact exists, even if we can't fully explain it.

Brianna: Current designs: Firefox, double-keyed HTTP cache and network state. Safari: double-keyed HTTP cache, unpartitioned network state. Chromium: triple-keyed HTTP cache, unpartitioned network state (because of the conversation here).

Martin: In the scenario you're outlining, there are multiple TCP connections to a given site. Is there a plan to prevent servers from using IP addresses to correlate. Security regression seems more related to cache than network? Perhaps double-key the one but not the other?

Artur: Attacks are possible. Iframe embedded somewhere on a site used by the user. Interaction with Google, could reveal the user took a specific action. Less bad than cache, certainly, but would be nice to simply close this kind of leak entirely.

Yoav: The server can potentially do correlation; that's not the problem. Client side is the security issue.

annevk: Triple-keyed cache can still allow iframes to attack each other through navigation. History API, frame enumeration.

Artur: Those are different.

annevk: Symptoms of the same problem: shared context.

Artur: Doc goes into a bit more detail. Additional boolean in the storage key, for example.

Gerrit: Edge experiment with triple-keying; numbers were worse for us. Are some origins more concerned? Is there a mode origins could opt-into (at TLS layer, perhaps) instead?

Artur: I'm reluctant to do this, as it seems like a hole we should close. If the performance isn't something we can accept, an opt-in might be ok, but the better option is to fix the problem.

Martin: This is incremental work, browsers experimenting. Point of coming here would be to get wider agreement so it's not just Chrome taking the hit.

Artur: My goal is for everyone to do the same thing. I work on the Google security team, need to deal with these info leaks. If browsers do the same thing here, then we can approach the problem consistently. Looking for a reasonable compromise, gaining security benefit.

Martin: 1% at 95th percentile doesn't bother me for substantial improvement. Much easier to justify if everyone is doing the same thing, because then there's no relative difference.

Artur: Right. And for us, if any browser remains vulnerable, then it's something we need to tackle at the application level.

Martin: Are we done if it's triple-keyed? Or do we need more?

Artur: Triple-keyed + boolean for navigation. But we should talk about this together: our design seems reasonable, but not saying it's the end of the discussion.

annevk: What's the bit?

Brianna: The navigation bit isn't implemented yet.

annevk: Would be good for it to be aligned with the key we use for service workers, etc.

Artur: different tradeoffs. Ideally navigations would be keyed on the origin that initiated the navigation, preventing evil.com from gaining information about your navigations from other origins. In practice, this is fairly minor compared to the others. So maybe we could just add the boolean instead noting it's a cross-origin navigation. But that probably makes the numbers worse.

annevk: I don't want different features to be able to exploit differences between partitioning schemes.

Artur: Yes. Much simpler to understand if partitions are consistent.

annevk: Triple-keying brings it closer to storage key.

Ben: Does storage partioning not include ancestor chain? In Chrome we're including it.

annevk: But not in this?

Ben: Yes.

Colin: Resource Timing? Need to signal preconnect with certain ancestors.

Artur: Yoav will have more thoughts. Some of this work might be significant regressions for some kinds of use cases beyond FCP.

Yoav: I don't think we've thought through what preconnecting to a different document would look like. Preconnect to a subresource of your iframe or a future navigation. Speculation rules might enable prefetch to a different partition.

annevk: Certainly concerns with exposing the cache key to the thing that's being embedded.

Colin: Not about exposure, about the developer signaling to the UA that certain treatment is needed.

annevk: I don't think we want someone to be able to populate another page's partition.

Artur: If we can't ship triple-keyed state, we could have a hybrid design wherein all frames would share state with each other but not with the embedding site. We want to protect the site from attacks from cross-origin iframes. As long as they're all in the same partition, that protects the top-level. Still information leaks between the frames themselves. But in a world without third-party state this is maybe less scary.

annevk: Payment providers vs ads is not great.

Artur: Absolutely. The secure thing is better.

Camille: Some ads are moving to fenced frames. Would never be in same partition. 

Artur: Still third-party frames that would attack payment providers.

annevk: Could put ads in anonymous frames, additional nonce in the key.

Ben: If socket pool sharing is the source of the problem, have we considered doing probabilistic partitioning of the socket pool? Could turn the knob to match the performance you want. Triple-key everything else.

Brianna: DNS cache is also a performance hit. Not clear what it is.

Ben: Right. Persistent caches wouldn't be done this way. Runtime caches like socket pools might work though. Comes down to what the performance hit is.

Artur: Not completely safe.

Ben: Increases the time you need to pull off an attack.

Artur: Fundamental to the platform's security. I'm happy we're talking about this now. Covers a large chunk of xsleaks.

annevk: Privacy CG has been discussing this topic for a year or two.

Ben: [slides](#todo(wanderview)): Ancestor chain bit. Partition keys. I'm interested in storage partitioning. Service workers. What most folks have shipped or plan to ship is to include the specific origin and the top-level origin. Service workers have a problem: there's no frame, but they still have a storage key that included the origin from which they were intiated. Need the ancestor chain to set site-for-cookies when making requests. a.com -> b.com -> a.com: site-for-cookies is `null` for the inner `a.com` because there's a cross-origin ancestor. In the normal storage key mode, the service worker is unpartitioned between these two. New storage model could hold a bit noting that there's a cross-origin ancestor, thereby ensuring that service workers set site-for-cookies properly.

Artur: is there a drawback?

Ben: Main drawback is the weirdness with synchronous scripting to the top-level site.

annevk: That's something we might fix at some point.

Artur: So you're not opposed to the weirdness.

annevk: More important for storage keys to be aligned than to prevent the weirdness.

Ben: I think there's an open issue in CHIPS around whether they want to include this bit. They might need to support use cases that it would block. Not sure there's a perfect answer here. But for service workers, this seems important.

annevk: Producing a new form of authority: top-level site, ancestor-chain bit, etc. Might want to expose this to developers someday. If it differs for different features, it's confusing and bad.

Artur: Navigation bit isn't something we'd have in service worker, so complete consistency seems unnecessary.

annevk: Base needs to be the same. Differences seem exploitable.
