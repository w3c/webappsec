
WebAppSec @ TPAC 2024 - 2024.09.26
==================================

Attendees
---------

* Mike West (Google)
* Dan Veditz (Mozilla)
* Ari Chivukula (Google Chrome)
* Kaustubha Govind (Google Chrome)
*  Emily Stark (Google Chrome)
* Anusha Muley (Google Chrome)
* Marian Harbach (Google Chrome)
* Joe DeBlasio (Google Chrome)
* Camille Lamy (Google Chrome)
* Aaron Selya (Google Chrome)
* Ben Kelly (Google Chrome)
* Carlos Ibarra Lopez (Google Chrome)
* Matthew Finkel (Apple)
* David Dworken (Google)
* Mike Taylor (Google)
* Simone Onofri (W3C)
* Tim Huang (Mozilla)
* Benjamin VanderSloot (Mozilla)
* Daniel Huigens (Proton)
* Aykut Bulut (Google Chrome)
* Paul Zuehlcke (Mozilla)
* Kyra Seevers (Google)
* Howard Wolosky (Microsoft Edge)
* Lukas Weichselbaum (Google)
* Artur Janc (Google)
* Erica Kovac (Google Chrome)
* Robbie McElrath (Google Chrome)
* Johann Hofmann (Google Chrome)
* Erik Anderson (Microsoft Edge)
* Reilly Grant (Google Chrome)
* Shivani Sharma (Google Chrome)
* Andrew Verge (Google Chrome)
* Chris Fredrickson (Google Chrome)
* Dylan Cutler (Google Chrome)
* Balazs Engedy (Google Chrome)
* Laszlo Gombos (Samsung)
* Risako Hamano(LINE Yahoo)
* Maxime Guerreiro (Cloudflare)
* Christian Liebel (Thinktecture)
* Wendy Seltzer (Tucows)
* Gal Weizman (ConsenSys)

Agenda
------

* **9:00 - 9:10**: ☕ and agenda bashing.
* **9:10 - 10:10**: Following up on breakout sessions, and/or topics we didn't get to on Monday
  * _[Deprecations](https://github.com/w3c/tpac2024-breakouts/issues/20), [PEPC](https://github.com/WICG/PEPC/blob/main/explainer.md), [DBSC](https://github.com/WICG/dbsc/) all seem like they might benefit from more conversation._
  * _We'll allocate time in this slot as part of agenda bashing above._
  * Suggestions:
    * CSP maintenance (pulling "What's left before putting CSP into 'living CR' mode?" from Monday)
    * `trusted-types-eval` discussion from <https://github.com/WebKit/standards-positions/issues/355> (@gregwhitworth)
    * Web Crypto streaming (@twiss)
    * Private Network Access (@estark)
    * [Permissions API integration with system permissions](https://github.com/w3c/permissions/issues/332) (@reillyg)
    * Deprecations & Security (@lwe): javascript URIs, DOM clobbering, dangling markup, and others
    * Page Embedded Permission Controls (PEPC, @engedy)
    * _Your suggestion goes here_
* **10:10 - 10:30**: [Remote cryptokeys](https://github.com/WebKit/explainers/tree/main/remote-cryptokeys) (@marcoscaceres, @estark37)
* **10:30 - 11:00**: ☕ & 🍰 @ [Lanai Deck, Fifth Floor](https://www.w3.org/2024/09/TPAC/schedule.html#map)
* **11:00 - 11:45**: Isolation
  * (~30m) Cross-Origin Isolation
      * [Document Isolation Policy](https://wicg.github.io/document-isolation-policy/) (@camillelamy)
  * (~15m) [Realms Initialization Control](https://github.com/WICG/Realms-Initialization-Control) (@weizman)
* **11:45 - 12:20**: Cookies
  * (~10m) `sandbox="allow-same-site-none-cookies"` (https://github.com/explainers-by-googlers/csp-sandbox-allow-same-site-none-cookies) (@aamuley)
  * (~5m) NOTE for [standardizing cross-site cookie semantics](https://dcthetall.github.io/webappsec-standardizing-security-semantics-of-cross-site-cookies/) (@dcthetall)
  * (~10m) [Cookie Layering](https://github.com/httpwg/http-extensions/issues/2084) / [RFC6265ter](https://johannhof.github.io/draft-annevk-johannhof-httpbis-cookies/draft-annevk-johannhof-httpbis-cookies.html) (@johannhof, @annevk)
  * (~10m) [CHIPS](https://github.com/privacycg/CHIPS) (@johnwilander, @dcthetall)
* **12:20 - 12:30**: Next steps, followup.

CSP Maintenance
---------------
Mike: we've talked about this the last couple of TPACs and meetings in-between, and we're doing a bad job maintaining this spec. Lots of little issues to resolve, not "on fire" so we've not jumped on them, but "smoldering". We need to clean this up and declare "Level 3" done so we can move on into a "living spec" model. We need to have tests and then follow the WHATWG model to add new things. But we need to wrap up what we have first.
https://github.com/w3c/webappsec/issues?q=is%3Aopen+is%3Aissue+label%3ACSP

`trusted-types-eval`
--------------------

Greg: Salesforce. Igalia's been doing a great job with us landing Trusted Types across various browsers. One thing we want to do is introduce a CSP keyword: `trusted-types-eval`. `eval()` becomes a no-op if not supported by the policy. Luke from Igalia suggested that Anne's concern was overlap with `strict-dynamic`. Would be ideal to land that policy.

Mike: [explaining the mechanism]

Dan: [talking about the definition between CSP and TT]

Dan: Talked about this before, generally thought it was a good idea. What about back-compat? `unsafe-eval` + `trusted-types-eval`? Would ignore the unsafe variant in the presence of the new keyword.

Mike: yes, that's how it's defined

Lukas: This solves a real problem. We tried to remove `eval()` from CSP across Google, but there are instances where its semantics are necessary, which caused us to retain `unsafe-eval` in many places. These support TT today, and it would be ideal to use the safer variant.

Dan: Mozilla is also supportive (but not a formal statement). Much better to have a trusted variant.

Greg: Would be good for webappsec folks to weigh in on the issue. https://github.com/WebKit/standards-positions/issues/355

Web Crypto Streaming
--------------------

Daniel: Current state is a draft in Winter CG (Server-side JS runtime CG) for some aspects of web crypto streaming (https://github.com/wintercg/proposal-webcrypto-streams). Cloudflare has shipped streaming hashing in their server-side runtime. Useful for server-side applications, but also useful on the client-side. Current draft has encryption stream object, have shipped a digest stream object. Not in a draft yet. Separate constructor you can pipe a stream into. On the GitHub issue there was another proposal to allow existing functions to accept a stream. Main questions are whether there's interest in that work, and whether there's a preference between those two options. Should we move that draft from Winter CG to here? Create a new draft? Discussing moving to ECMA. But would make more sense for it to be in this WG along with the rest of web crypto.

Mike: Browser vendor interested?

Daniel: Not yet. Interested in doing so!

Mike: Chromium is going to be happiest to support things BoringSSL supports.

Daniel: I assume it supports streaming.

Emily: More concerned about plumbing.

Daniel: Node.js supports streaming, builds on OpenSSL. Should be possilbe, might be work.

Mike: Would suggest talking with crypto folks at browser vendors.

Emily: Client-side use cases?

Daniel: Single-most upvoted issue on GitHub (https://github.com/w3c/webcrypto/issues/73). Use case is hashing/encrypting a large file. Might not want to keep the whole thing in memory.

Simone: Experimental process for incubation -> WG. (https://github.com/w3c-fedid/Administration/blob/main/proposals-CG-WG.md)
https://blog.mozilla.org/en/
Daniel: Also similar to what we're doing with curve25519.

Private Network Access
----------------------

Emily Stark: Effort to restrict private network access from the public internet. Been in development for a long time, various stages of rollout for a long time. The project's transitioning internally between teams, but the rollout is stuck on various fronts. A few different restrictions in the spec: secure contexts, preflighting subresources, preflighting navigations. These are all stuck in various ways for compat reasons. We're going to look into different approaches. Maybe not entirely different, but possibly relying more on permission prompts or other suboptimal solutions that might be deployable. Interested in learning whether other browsers are working in this area, have other ideas we should pursue.

Dan Veditz: We're interested in solving the problem, but haven't had the bandwidth to research. Would be inteested in a published record of the experiments you've done and the workarounds?

Camille: No. Several parts to what we've done: first, restricting access to private networks to secure contexts. Thought this would be easy, it wasn't. Need TLS solution for local networks, discussed in a breakout yesterday [TODO: find notes]. Thinking about allowing non-secure access to local networks to avoid mixed content with a permission prompt. But this prompt is complicated. Runs into the kinds of issues we discussed around local HTTPS yesterday. How do you identify the device over a non-secure network?

...: Preflight part is also hard. Issue of web compatibility. ~50% of the usage switched to the headers we defined, but the rest is not moving. Too high for us to enforce the restriction at the moment. Considering a permission prompt in the case the preflights fail. If they succeed, no prompt. If they fail, prompt. Thinking through this, but not set in stone.

...: Only subresources, not navigation. But we want to prevent poking at a router with something that has side-effects, so we need to cover navigation. Tried non-enforcing preflights turned out to crash OpenVPN and login into AWS (handling OPTION as though it was POST). We set a timeout on the preflight just to see if we'd break things, warnings in devtools, etc. But that has impacts: sites that don't expect OPTIONS requests get you into all sorts of trouble. Memory corruption: expected `GET` or `POST` meant that `OPTIONS` caused a buffer overflow.

Erik Anderson: Are the deployment issues more consumer focused or nterprise focused?

Camille: We shipped an enterprise policy. Enterprises could turn it on. Here we're more consumer-focused, trying to mitigate router attacks, etc.

Erik: Other mitigation ideas: zany ideas about loopback, querying processes locally with some lower-friction ping outside the web context. Or local policy defined by local applications.

Emily: Are we even doing preflights for localhost?

Camille: Yes.

Emily: But problems are also to routers and printers, etc.

Camille: Just public to localhost. Data about where violations are triggered are a mess. Chinese resturaunt in Spain shouldn't be accessing private networks. Suspecting intranet login pages, etc.

Dan: Fingerprinting local ports on localhost and network devices.

Camille: Challenge we've had: even with origin, etc. hard to see if there's a legit use case or not.

Matt: Is this available in webview?

Camille: No. Excluded.

Matt: Just curious, we know of some apps that rely on talking to locally-installed apps.

Camille: Looking at the web first, then thinking through webviews.

Erik: I suspect you're going to have a ton of compat problems even just with localhost. Other solutions, prompts, other ways of unblocking local apps.

Emily: One revalation I've had is that we perhaps shouldn't ask IoT servers to update. They're very update-averse, so maybe we need to put more on the user.

Erik: Per-hostname policy might be horrible for enterprise, but might be way not to throw the whole thing out.

Dan: IPv6?

Emily: Yes, admin policy.

John Wilander: Years ago, we started working on a mitigation behind a flag. We didn't ship it, but considering making it easier to connect to the first thing a page wants to do, but block scanning. Considering attacks and fingerprinting by scanning ports. We thought that legit use cases would be on the smooth path, talking to just one service.

Camille: We've seen one legit use case that scanns: 3D Printer setup. Printer gives its IP address to a server, then you get a list of IP addresses from a server, tries to connect to each IP address, eventually finds it and connects. Weird things people do with private networks.

John: Might be incetivized to change it if there's a smoother path?

Emily: Changing the priorities a bit. PNA approach prioritizes attacks on known-vulnerable devices, deprioritizes fingerprinting. Still timing attacks. So, tackles a different angle of the problem.

John: Wasn't just fingerprinting. Also speculative "Are there things I can attack here?"

Emily: Right, reasonable threat.

Camille: Could consider it!

Nick Doty: I understand the prompt isn't what you want to do, but I'm trying to understand what decision the user is making in that situation? What should the user do when they see that prompt? Do they know they're trying to configure things?

Emily: Would hope users understand the context they're in: I'm configuring a device, vs I clicked on an ad.

Camille: Metadata from device could feed into prompt. (Could respond to a preflight with a private network address name that is human readable and understandable.)

Nick: Malicious device on local network?

Camille: If we want the device to send us a human-readable hostname, it might not need the prompt in the first place. Permission model for cross-origin iframes: two cases where this happens. Normally permission model is just top-level, but particiular case of SDK for programming robots, embedded many places.

Nick: Could be delegated from top-level?

Camille: Yes.

Matt: How are you thinking about subresource requests to HTTPS URLs?

Emily: That question is the reason that improving HTTPS for local networks isn't as relevant to PNA as it looks. We don't have great ideas about how to connect to a subresource that doesn't have a publily-trusted cert if you haven't connected in the past.

...: In that scenario, you might be able to use Web Transport instead because that API allows you to specify a cert. Hard, but might be technically possible.

Permissions API and System Permissions
--------------------------------------

Reilly: I'd like to talk about the [interaction between browser and system permissions](https://github.com/w3c/permissions/issues/332). If you look at the end of the [acquire a position](https://w3c.github.io/geolocation/#dfn-acquire-a-position) steps in Geolocation you'll see a note talking about permissions granted at an OS level to the browser. We fixed a problem in Geolocation wherein it wasn't well-specified if a user grants permission, but decides that the browser app shouldn't have access to that capability. Now there's a mismatch between what the user said about the site and what the user said about the browser. In this case, the browser can't implement the API, the call won't work. But we also need that concept to be pulled into the Permissions spec to explain `permissions.query()`. Would previously say `allowed`, which is confusing. We changed that behavior in Chrome, then got a bug report because a developer was using that inconsistency as a way to tell the user to go into settings. Closed as WAI, but raises a question about how we deal with these cases in which a web permission maps to a system permission, some acknowledgement of a potential double-prompt for site and browser app. Really two checks here, issue that browsers should consider. Can we update the spec to include this concept? Thoughts from other implementers?

Johann: What's the end developer semantics you'd like?

Reilly: I think a developer should know when they can't use an API. If they ask the browser "Can I use X?" they should get a clear yes or no. Should be recommendations in the spec for browsers to provide a way for developers to understand the situation. If the OS would allow a prompt, we should allow the site to prompt again, for instance. If blocked, then the browser should let the user know that there's a conflict in the decisions they've made.

Johann: Not something we'd tell the developer directly?

Reilly: Probably not? But certainly should consider it.

Dan: Should tell developers the truth.

Johann: These can get out of sync, would say "prompt" in some case, "denied" if perma-denied.

Erik: Not sure it makes sense to tell the site directly. But may be value in a way to indicate that users are trying to get permission, could help the browser suggest something to the user? Parallel permission state. Should the site be allowed to ask the browser to tell the user about the system setting?

Reilly: On macOS, using Chrome with location: open settings, toggle the permission, Chrome indicates something to users in the address bar. Part of this might be recommendations in the spec for browsers to implement that kind of user assistance. Inconsistent right now.

Ben Kelly: If a user turns off permissions at the OS level, should we take it as a signal to reset all sites to the default? Might avoid the conflict.

Reilly: If the browser does have a model of remembering decisions, it might be a good signal about user intent? Thinking about this when dealing with a bug wherein Chrome was interacting with the macOS permission model that caused the OS to take away our permission out of spite. We just touched the API wrong, wasn't user choice, but still needed to deal with it.

Balazs Engedy: Similar problem with notification. Inconsistency between site and OS. Solution we picked there was a 3-day grace period. If you turned off the OS-level state for three days, we removed the permission for sites. Saw temporary enable/disable of data types in some OSs where users would turn off location when going to specific places, didn't want to break their locally-stored state.

Nick: If a site can't have access to a capability, we should tell them that. But shouldn't reveal to the site OS-level information about whether there's a prompt or not.

Reilly: We want to give sites control over when the prompt happens. Defined the API in those terms. If you go through the API and think you're not going to get a prompt, and then call an API it shouldn't prompt.

Nick: We shouldn't have given that guarantee. Sites shouldn't know whether a prompt would occur.

Reilly: ???

Marcos: We shouldn't reveal OS information. But we could reveal that the state changed and that it's now disabled. Browser might not know the OS state.

Reilly: API for that.

Dan: Not going to poll that all the time.

Reilly: In an ideal world, we'd only show a prompt in the point where the spec says we might ask the user.

Nick: Talk OS into this?

Reilly: If we get to a point where the OS would prompt, we'd say we don't have permission.
    
Balazs: We have the `prompt` state for the API for a case in which we don't want to show a prompt, but want to indicate potential user mediation. We have a matrix that maps these two states onto something we'd reflect in the APIs. Only if the site-level state is "granted", we'd expose additional information about OS settings that might prevent the request. User agent is best positioned to guide users through the OS-level surfaces, showing prompts, or deep-linking into settings to get to the state the user wanted.

Johann: Is this written down?

Balazs: Internal doc. I can spruce it up and link it from the meeting notes.

Reilly: As geolocation editor, we need help. To Nick's point: not proposing that we expose more information about OS state. Combined into one value, developer can't tell the difference between browser or OS settings. That's the same state.

Paul (Mozilla): I mostly agree w/what Nick said. Sites don't need to know the difference between the site being blocked or the user being blocked; this is something for the browser UI to work out.

Erik: Violent agreement.

Balazs: Sounds like we're in agreement that UAs should shield developers from this complexity. Browsers ship on multiple platforms, seems better for a finite number of user-agents to do this work rather than an infinite number of websites. One more thing: based on a very small sample size: developers do not want to bother with this distinction between states, but they very much want UAs to fix this problem well because they care deeply about users being able to use capabilities, camera for video calls, etc. More work for us, but better for developers.

Dan: From Mozilla, I'd say yes. Back to Reilly's point: asking for the spec to include recommendations to UAs.

[Reilly's going to put up a PR.] [Good luck]

Remote CryptoKeys (https://github.com/WebKit/explainers/tree/main/remote-cryptokeys)
-----------------

[Technical issues.]

Jon Choukroun: iCloud Mail team. Author of the explainer with Marcos. Trying to achieve E2EE email on the web. Anything with non-ephemeral keys, we believe these should be usable without exposure to JavaScript code. Explainer proposes APIs similar to `subtle.crypto` with additional parameters that would allow sites to request acceses to key material, results returned to application. We're moving forward with iteration on this proposal. Based on feedback, requests for cert provisioning and key generation. Added methods to provide that. Some don't have analogs to existing APIs, a bit of a departure. Security/privacy considerations.

Emily: Open issues on the explainer we could discuss. Important one is origin binding. Would like to understand the use cases and key-storage properties you need. Hardware-backed keys? I'd argue that not exposing keys to the site isn't the critical thing. You really want persistence, keys that live as long as the user or OS says, not the browser.

Marcos: A key that is not generated in JS, but acquired through some other means. Hardware-backed thing, gained from employer, etc. Persistent.

Emily: Origin-bound?

Jon: Origin-binding is a great property for security and privacy, the latter in particular. Key property is persistence. Needs to be accessible to the user regardless of browser, Key needs to be used beyond one session. Want to avoid a web application using a key that they don't have permission to use. Origin-binding is one mitigation for that, but don't know that it absolutely has to be origin-bound. ???? Prompts are mitigation in the spec. Too many prompts is bad. Alert fatigue. Unclear to user.

Daniel: In the email case, origin-binding would mean that if you have a cert for `daniel@example.com` then you can only use the key on `example.com`? Concern is that a web application might be used with any email address. Not sure it would work.

Emily: What I was imagining was something different, as I agree that that scenario doesn't work. Imagining that the key's generated by an origin, only usable by that origin. Can do this today, but can't ensure it stays around forever.

Daniel: Right, but here we want keys generated elsewhere.

Emily: Can't only be browser, need to import existing?

Daniel: If we only want to solve persistence, we don't need to add anything in web crypto. Request persistent storage, etc. Could store in indexedDB. Don't need anything else.

Marcos: Don't want to store the private key in the browser?

Daniel: Could store a reference to the key material in indexeddb, point to a key in hardware. Allowed by the spec today. Non-exportable keys.

Reilly: It would be good to get clarity about this proposal's scope. External hardware keys in government cases. Does this proposal cover those use cases? Key plugged in, might not be origin-bound. Need to un

Jon: The keys we aim to support can either be generated on behalf of the web application. But the use case at question is one where the keys are stored somewhere outside the browser, need to be accessed by the browser and another application, email app. Say the key's stored in 1Password. Want the user to have access to those keys whether they're using the Mail.app or the browser's interface to mail. Want to extend the crypto API to allow device-to-device and this use case.

...: For origin-binding: thinking about keyed metadata separate from the key material. Whatever does the key lookup would use the origin passed in by the browser to identify the correct key to validate that calling application had privilege. No requirement that the key matches directly.

Emily: For the 1Password example: this sounds a lot like webauthn. Not sure what the relationship is. But for this example, would there be a new OS API to get the key from 1Password to the browser? The origin would be passed through that OS API?

Marcos: Can't speak to OS API, but would be some mechanism to facilitate that.

Dan: Seems like smartcards. Or is the spec going to stay neutral about how it's implemented?

Marcos: Incubation to figure that out.

Emily: Relation to webauthn?

Marcos: Hoping webauthn remains for the login cases, but could be stretched I guess.

Nina: Web Authn has a PRF concept, primitive we put there for E2EE. Maybe you need to match the protocol on top of it, but many things you mentioned are already there. Enterprises can put a credential on your authenticator before they give it to you. Already supported by password managers. Infrastructure is already there to prevent supercookie. UI could be tweaked, so why not use PRF?

Marco: Maybe better options.

Jon: Looked a t WebAuthn. My understanding is that it's geared towards ephemeral keys, or keys that have no guarantee of longevity. For email, we need long-lived keys, as mail can't otherwise be read. But, to the points on webauthn: we can indeed reuse many of the things. But I'm not sure we can just use webauthn.

Emily: WebAuthn keys are long-lived, up to the authenticator, but the use case is not ephemeral keys. I think your problem with PRF will be that you want to use existing credentials.

Daniel: Asymetric keys?

Emily: Derive it.

Daniel: I guess so.

Emily: Import is the issue.

Jon: If we can't import existing S/MIME keys, that would not work for our use case.

Erik: This can't reasonably be origin-bound. Tied to email address. Web-based mail clients differ over time, more about signing emails vs being bound to a specific client. WebAuthn might be a challenge there. Sorta feels like a digital credential? Uniqueness around persistence, perhaps?

Kristian: Erik knows more about this, but it sounds similar to the enterprise extensions to DBSC. Based on policy you can ask a local program to do a crypto operation for you, could use existing keys..

Erik: Similarity is pulling from another source, but otherwise nuance about multiple mail accounts.

Reilly: I think I've talked to the same kinds of customers that Jon might have talked to. Large deployments of existing certs, and existing processes for deployment that they're not comfortable changing. Hard to convince them that WebAuthn PRF, etc is sufficient. Hard to overcome comfort with the security model they understand. For this discussion, helpful to be explicit about dealing with an established cert ecosystem that will be difficult to move.

Jon: Existing S/MIME ecosystem is important, can be more explicit.

Document Isolation Policy
-------------------------

Camille: [slides, link TODO]

...: Document-Isolation-Policy. Cross-origin isolation (COI) is difficult to deploy. SharedArrayBuffer allows you to share memory between WASM threads, workers, etc. Allows large speed increases for some workloads. Also enables Spectre, which is bad. We decided that it's not safe to expose everywhere, COI allows us to expose it safely.

...: We've enabled COI through COOP and COEP for a while. But they turn out to be very difficult to deploy. After years, 0.04% of page loads are cross-origin isolated. Way lower than it should be. Rethinking our approach.

...: Why hard to deploy? They break sites in three ways: break communication to cross-origin popups, they make it difficult to embed authenticated 3rd party content, and a frame cannot be COI unless its entire ancestor chain is also COI which breaks embedded widgets.

...: Process isolation in the browser is what we're aiming for. COI tries to deal with leaks of data cross-origin within a given process. Designed COOP/COEP in 2019, wanted the API to work even in browsers that didn't support out-of-process iframes (OOPIF). In 2021, Firefox shipped OOPIF, and we've heard that Safari's working on it as well. Still don't have it on low-end Android phones, but developers have told us that computation-heavy workloads are more focused on desktop. Caused us to rethink the tradeoff.

...: If we depend upon OOPIF, we can have a much simpler deployment story. Document-Isolation-Policy is a header that applies to a single document, isolates the document in a process with similar documents. Relying on user agent keying. Two documents in different user agents can't script each other, so they can be in distinct processes.

...: Process isolation when possible, "logical" isolation when not.

...: Also applies checks similar to `COEP: credentialless`. CORS requests include credentials, non-CORS requests don't.

...: Does not impose requirements on child frames or on ancestors.

...: Why not reuse `Origin-Agent-Cluster`? We want predictability. OAC is hard to predict given the dependency on the state of other documents in the same browsing context group. Easier to push things out to a distinct User Agent Cluster, with more predictable effect.

...: Chromium has an implementation on desktop. A few known bugs around workers and inheritence. Should fix those soon. Will run an Origin Trial in Chrome 131-133 (a month or two from now). Would like to launch first on desktop, then add Android support later due to implementation complexity.

...: Interested in feedback. [todo: link to repo, explainer, standards position requests]

Artur: Iframe/popup case. What happens to same-site but cross-origin frames/popups in this model? COI aims for an origin boundary. Would same-site frames fall into a separate process, even in "site isolation"?

Camille: We deprecated `document.domain` by default, so we can isolate at the origin level in these cases. You get an origin an isolation key, so you won't be in the same process.

Dan: Is OAC's all-or-nothing implementation a bug?

Camille: Design decision. We didn't want to put same-origin documents in distinct agent clusters because that breaks synchronous DOM access. Here, we're doing that.

Dan: What's the use of OAC then?

Camille: OAC is not a security header. It's a perf header. It hints to the UA that it would be nice to have a per-origin process because it embeds same-site properties that do many things. Want one process per origin, as otherwise blocked on the same thread.

Ben: Partner interest?

Camille: Internal Google partners. But also Microsoft has expressed interest for Office PWAs, and many game developers.

John: Yes. We're working on Site Isolation. It's a WebKit feature, not Safari: open source, and applies to WebView. Question: do you envision that process isolation is guaranteed? And origin- vs. document-level isolation? Many documents might create many processes?

Camille: Won't specify in a binding manner what the UA is supposed to do for process isolation, just like we did for COOP/COEP. At the end of the day, it's up to browser vendors to decide process isolation. In Chrome, we do plan to guarantee a process, but if this proves to be a performance problem, we'll rethink. But we don't want to spec Chrome's process model.

...: For the other, only two states: cross-origin isolated, or not. Even if many documents are COI and others aren't, all the COI docs go in one process, all the others go in the other. It would be our recommendation that you use COI for all documents in your origin to avoid the other process. Origin Policy would be a nice way to configure this for the whole origin.

John: I misunderstood, then. "Document Isolation" doesn't mean document-level isolation, but moves the document to the origin-level isolation.

Dan: You don't literally mean that all the isolated ones are in the same process. Up to the implementation, right? Just need to not mix with the other state.

Camille: `a.com` has a process for isolated `a.com` and another for unisolated. Same thing for `b.com`.

Dan: In Firefox, we have multiple processes for `a.com` already.

Camille: We're not specifying process allocation at all. Browsers can do what's right for their threat model.

Dominic: Logical or physical process isolation. Implementation defined. Interop problem if only the latter gets the cool APIs.

Camille: Same as status quo OAC. Have this for Android and WebView.

Dominic: I guess this has worked so far. Good. Also, [my experience with origin policy and why it doesn't work](https://docs.google.com/document/d/1jptq14gPpuBt3933-Hns2wwrHIW6qpo3xu6Xkfs12N4/edit#heading=h.vtrxlnh15e4h). I'd encourage folks to use normal headers and allow developers to apply them uniformly.

Victor Huang: Applicable to top-level documents, or to all frames in the chain?

Camille: No, the benefit of the proposal is that it's scoped to a document, and doesn't ask anything of frames. Subresource checks were in only to have a single header. Could have also required COEP, but it's more complicated to explain to developers. Optimizing for dev experience.

Robbie Mcelrath: Shared Service Worker? Does it work in this non-document contexts?

Camille: Discussing right now. Possible to opt-into COI for a service worker via headers today. Could imagine doing so with this header. Very open to discussion about the right behavior.

Ben: Safe for an unisolated Service Worker to control an isolated page?

Camille: Existing problem. Aiming to copy what we're currently doing with COEP/COOP-based COI.

Ben: Origin Policy: issues with headers, origin trial concept has the same sort of problem. Partners complain about deployment complexity. Thinking about well-known files as deployment convinience with server-side crawls. Is that good for the platform?

Dominic: HSTS-preload?

Camille: Using the header version first, and if we hear from developers that something's missing we'll look into additional options.

Dominic: Works poorly if you need it to always work. Works very well as an optional enhancement.

Realms Initialization Control
-----------------------------

Gal Weizman: Working with Yoav on RIC. https://github.com/WICG/Realms-Initialization-Control

...: The problem that motivates this proposal: the web is evolving in a great way. Building applications on top of complex supply chains. Websites shipped with code we don't maintain, and don't trust. That makes it hard to tell good code from bad code. We want to harden the security of the application's origin beyond today's capabilities.

...: Done by restricting/mitigating the power of capabilities exposed by the JavaScript environment. DOM, Storage, Network, etc.

...: Let's say we want to remove `fetch()`: we can monkey-patch existing APIs, changing how capabilities behave within an origin.

...: Problem with shipping such mitigations: same-origin concern. Attackers can escape into a same-origin realm: `<iframe>`. That creates a new realm, exposes a fresh instance of the API that was removed.

...: This is an actual problem. Hard to mitigate all the ways to create a same-origin realm. Proposing an `init-realm` CSP directive: gets a path to a first-party script, an browser would execute this script in new realms before any script has the opportunity to run. Applies to all same-origin realms: top, popups, PIP, etc.

...: Looking for two types of feedback: general feedback about the idea and the approach, and specifically whether CSP is the best place to work with. We through it would be appropriate, but the inheritence properties of CSP might not cut it. Permission Policy, Document Policy, new inheritence mechanism. None does exactly what we need, they all have small problems for our use case.

Matt Finkel: This is interesting. Do you need the flexibility of an arbitrary script? Or is having something that lets you control/inherit features/API access acceptable?

Gal: Good question! Thinking about this. Runtime JS security folks' perspective: might be too slow to move in the direction where the browser provides specific permissions. JavaScript allows us to express any rule we want. Might want to interpose on APIs, virtualize aspects of DOM operations or network requests.

Ben: Have you thought about Workers? Local-URL Worker would still escape. Monkeypatch those out?

Gal: I think the Worker argument is a good one to discuss. Shows what this proposal focuses on. About hardening the origin. If I want to mitigate DOM, for example, then Worker isn't relevant. Storage as well. Workers can't synchronously access main realm.

Ben: Workers can access IndexedDB, other types of storage. You're right about DOM, but a subset of risks. Just need to consider as well.

Simon: This is basically "run this first and in all realms for monkeypatching". Starting from supply-chain security, then talking about injecting scripts: many steps in-between. Securing specific things in an application is complex, framing this as resolving supply-chain security is too much of a stretch. Might still be a good idea.

Gal: I agree. I won't claim that this solves supply-chain issues. I do think this proposal will help with some layers of these problem significantly.

Simon: Is this just a proposal for folks who already have a monkey-patching library and want to make it easier to sell?

Gal: Once something like this lands, virtualizing the JS environemtn will be possible in a safe way. Better composibility, safe combination of entities within an origin.

David Dworken: At Google, we've talked about this kind of idea. Header of some kind that triggers JS injection. Prototype-pollution mitigations can be fixed with 2 lines of JS, but hard to ensure those lines are executed everywhere.

John Wilander: I understand this as same-origin realms. Fetch example: cross-site frames would also allow fetch, right?

Gal: This is about same-origin realms. For exfiltration, you can totally create a cross-origin realm and exfiltrate information from there. But fetching on behalf of the origin to its own server wouldn't be possible in that scenario. CORS mitigation, etc.

John: Ok. Other parts of the web ecosystem want to be the first script run. Adtech, analytics, etc. Will everyone jam themselves into the first script? Just move the problem there?

Gal: Given how we only allow first-party script, it's a partial mitigation. Google Analytics is fetched from Google. This is more like a Service Worker that only loads from your own origin. So, yes. Some scripts might claim they should be first, but they can't update their code that way.

John: First script has to be first-party? Can it not load scripts?

Gal: Yes. It can, but additional round-trips.

John: Still worried about analytics.

Mike: Lots of interest. Where should we talk about this?

Gal: [TODO: repo link.] Looking for feedback and help with things, specifically inheritence mechanism.

(Additional comments on this topic that happened in the speaker queue)
    
* Shivani (below the cut) : rings a bell with fenced frames revoking network access (handles nested iframes and workers etc. ) and having ephemeral, unique storage partition. Some overlaps there probably?
* Ben Kelly (below the cut): oh, you can polyfill this with service workers, right? How do you ensure the service worker is already running? there is a service worker header that is added for navigations sent to the server, etc
  * Answer form ddworken: This is tricky, because how do you register the SW? 
  * wanderview: in terms of registering the SW, this depends on your site structure... you could avoid loading any 3P script in 1P context until you are ensured its installed.  The fact ctrl-shift-r bypasses SW is probably a bigger problem.
  * ddworken: Good point about control-shift-r, I agree about that being a bigger problem. 
  * there are a lot of existing SW issues about validating client-side code integrity with SW and what is missing today... but it seems like they could get some incremental benefit with SW today, even if its not a perfect protection
  * Hiroshige Hayashizaki: Good point > SW polyfill, I feel at least comparison with the SW polyfill will clarify what RIC wants and isn't possible currently.

`sandbox="allow-same-site-none-cookies`
---------------------------------------

[TODO: slides]

Anusha Muley(@aamuley): Same-site cookies. Many browsers and users block third-party cookies.

...: Sandboxing. Document has an opaque origin->>restricts access to same-site cookies.

...: The interaction with `samesite={none,lax}` is inconsistent between browsers. Allowed in this scenario in Safari, blocked in Chrome/Firefox.

...: Proposal is to accept a new `sandbox` flag: `allow-same-site-none-cookies`, opt-in from a server to include their same-site=none cookies in their sandboxed frames.

...: Considerations for this proposal: opt-in behavior that servers can choose. Only first-party cookies, all same-site. Requests still treated as cross-site.

...: SAA/API based solution? This would require `allow-script`, which we don't want.

...: Third-party exemption would be a temporary fix.

...: If 3PC isn't blocked, no impact.

Matt: Clarifying question. If you have an iframe that's same-site by URL, but the iframe is sandboxed.

aamuley: Yes. `storage.example.com` frames `user.storage.example.com`, but sandboxes it.

Johann: Safari does this correctly today.

Matt: Not sure this is intentional? We just don't consider the sandbox when we decide what the current domain is for HTTP requests.

Kaustubha: Consistent with ABA scenario? Behavior differs between browsers here too.

Matt: Right, we don't consider the ancestor bit right now.

Johann: For both ancestor bit and sandbox, we block by default with an easy opt-in.

Aaron Selya: Alternatives?

aamuley: Storage Access API. But don't want to force `allow-script`. Against the purpose of the sandbox.

Erik: Bikeshedding. I could imagine confusion about forcing frames to get samesite=none cookies. `allow-same-site-none-cookies-if-same-site`? That's a mouthful.

aamuley: This doesn't change anything if third-party cookies are disabled. Don't want to give the impression that the header is the reason for blockage rather than the browser settings?

Johann: SameSite check technically fails. That's why we have the check in the first place. True URL is same-site, but origin is opaque.

Erik: Doesn't do anything for cross-site embed. Behavior doesn't change.

[more bikeshedding, naming is hard]

Matt: Beneficial to align on this. Worry about adding another knob to sandbox for this.

[standardizing cross-site cookie semantics](https://dcthetall.github.io/webappsec-standardizing-security-semantics-of-cross-site-cookies/)
----------------------------------------------

Artur: [standardizing cross-site cookie semantics](https://dcthetall.github.io/webappsec-standardizing-security-semantics-of-cross-site-cookies/). Over the past year or so, we've talked about standardizing the semantics of cross-site cookies in edge cases. Summarizing an opinionated view of how the cookie model should work from a security perspective. Delta between privacy constraints and security improvements is relatively small. This doc clarifies the model.

...: Enumerates the classes of vulnerabilities possible because of cookie attachment. [TODO: link]

...: Talk about the different cookie models out there. Tabular summary in section 2.7 [TODO: link]

...: Aligning on `SameSite=Laxish` is beneficial for security.

...: Reasonibg through scenarions in which there are cross-site interactions (section 3 [TODO: link])

...: Would appreciate folks going through the doc to tell us about disagreements or concerns with the goals or specific recommendations.

Johann: Talked to folks about this. I think we have a better understanding of the behavior in various browsers, but edge case behaviors that it would be good to get on the record if they're desirable.

Mike: Objections to pulling this into the group as a work product?

Johann: Would make its way into standards through cookie layering. Works in parallel, but helpful to sequence IETF work.

Matt: Practical deployment concerns that we'll need to think about, getting alignment.

Cookie Layering
---------------

Johann: [TODO: Slides]

...: We want to rewrite a big part of the cookie spec to better support standardization of browser features, Storage Access API, etc. I'm working on this with Anne, getting feedback from others.

...: New cookie semantics require better integration in the cookie spec and HTML.

...: Started drafting changes to HTML/Fetch and RFC6265bis.

...: RFC6265bis is on a good path to becoming an RFC. Frees us to write a `tre`. Will present to IETF shortly.

...: Draft spec PR after a review of integration points. Cookie Store API handwaved a lot of details. That's going to be a challenge. But worthwhile, as other vendors are starting to look into things, and we need better answers.

...: RFC6265bis previously held all the logic for cookies. SameSite checks, walking frame tree, etc. Shouldn't be doing that. Should be done by browser specs. Breaking out the layers allows standardization of all the important pieces.

...: IETF defines a cookie store, exposes operations to browser specs which can make use of them. IETF will provide a default implementation for non-browser implementations.

...: [TODO: link to draft]. Ideally will become more official in IETF soon.

...: Next steps: refine the draft, make event works, incorporate CHIPS, compat issues with `samesite=lax`, etc.

...: WPT. Need many tests. Overall goal is consistent behavior for how cookies are handled by browsers. Shouldn't take more than a few years.

John Wilander: Matthew landed an open-source commit: "Initial support for opt-in partitioned cookies". Not committing to release schedule, but good news for standardization.

Kaustubha: Would you be willing to talk to developers about this?

John: We tried to get something into open source so we can talk about it. Our HTTP stack isn't open source, and that's where a lot of implementation happened. We're also interested in communicating to developers. We're not opposed to CHIPS.

Kaustubha: Spec conformance? Anne opened questions around memory limit.

John: I know there was progress there? 10k limits? Our concerns were heard. When we have something ready, we'll let you know. Potentially in a blog post? Safari Tech Preview is usually where we give access to a first implementation, but HTTP stack is a system framework. We don't control it ourselves, but the system support needs to be there for WebKit to adopt. Will see what early access looks like.

Johann: Privacy CG session on CHIPS later today.

John: Not sure there's much more to say, but this is a big step. Thanks for the proposal.

Mike: Let's break early for lunch. Yay! Thanks all.
