# Web Application Security WG
[Tuesday September 13, 2022 17:30 UTC](https://www.timeanddate.com/worldclock/fixedtime.html?iso=20220913T1730) <br>
(08:30 California, 17:30 Berlin)<br>

(The first day's minutes are captured in https://github.com/w3c/webappsec/blob/main/meetings/2022/2022-09-12-TPAC-minutes-1.md.)

## Attendees  
(26 in room + 7 on zoom)

* You?
* Arthur Sonzogni (Google)
* Dan Veditz (Mozilla, Co-chair)
* Mike West (Google, Co-chair)
* Artur Janc (Google)
* Bartosz Niemczura (Meta)
* Sam Weiler (W3C/MIT)
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
* 


## [Agenda](https://docs.google.com/document/d/1gXvLPz1Fd3i51diHnFtYYRTszTQFpjYPlbncpXlnlLA/edit)

* Side-channel mitigation (COEP, COOP, CORP, XS Leaks, etc):
  * "Isolation by default"
  * New features related to cross-origin isolation: COOP: restrict-properties, anonymous iframes, COEP credentialless.
  * CSP directives that cause leaks (e.g. form-action)
* Injection mitigation:
  * CSP deployment complexity.
  * CSP3 hashes for script#src attributes
  * CSP as confinement; what's missing, what could make this a robust defense?
    * WebRTC controls
    * Prefetch/connect
    * see WASM below also?
  * Sanitizer / Trusted Types
  * CSP: WASM source control rather than just on/off?

## Minutes 

### Isolation

Camille: "Web based isolation in Chrome" ([Slides](https://docs.google.com/presentation/d/1rWPiL1jA-BoMtjifXkxExph5rdZXT_yRACRrnLa8l3Y/edit#slide=id.p))

...: Want to talk about experience deploying isolation mechanisms in Chrome. Spectre! It's bad. Site Isolation! It's good. The solution: COOP+COEP.

...: Cross Origin Embedder Policy controls how you can load cross-origin resources. They need to opt-in via CORP headers or CORS. Similarly, iframes need to opt-into COEP.

...: Cross Origin Opener Policy allows pages to say they only want to interact with same-origin or same-site pages to make it easier to put documents into separate browsing context groups, and therefore separate processes.

...: Shipped in Chrome, Firefox, and Safari. Problem solved! Not enough people are using it. Which is unfortunate.

...: Particular problem for Chrome, as we shipped SharedArrayBuffer with Site Isolation, and need to limit it to cross-origin isolated contexts. This requires dependencies to opt-into CORP and/or COEP: all your cross-origin resources and frames need to do work. Ads, for example, currently block deployment. Likewise, breaking the window handle impacts OAuth and payment flows.

...: Various extensions to COOP/COEP proposed. First, `COEP: credentialless`. [[explainer post](https://developer.chrome.com/blog/coep-credentialless-origin-trial/)] Instead of asking the resource to opt-in, this COEP mode would prevent credentials fom being delivered, therefore ensuring that the attacker only has access to public data (assuming Private Network Access and ORB)

...: `credentialless` launched in Chrome 96 with good feedback from developers. It solves some problems, as long as you don't have iframes, which are harder.

...: `Anonymous Iframes` applies the same model to iframes. Ephemeral storage partition, no stored data by default. Also disables autofill (making the risk equivalent to a phishing page). Origin trial in Chrome 106.

...: `COOP: restrict-properties` restricts communication to frames in other pages to `.closed` and `.postMessage`, hiding other properties. This breaks even same-origin synchronous communication, enabling process-level isolation. As a side-effect, it also protects against a variety of xsleak vectors, while remaining Good Enough™ for OAuth and payment flows. Chrome is currently implementing.

...: Isolation by default: Reduce available cross-origin surface by default, force opt-in to more communication, rather than opt-out.

...: Popups, foe example. We think `restrict-properties` by default might be doable without too much disruption. Good balance between xsleak protection (particularly frame counting) and capability (OAuth, payments, etc).

Sam: What's the frame-counting attack?

Camille: GMail has a query parameter that lets you search. It also has a different number of frames based on whether the search is successful.

Artur: You get cross-origin access to another page's frame tree by default. Legacy thing.

dveditz: Mistake on the level of `document.domain`. We should kill it.

Camille: Right. You can count the number of frames, the number of their children, etc.

dveditz: Have you looked at how many sites use cross-origin `.frames`.

Camille: Access to frames is low. Need to care about all the getters, though. Indexed getter, named getter, etc.

dveditz: Impact if we just said `frames.length` is always zero, etc?

Camille: We found it to be a bit too high, but it's hard to distinguish usage from a cross-origin context from an in-page usage.

Camille: Back to slides: Iframe embedding! Partitioned storage should solve most issues with cross-site data. Private Network Access takes care of data personalized based on network position (except for sites like `datapass.de`). If we need to deal with cross-origin-but-same-site attacks, we need some form of embedding as an opt-in. That would be hard to deploy.

...: `Fenced frames` require opt-in. So, at least part of the ecosystem is moving in this direction.

...: Might also need specific interventions (focus event). `:visited` (delenda est), CSP reporting APIs.

david: Super-targeted: `window.history.length` allows determination of redirects. Should fix that.

Artur: Does `restrict-properties` break that?

David: Doesn't prevent navigation to the attacker's origin after the attack, making the page same-origin.

Camille: It does.

David: Solved! Amazing! Except maybe for weird `postMessage` cases.

Artur: I'm obviously biased, but I'm happy with this set of approaches. Several deprecations in parallel, looking like we can get rid of things.

Bartosz: We're using them at Meta. We're also happy. Question about `credentialless`: Is it supported by the reporting API? Would we see violations in iframes?

ArthurS: The request would fail, not be blocked. The reporting API doesn't really make sense in most cases there.

Camille: As the browser, we have no way to know what you would have returned if we'd sent credentials, so we can't tell you whether it's different.

Bartosz: `credentialless` mode doesn't support iframes, it would be helpful to get reports there.

Arthurs: You do.

mike: Mention `document.domain`?

Camille: Yes. Working on that. We're enabling `Origin-Agent-Cluster` by default, and asking sites that need `document.domain` to opt-in by explicitly setting `Origin-Agent-Cluster: ?0`. We're at a warning stage at the moment: if they use `document.domain` without opting-in, we put something in the console. Numbers remain a little too high. Aiming for Chrome 109, and we're directly poking at specific sites we see using the API. BBC (autoplay in iframes; solved with permission delegation), Naver, others.

mkwst/camille: (Inside baseball on Chromium reverse-origin trials.)

Mike: "CSP xsleaks are great and we shouldn't fix any of them" debate

Bartosz: In the last year or so, they've become more popular.
  * https://xsleaks.dev/docs/attacks/navigations/#csp-violations
  * https://github.com/w3c/webappsec-csp/issues/517
  * https://github.com/w3c/webappsec-csp/issues/8
  * https://bugs.chromium.org/p/chromium/issues/detail?id=1259077

...: These are unfortunate! Perhaps we could _not_ report violations when `form-action` triggers after a redirect.

Camille: The reporting isn't the problem, it's the action that's taken, as the side-effects of the action would still be visible.

Artur: Right. Blocking something should be observable.

Bartosz: This was the simplest one we've seen thus far. What other options are there?

Camille: `form-action` in general, lands on an error page. Detectable.

Bartosz: This one is used in practice, certainly other ways, but we'd handle them in other ways (opener policy, etc).

Camille: `navigate-to`: controls where you navigate. Redirects are a problem. If it's blocked in some cases and not in others, you can distinguish the difference.

dveditz: After redirects, we drop the path, right?

ArthurS: Right.

Annevk: Target can protect itself with XFO?

Artur: ??? (can't hear very well, sorry)

Domenic: Should go to an error page, but 204? Error pages are cross-origin, while the landing page isn't, so you lose access.

annevk: Error page doesn't matter. `twitter.com/me` is the vulnerable point, needs to defend itself by severing relationship with the attacker via COOP.

Camille: I don't think it's defined that way. COOP in a redirect isn't associated with a document.

mkwst/annevk/clamy: (Debating the finer points of whether COOP applies on a redirect, rather than just reading the spec and implementations.)

annevk: We want to sever as soon as we can. Should apply on redirect. CSP blocks the fetch to the redirect location. Prior to that redirect, COOP should break the link.

_(5m break!)_

_(Is **over**)_

(26 in room, 8 on zoom)

### Injection mitigation

MikeW: intro -- CSP can be made to work, but lots of complaints it's complex and it's seen in practice that people use it insecurely. Do we continue to tweak and improve it, or wipe the slate clean?

Artur:  As of a few months ago (Safari 16ish), we have support for strict CSP in all major browsing engines. Now we can decide whether to rest on this, or follow it up with something that is easier to understand and avoid warts. What do browser vendors think about this in general? Add specific features to legacy CSP? Spend time on the new thing?

MikeW: seem compelling from a story telling POV: "Here's the right path. ignore the rest, just do this." Would love to have the kind of support we have now for CSP on some simpler thing, but when would we get there on various implementations? Is that something we could avoid? Maybe... would use the same implementation paths as current CSP so it might be quicker to get there. Bu

MikeS: how are you evaluating dev frustration and how much they've been using it (poorly and well).

Artur: we have some data such as Mike's site. maybe 15% top-level page views have "strict CSP". [views, not sites]  https://mitigation.supply/

...: there is strong evidence it's well used on large, popular sites. Data can be found in http-archive. But it's difficult to deploy if you don't have a large and/or knowlegeable team.

MikeS: I look at StackOverflow a lot. CSP vs CORS, CSP seems to be causing less problems for developers, with less destructive types of problems. Many of the questions show people seem to know what they're doing, close to getting it right. I don't know the quality of their policies though.  We have opportunity costs we impose on developers and I think we're doing OK and don't want to add the burden of learning a new thing.

MikeW: CSP and CORS address different kinds of problems. Failing in injection mitigation is different in kind that failing in cross-origin data inclusion -- the impact on users is bigger for CORS failures.

Camille: CORS is required by the platform to do things devs want, CSP is entirely optional and only people who want to apply it are trying to figure it out (for the most part).

DavidS: If we introduce features that require a "Securer" context then devs might start having CORS-level problems trying to get CSP right for it.

annevk: How much of the established primitive would we reuse? How much complexity is actually reduced. Also: 142 issues with the current spec; many substantial. Maintenance is a real problem for this group. Would like to see more progress there. Finishing things would be good.

Domenic: Second that. Security is important; stare at the spec, get confused about features that aren't implemented everywhere. Doesn't feel like a stable target for the platform. Understanding that before jumping off to a new thing would be helpful.

Bartosz: Is CSP's purpose to prevent XSS? How does Trusted Types fit into that. Seems more practical. Several years ago, it might have been possible to list a few origins in a policy; now things are more dynamic. Single-page applications, etc. But the CSP doesn't change for the life of that page.

Artur: Trusted types are valuable. I'd like the platform to support them. But, they only give you protection from DOM XSS. Nothing else in the web platform that protects from reflected XSS. Even if you want more defense in the DOM, you still need reflection mitigation. Sadly (because it's just a mitigation) it seems necessary.

...: To annevk: the idea was to have a model that's similar to CSP with spelling changes. We've proven that nonce+hash works, making that cleaner to use could be significant.

annevk: Purely syntactic?

Artur: I wouldn't go that far. That would be simpler, but we could add things that extend that model.

dveditz: There's always a split between people concerned about script injection those worried about injection of other weird content in general. A lot of strangeness in policies comes from micromanagement of the latter.

Matt: Adoption: is there tooling for developers that they can have a policy created for them with checkboxes and etc? Go through a site, load a page, have an analysis of what they could use?
=> https://csp-evaluator.withgoogle.com/

Artur: There is tooling. But strict CSP as it exists today doesn't create a policy for your app, but requires application level changes to make your site compatible with the policy. Original goal of CSP was to enumerate the scripts and resources, and then list them in your policy. This is something we're interested in solving with strict CSP, may be able to get closer.

MikeW: I've been most focused personally on the strict-script side, would love to hear from people who are interested in more confinement approaches.

Artur: ["CSP3 hashes for `script#src`" slides](https://docs.google.com/presentation/d/1wANdGweoM-Xlvu13_akMY6NwS3eZULTDZGrJlXkTZyk/edit). We'd like to extend `'unsafe-hashes'` to script URLs. Currently they handle a number of constructs, inline scripts, event handlers, javascript URLs. There would be deployment advantages to allowing it for script sources as well.

...: script-src hashes currently are for the content, not the URL (integrates with SRI). In practice, libraries change, breaking your hash.

...: Why make hashes support URLs? Strict CSP is good. But nonce-based CSP requires a templating system that understands nonces. We could recreate the "CSP adjusts to your application" with the proven Strict CSP model.

...: Without substantial changes to an application, it would be ideal to create a policy in an automated way: github.com/google/strict-csp/ is an attempt, but it's limited in ways that we can't fix.

...: We could just do this with allowlisted script URLs, right? Unfortunately, no: 1. allowlists don't cover query parameters. 2. We need to avoid checking redirects. 3. `'strict-dynamic'` forces browsers to ignore the URL allowlist.

...: This proposal is a small change that would allow deploying policies without changing applications. Middleware can collect the results of a simple deny-all report-only policy, and set an enforcing hash-based policy on the union of those reports. We'd need `'report-sample'` to give us a little more information.

...: (y'all froze for a bit, apologies)

...: Doesn't have all the power/complexity of CSP, just nonce and hash, that's the core.

...: Seems like a promising approach, but we might run into issues. Adding scripts to an application might be hard to do.

annevk: Easier than SRI because you don't know what the script contains, just the URL?

Artur: Yes. You're in control of the URL, but nothing else. So you can lock that in, and rely on `'strict-dynamic'` for the rest. Note that this wouldn't be checked on redirects. Behaves like `'strict-dynamic'` in that sense. Still drops allowlists, so all you get are hashes.

annevk: Open redirect protection.

Artur: You could imagine obscure scenarios in which that didn't work.

annevk: Also Service Workers.

domenic: Prefetch? Preconnect? Is that part of the spec done? Navigational vs subresource? Prerender?

dveditz: Next page vs subresource is meaningful.

domenic: To be clear, if we prerender, we apply the new page's CSP to its requests.

annevk: Historically, I've cared about CSP controlling network activity. That includes preloading/fetch/render. Web Transport, WebRTC, etc.

domenic: Exfiltration is prevented at Fetch level by `default-src`, right?

wilander: Increasing complexity of CSP works against adoption. Would like to see simplification. Splitting into different controls for different things. WICG CSP Next proposal. That's my personal interest. For incremental improvements, but want to see something that gets developers excited about using important parts of it.

## Queue

* You?
