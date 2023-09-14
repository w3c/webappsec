## Web Application Security WG

TPAC, Day 1: [Wednesday, September 14th: 12:30 UTC](https://www.timeanddate.com/worldclock/fixedtime.html?iso=20230914T1230)

### Attendees  

* Ari Chivukula (Google Chrome)
* Kaustubha Govind (Google Chrome)
* Tim Cappalli (Microsoft Identity)
* Erik Anderson (Microsoft Edge)
* Jonathan Kingston (DuckDuckGo)
* Artur Janc (Google Security)
* Johann Hofmann (Google Chrome)
* Daniel Appelquist (TAG, Invited Expert, Snyk, Guest)
* Daniel Huigens (Proton)
* Bartosz Niemczura (Meta)
* Marek Blachut (HM Government)
* Antonio Sartori (Google Chrome)
* Chris Fredrickson (Google Chrome)
* Jun Kokatsu (Google)
* John Wilander (Apple WebKit)
* Sam Weiler (W3C)
* Chris Thompson (Google Chrome)
* Tom Van Goethem (Google Chrome)
* Jonathan Hao (Google Chrome)
* Paul Zühlcke (Mozilla)
* Joe DeBlasio (Google Chrome)
* Yifan Luo (Google Chrome)
* Dan Veditz (Mozilla)
* Mike Taylor (Google Chrome)
* Frederik Braun (Mozilla)
* Edward Qiu (Meta)
* Camille Lamy (Google Chrome)
* Shivan Sahib (Brave)
* Kyra Seevers (Google Chrome)
* Nick Doty (Center for Democracy & Technology)
* Hadley Beeman (W3C TAG)
* Reilly Grant (Google Chrome)
* _You?_


### Agenda

* 14:40 Secure the Web Forward + TAG	(Daniel Appelquist)
* 14:45 `.well-known` URL for Passkeys (Tim Cappalli)
* 14:50	"Unique" Origins	(Jun Kokatsu)
* 15:15	Private Network Access updates	(Yifan Luo, Jonathan Hao)
* 15:45	5m break
* 15:50	Post-third-party storage model, cross-site cookie semantics	(Johann Hofmann, Dylan Cutler, Artur Janc)
* 16:30	☕ 30m break 🍪	*
* 17:00	Deprecations and new defaults (Camille Lamy)
* 17:35	5m break	*
* 17:40	Request OTR	(Shivan Kaul Sahib)
* 18:00	Web Crypto	
* (~10m)	Secure curves draft publication, more modern algorithms	(Daniel Huigens)
* (~20m)	End-to-end Encryption (Marcos Caceros)

### Minutes 

Mike: Welcome, Agenda

#### [Secure the Web Forward Workshop](https://www.w3.org/2023/03/secure-the-web-forward/)

Daniel: Hello, I'm co-chair of TAG, also work for Snyk, cyber-security. Not representing Snyk. But a lot of work is in open source security, working on things like supply-chain security, open source security. Such as [Scorecard](https://securityscorecards.dev) in the [OpenSSF](https://openssf.org), a tool to assess sec characteristics of software. Other stuff. Big learning experience coming from the web. Reached out to folks to have meeting of the minds, to merge our terminologies and bring people together. Will be virtually at the end of september, 2 sessions, short workshop, 2 papers already accepted. It's a W3C workshop with participation from other orgs (OpenSSF, OpenJS, OWASP). Please take a look and join in.

...: TAG works with this group. Was in the miniapp group, working on adding mechanisms for miniapps to use security primitives. Recommended to reach out to WebAppSec. Should make sense from a web security perspective. We've been working on Privacy Principles doc. Now coming to a place where we need to revise our security / privacy self-check. Originated from a Mike West doc, want to engage this group on making sure it's up to date. Part of our review process, bread and butter work of TAG, reviewing other people's stuff, it's what they use to review themselves so it should make sense.

Tim Cappalli: Does this cover user auth / WebAuthn, etc?

Daniel: It could! Didn't yet get papers but it seems in scope.

#### `.well-known` URL for Passkeys: [explainer](https://github.com/ms-id-standards/MSIdentityStandardsExplainers/blob/main/PasskeyEndpointsWellKnownUrl/explainer.md)

Tim: I presented this on a call before. Very small spec. Idea is to do something similar to change password well-known URL. As web moves towards passkeys, we need same ability to update and manage them. We want to provide an endpoint for creation, as well as management. The use case for this is passkey providers (pw managers), whether OS baked or 3P. They would like the ability to tell users when passkeys are available for a site, with one click take users to page where they can add. Otherwise UX is challenging. Hope this will help conversion, and understand how to delete.

...: Passkeys are the new name for WebAuthn Discoverable Credentials. From a technical standpoint, these creds can now sync between devices. One of the biggest deployment challenges for FIDO2 was having to re-enroll per device. We think passkeys are the first time we have a new default phishing-resistant cred for the web. If we don't do this, each provider will do their own thing.

Mike West: Implementations depend on this already, right?

Tim: Yes, there are some app devs hosting this .well-known file. There's at least one passkey provider querying.

Mike West: Candidate for something we can adopt?

Tim: Absolutely. It's a JSON response with 2 members, enroll, manage. That's it. Thank you.


#### "Unique" Origins: [Explainer](https://github.com/shhnjk/allow-unique-origin)

Jun: `allow-unique-origin` [link to slides goes here](#TODO(jun)). A proposal for `<iframe>` and `CSP: sandbox`. Creates a new scheme with form `sandbox:["{UUID}", "precursor_origin"]`. Helps distinguish the frame in `postMessage()` or CORS (as today these serialize to `null`). Also allows storage for APIs that are usually blocked in opaque origins. Data is temporary since the unique origin is temporary (tied to the UUID).

...: Serving `content-security-policy: sandbox allow-unique-origin allow-scripts` would opt the document into this mode.

...: Why? 3 reasons. 1st is rendering untrusted active content in a secure way. Many services have sandbox domains. Easy example is like you have an email webapp with attachments. If that has scripts, you don't want that to run in your main origin. Most create a sandbox domain to isolate origin from mail email origin. But it's hard. You have to isolate each users attacments. If all attachments are hosted in same sandbox origin, you can steal other users attachments (if you can execute script). If you want Spectre defense, you have to add sandbox domain to PSL. But now you lose cookies. Then you have to use capability URL for authentication. Very complex.

...: allow-unique-origin allows to solve this. Random origin on every load, which isolates the content (each attachment). Because it's cross-site document, it should be process isolated whenever possible. Can also be hosted in main domain, so authentication can happen via cookies.

...: 2nd use case. Many sites use blob URLs for local editing/downloads/image editing. Can result in XSS. ANother proposal, let's add headers to Blob URL where you can add CSP to this blob origin. Also want ability to override CSP of precursor origin, if too strict (w/ `allow-unique-origin`)

...: 3rd use case. Many marketing pages, blogs in CMS in sensitive origins. E.g., Youtube wants to host a marketing page on youtube.com, not some other domain. But this comes with risks, if they want to pull in many JS libraries that may not be secure. We don't want to render in the main origin. XSS risk. If you want to do this today, you have to use opaque origin. But this breaks dependencies, can't use storage, cookies, etc. CORS request has a null origin, as well as postMessage. `allow-unique-origin` solves this by granting access to storage, CORS has an origin. XSS does not have access to origin.

...: Limitations. Phishing is still possible if there's a vuln. It will make it difficult to abuse XSS for other attacks, beyond social engineer. Becuase it's a sandbox keyword, you have to add all the keywords you want. For permission prompt, probably won't display origin info (because it's random).

...: Questions?

Erik: Excited about this. interested in the temporary nature of storage. What's the rationale:

Jun: When we try to use `csp: sandbox`, storage wasn't necessary. Only need it to ensure scripts don't break. It's ok to make it persistent, but then we'd need a persistent origin, which isn't good for `sandbox` generally. Want different origin for each piece of content. Seems better to be temporary.

Erik: Use case. We have paths that support multiple identities at once. Embed scenarios in which they're pulled into third-party. Want to ensure they're distinct, one tied to user A the other to user B.

...: On permission dialog: top-level page may want to control if frames can request access. Might want to make decision at runtime rather than load-time. Could we build something like that?

Jun: This could be combined with permission policy, certainly. No problem with blocking the permission, but wanted to create a sandbox that can do anythign a normal page can do so we don't break dependencies on marketing pages.

Dan: `allow-unique-origin` vs `allow-same-origin`? What happens if people specify both.

Jun: If both are specified, browsers that support `allow-unique-origin` will ignore `allow-same-origin`. Browsers that don't won't sandbox the origin away.

Dan: presumably you'd only use it with `allow-scripts`, and there's no point in using that and `allow-same-origin`. I guess it makes sense if you're willing to fallback to non-sandboxed.

Chris: Interesting proposal! Peristence: I think there's complications between persistence and permissions. Especially because the prompt intentionally wouldn't have identity information, no stable identifier. No great idea off the top of my head how to reconcile this. How do we allow permission management? Page info? User revocation?

Erik: Does existing permission UX show anything other than top-level?

Johann: No. This isn't a problem. We have permissions delegation.

Jun: Permission tied to origin, which is temporary.

Mike: I think the case in which he's discussing is when the top level page puts itself in the sandbox. 

Johann: Top level frame can have unique origin?

Mike: Yes, in this proposal.

Jun: right, in iframe case it's delegated, prompt shows top level.

Johann: Fair point around not showing origin information in any UI. How temporary is temporary? session length? Until tab closes?

Jun: Even if you close the tab, you can reload from cache, BFCache, etc. So, some definition of session. Haven't thought about the detail. But certainly tied to the lifetime of the origin. Want to look at other browsers.

Johann: Can also store data, right? I'd encourage you to look at the UX that this model has. Embedded experience and top-level experience might be significantly different. Might be fine to keep embedded information around for a while in a way it might not be for the top-level. User control, clearing data, etc.

Jun: Need to figure out permissions. Storage too. If you want more persistent data, implement it server side. Have cookies with initial request.

Johann: User might want to clear even in the short term.

Artur: The idea we have here doesn't really need persistent. Just want `document.cookie` not to throw. But the lifetime is until navigation. While it's there, data's there, once it's gone, the data's gone. Back to Erik's comment: interesting use cases for more persistence. Historically, we talked about per-page suborigins a while ago. There was difficulty with the implementation complexity and UX. (https://w3c.github.io/webappsec-suborigins/). Simpler without persistence.

Erik: I wonder whether partitioning simplifies those concerns.

Nick: UX. I don't understand how it would be possible for a user to answer a question about permissions without an origin indicator.

Jun: Same case for the browser. When there's a unique origin, browser doesn't know what the page is, whether it's malicious, etc. Showing origin doesn't help. Product can always deny permission via permission policy. I don't want to restrict it?

Mike: Why?

Jun: We could. It's up for discussion.

Nick: With "this page", what information is the user using to determine whether this page is trustworthy?

Jun: Email provider would serve permissions policy that restricts the ability. But because we don't know the use case, the shape of the proposal doesn't restrict it. SAA, for instance.

Mike: Permissions are a thing. We should talk about them more, later. :)

Daniel: Headers in blobs. Looking at security issues linked: from the perspective of a web developers, I'd expect an untrusted resource in an opaque or unique origin to be "secure". The only issue is a user opening it in a new tab. Is there not a way to fix that in the browser? Retain the origin when you open an image in a new tab?

Jun: High number of page loads for `blob:` at top-level. Seems hard to deprecate. Many examples of opening UGC.

Daniel: Could be distinction between app loading in top origin or user doing the same. If the user loads it in a new tab, I'd expect it to render the same way it did in the iframe.

Jun: `blob:` is hard to secure. If we make it easier, it's more useful.

Mike: You have an issue filed against HTML, discussion should happen there? Do you intend to take the explainer to WICG? 

Jun: I don't know where to put this. 

Mike: We often get feedback from folks that it's hard to comment in personal repos. Taking explainer to WICG might make it easier to discuss.

#### [Private Network Access updates](https://docs.google.com/presentation/d/132ggmgTGSfSELtPDupsLZCk3YJ2bxhS9G5aBrUiHUOw/edit?usp=sharing)

Spec: https://wicg.github.io/private-network-access/
Explainer: https://github.com/WICG/private-network-access/blob/main/explainer.md
Explainer for permission prompts: https://github.com/WICG/private-network-access/blob/main/permission_prompt/explainer.md

Jonathan: [link to slides goes here](https://docs.google.com/presentation/d/132ggmgTGSfSELtPDupsLZCk3YJ2bxhS9G5aBrUiHUOw/edit?usp=sharing). It's a way to restrict access to internal networks. One way is secure context restriction. The other is to send preflights before main request so that the devices and servers can opt-in easily. Next we'll give updates on what are plans on.

Yifan: More background for our permissions prompt ([explainer](https://github.com/WICG/private-network-access/blob/main/permission_prompt/explainer.md)). We want secure context restriction. But in the real world, it's hard or not possible to use TLS on private device. Becuase of that, we came up with permission prompt. It only works for HTTPS sites requesting HTTP private resources. Introduced 2 new headers `Private-Network-Access-Name` and `Private-Network-Access-ID`. Want them to be optional. Possible to use IP Address as a key. On the other side, we need a new fetch option `targetAddressSpace: `...

...: this is a demo of the permission prompt. There's a name and its ID provided. If not, an IP address and the user can say Cancel or Connect. If we only have IP Address, it will show every time. If valid ID, permission is stored.

...: Current plan in Chrome. Start Origin Trial for permission prompt in M120 (Beta Nov 1, stable Dec 5). Ideally in M123, end the OT and start shipping. The permission prompt won't be available for preflight warning mode. If you relax content restrictions and show permission to user. The decision will (won't?) be set in preflight warning mode. Deprecation Trial will be available for nearly a year until M129.

...: Based on dev feedback, we'd like to have permissions policy for delegation. There are some IoT devices that are framed by other sites. We'd like to auto apply `targetAddressSpace` for requests to subresources to IP addresses - might made devs lives easier. Would like to have a per-site / ground setting for permissions. 

Jonathan: Preflight enforcement. We haven't shipped yet. Warning-only mode for now. If preflights haven't responded or failed, we send a devtools warning. The reason we can't ship this yet is due to compat risk. Our metrics show a lot of warnings being generated. To mitigate the risk a bit, we specced and shipped same-origin exemption to potentially trusthworthy origins in M113. Drove warnings down a bit, but not enough. Next plan is to add an option to disable enforcement in user site settings (similar to mixed content). Plan to start working on this by end of year.

...: PNA (Private Network Access) for Workers. Same restrictions, but applying to worker script fetches, and fetches iniated in workers. Specified, and shipped in warning-only mode in Chrome M110. 

...: Since we can't ship it without breaking a lot of the web, we're planning on shipping to parts of the web first. We plan to ship to Android Automotive. Minimal compat risk due to new form factor/platform. Also planning to ship enforcements via enterprise policy in Chrome 119. This way enterprise admins can use this to protect their users. We are not planning to have an Extension API. The main reason is that this might require an associated UI. We think if we build this, we can use this time instead to work on site settings.

...: We also plan to plan private network accesss for navigations: iframe or top-level. The implementation is mostly done for iframe navigations, modulo fixing a bug and landing some metrics. The plan is to ship this with a Deprecation Trial in Chrome M126. And same for top-level navigation around the same time (though work isn't started).

...: Discussions about renaming the spec, especially the mention of "Private". There's a GitHub Issue #91. We realized we don't want to rename the HTTP headers which we send for preflights. There are already early adopters. However, we would consider renaming it again if another browser ships the renamed header.

dveditz: I looked at the spec and explainer and they don't seem to be updated. It wasn't clear from discussion if these are request headers or response headers. 

Yifan: These are response headers. We want the devices to choose for the user a reasonable name, and then user can have a more correct decicsion if they want to allow it or not. For ID, we would like devices to use their MAC addresses.

dveditz: Would they use both or pick one? A name and an ID?

Yifan: They need to have a name and an ID.

Nick Doty: How does the user understand the permission they're being asked? It seems like it's a poor precedent to set for the user to understand which IP addresses are on their network. Even with a good user-understandable name, do they understand the capability?

Yifan: For the first question, how to understand the IP address or name. It's more about a balance how to make people's lives easier in changing the status quo: there are no restrictions and that's dangerous. How to move to a model where we have some restrictions, and users can choose to allow that. For IP address, that's also why we considered making the IP-address-as-key as temporary. If the devices can provide a name and ID, they have part of the responsibility to provide a more user-friendly name. Because that permission is also used to protect the local device itself.

Camille: Working with Jonathan and Yifan. Going the permission route wasn't our first choice, just because we have no other option. We really don't want the HTTP page to access the private network. Want it bundled so that it applies just to one particular endpoint, so that users understand that they just connect to My Smart TV and not to an IP address. 

Nick Doty: I understand that it could be even worse. But it doesn't seem much worse. Asking users more questions that we don't think they can understand... if the goal is to add any friction at all, we should consider any other mechanism. Just a 5 second delay would be friction without blaming the user for clicking yes on a prompt.

Camille: This is not here to add friction. This is because there are sites that might want to legitimatelly access the users private network without HTTPS. We as the user agent don't know that. There are other sites that have no legit reason to do it. So we have to go back to the user and ask them. The alternative is not to blame the user. The alternative is there is no security protection whatever (which is the status quo today). Due to technical constraints we can't always make decisions on behalf of the user. 

Mike: Permission prompts are hard. More discussion would be useful for this prompt in particular. Let's take this dicussion back to the repo.

Erik: Private-Network-Access-ID is static for the entire origin, is that correct? Two different URLs should see same ID for same origin?

Yifan: I don't think so, need to be unique and devices can use MAC addresses.

Erik: the device is hosting a webserver. Any URL it wants to serve should send same ID?

Mike: if they're separate origins, it should get preflights for both.

Erik: on network change, does that trigger a new preflight?

Mike: if there's a shift in the relationship between network and resource, it does. 

Erik: My house, my neighbor's house, same TV same IP?

Mike: As long as the name and ID match, yes, the preflight cache entry would be reused.

Shivan: For permission prompt, earlier this year we rolled out a permission for localhost connections. Based on the reasons that Nick said, we were conservative for this. Now on an allowlist. Today we only allow those websites. We believe it's best to be slow when rolling. Is there any data on which websites are using this permission prompt? I don't think I can get that from existing Chrome metrics.

Yifan: IoT devices cannot upgrade to secure sockets. So they're using HTTP. Because we wanted secure content and to force the public website to update to HTTPS, they end up as mixed content. Not possible for old devices, even hard for new devices.

Shivan: mainly devices/sites that have to do with IoT.

dveditz: Call it "private" because of the private network RFC, if we call it local network enterprise admins get excited because it sounds like it includes named internal machines on their internal network that have non-private addresses. Maybe "personal" network could work? (but then, not quite if you're on a "public" or work wifi network). Naming is hard.

Joe DeBlasio: I appreciate this is all future work. But can you give quick preview on the top level navigation question?

Jonathan: We haven't decided in detail yet, but I think we would try similar restrictions, e.g., if an initiator opens a top-level window to a local network or device, we would want secure context. Also send preflights to device and get opt-in before we allow navigation.

Camille: I think we are mostly going to rely on initiator and comparing what is the IP address space of the initiator with the top-level frame that is being navigated. We are unlikely to run into the same issues for secure context restrictions. The number of HTTP(S?) pages that would like to navigate to private IP address is extremely low. We have focused on subresources because we needed PNA to ship COEP credentialess and COOP (something), decided to do top-level navigation last.

#### Post-third-party storage model, cross-site cookie semantics

[link to slides goes here](#TODO)

Artur: Hi. I'm Artur. Presenting with Dylan and Johann. This is more interesting than you expect: goal is to write a working group NOTE that outlines the desired security and privacy model for cookies post third-party cookie deprecation. Interstingly, we have more agreement on the privacy semantics than the security semantics. Privacy => prevent third-party tracking. Security considerations are fuzzier. Also need to account for compat and other tradeoffs.

...: Looking to sync on the high-level about what security guarantees we want cookies to provide in the long term, and the specific edge cases that are handled differently by browsers today.

...: Cookies are the root of all evil, or half of all evil on the platform. Enable many vulnerabilities. Unfortunate choices around cookie behavior made a long time ago when the web looked differently. Want to align cookies with our privacy and security boundaries. Discussion intensifying now because of work on Chrome and other browsers. Impact of those changes is critical to the web's security model.

...: Want to talk about cookie behaviors by default, but also mechanisms for reenabling them in third-party contexts (SAA, user controls, etc). Would be best if we can align on them cross-browser.

...: Cross-site vulnerabilities. Form submissions, clickable buttons, API endpoints, search functionality enable CSRF, clickjacking, XSSI, XS-Search respectively.

...: These are all bad. They have acronyms. They're fairly well-understood. But other negative consequences that don't immedietely seem like vulnerabilities. Login status detection, targeted deanonymization, login/logout CSRF, hardware-level information leaks. All enabled by requests carrying cookies.

...: We don't want to attach cookies to cross-site requests. But a lot of caveats. Many behaviors today rely on cookies' presence. Very similar security requirements to the privacy requirements to prevent tracking.

...: Before hitting the corner-cases, let's look at existing models:
...: `SameSite=Strict` prevent cookies from being sent in any cross-site scenario, including top-level navigations. Security = great! Compat = bad (if enforced web-wide).
...: `SameSite=Lax` is slightly more permissive, adding the ability to carry cookies on top-level navigations using "safe" methods (GET, etc).
...: "Anti-tracking" cookie blocking: Navigations have cookies, but any request that matches the top-level site will carry cookies.
...: `SameSite=None` no restrictions (assuming third-party cookies aren't disabled).

...: Cross-site behaviors around reading cookies. Browsers sometimes think about writing and reading cookies differently. From a security perspective, reading cookies is all that matters. Setting a cookie isn't a security risk in any scenario. Reading that cookies might be a security issue.

...: Chrome's model is `SameSite=Lax-by-default` with some caveats. `Lax-allowing-unsafe`: cookie can still be attached to a top-level post for some period of time after setting because of some flows. Cookies are reattached to cross-site requests after a same-site redirect. Developers can opt-out of all of this via `SameSite=None`.
...: Safari/Firefox (tell me if oversimplified): "anti-tracking" cookie blocking, otherwise `SameSite=None` for requests matching the top-level.
...: Where do we want to take the cookie model?
...: Default behavior in Chrome today is something like `SameSite=Lax`. In other browsers, it's something like `SameSite=None` with anti-tracking carveouts.
...: Core question: how should `SameSite=None` behave in the future? How much should the platform allow you to relax restrictions on cookie reading?
...: Goal: don't allow too much relaxation. Enable specific scenarios that `SameSite=Lax` doesn't support, but which we know can be done safely.

...: Privacy: we need to enforce restrictions to prevent cross-site tracking. But could `SameSite=None` allow cookies in some cross-site contexts allowed by the privacy model (e.g. within a group of related sites (first party sets, related website set)? or nested A->B->A frames?).
...: Cookies are per-site, not per-endpoint. Don't want it to be too easy to relax restrictions broadly, but could aim to relax restrictions on an endpoint basis.

Dylan: Interesting scenarios. Some use cases on the web today for SameSite=None cookies, and what we think it should look like when we start blocking 3P Cookies by default.

...: "ABA embeds". In this case, we have an embedded frame that is making a same-site request to a top-level document, but comes from 3rd party embed. The risk is that the embed can use SameSite cookies to exploit bugs (clickjacking, xsleaks). But, there is developer utility. Maybe only allow cookies in these cases when storage access has been granted or CORS.

...: Navigating cross-site embed to same-site page. You have cross-site embed that then navigates to new URL that is same-site w/ top-level page. Does not introduce substation risk to xsleaks, however there is a risk that 3Ps could send credentialed navigation request to arbitrary 1P endpoint (but already possible via subresource resquests). Recommendation: should allow cookies in these requests. Perhaps block them in embedded frame navigations.

...: top-level cross-site POST requests. Risk that this could allow for CSRF bugs. But this pattern is widely used in 3D-Secure. Given widespread usage and lack of altneratives, we propose to allow for now and come up with new APIs in future.

...: Next question: should we block cookies that come from same-site request that were originally cross-site requests, then redirected to same-site URLs. Safari recently introduced mode to block these kinds of cookies. Recommendation: continue blocking cookies here.

...: As a recap... for same-site iframe with cross-site ancestors: No cookies w/o storage access
...: navigating cross-site iframe to same-site URL: yes for GET, no for POST.
...: top-level cross-site POST: Yes, for compat. Want to lock down later.
...: Redirecting cross-site resources to same-site desination: no.
...: We should assume that in the future, sites will relax cross-site defenses.

Johann: The other stuff we touched on in the April call. Based on new feedback, we decided that we want to produce a WG Note to give more general guidance. Important part is to give guidance to mechanisms that want to restore cookie access. When we look at those mechanisms, make sure we're not undermining protections. If we switch to SameSite=Lax-by-default, this only happens to SameSite=None. But we shouldn't rely on SameSite=None - it's not enough.

...: As part of our WG Note, want to detail which behaviors are best practice from security POV, and what shouldn't be done. As a preview we wanted to show some things that are good, concerning, and bad. 

...: Good. Things we think are acceptable include storageAccess API (after we added security changes), CHIPS, granular browser policies.

...: Concerning: Heuristics. The only friction for an attacker is to spawn a pop-up then redirect.

...: Bad. Page-wide user overrides. Any arbitrary page stops blocking cookies. No-click heuristics that don't require user-interactions. And things like global opt-outs. Disabling all the security.

...: Summary. We're quite happy with the direction for the Web Platform. We're able to address a lot of cross-site vulns and xsleaks that have been around for a long time. We think there are a couple of small changes needed to really get browsers to a good, secure point. Specifically we want everyone to default to SameSite=Lax, keeping in mind we're doing small compat relaxations for now. We want to make sure that when developers opt in to SameSite=None, for a compatibility POV, that it's OK from a security standpoint. And we want to develop guidelines that developers can use in the future. We would appreciate feedback on the Note that we'll write.

Dan: Just wanted to say that we tried to ship Lax-by-default, and we're not able to do it. Both due to our own bugs, and found that the spec and Chrome don't agree (related to redirects). In a lot of cases, when Chrome introduced these changes developers would do "if (Chromium){}"... not a lot of sites, but it would be banks. Very concentrated pockets of unhappy people. Not sure we can convince management to let us ship this again. That makes us sad, but it's reality for now.

Johann: We've been in touch with Freddy... that's not great. Also part of a misunderstanding of what Chrome was shipping. I agree this is something we need to resolve. We're happy to follow up on that. The good thing is that some of these things we can resolve in parallel. Not everything is gated on SameSite=Lax-by-default. We can solve some of these Storage Access issues. Hopefully one day we can all ship regular SameSite=Lax-by-default. 

Dan: I'm equally unhappy with some of our own heuristics. They're done by necessity to not break sites but it makes it very mysterious to know if things are protected or not protected. I hope that we can take another run at it, but I'm not sure we can have a more robust set of tests to verify we all have the same behavior.

Artur: the set of behaviors that Chrome has been shipping for a few years... I would hope that if this is shipping and hasn't reverted, it should be OK for Firefox to ship that, were you to ship the same relaxation. It shouldn't result in major breaking. From my perspective this is a reasonable compromise. Maybe that is something to explore.

John: I don't think we've even tried SameSite=Lax-by-default. If people are checking for Chrome, it's going to take a lot of time and effort to get to not do that. My original question is related to First Party Sets (now Related Web Sites). I think that is going to be the hardest thing here. Chrome and other Chromium browsers will use these lists, and other browsers won't. That is something that we should focus on. We've said if that dataset becomes trustworthy, can we have a different wording in prompts, and still gives us privacy guarantees we want maybe we can use it.

Johann: If it would make you happy, we can remove Related Web Sites from the slide. It's not really related to common security goals. If you have feedback on how to make Related Web Sites more trustworthy or usable to you, we're happy to hear it.

John: Generally I loved this presentation. Related Web Sites is going to be the hardest part.

#### Deprecations and new defaults

[Slides](https://docs.google.com/presentation/d/1wvK7b0H7Lu5JlUucamdOF2ATiA1BUi9K76cZsY-jH64/edit?usp=sharing)


Camille: Work we're doing in Chrome to remove some unfortunate behaviors from the platform, shifting from an opt-out to an opt-in model for things we think are dangerous.

...: `Origin-Agent-Cluster` by default. If you don't send an OAC header, we're defaulting it to true, which means that `document.domain` doesn't work anymore, and gives the browser the opportunity to isolate you by origin rather than by site. Shifting to origin isolation when we have enough memory for the extra processes reduces the impact of Spectre, etc. Enabled at 50% in stable, aiming for 100% next week. Hoping for this to become default across browsers.

...: Private Network Access: already talked about it earlier today.

...: Opaque response blocking: specifically helps with attacks like Spectre, blocking resources from entering a process if we know that it shouldn't be readable by the origin. Chrome shipped CORB years ago, ORB is stricter; we're working on a transition towards that model. Missing piece is distinguishing between JavaScript and other resource types. Spec calls for full parsing of JS file: we're worried about perf impact. Experimenting with a simpler distinguisher which doesn't require full parsing. Firefox is also aiming to ship ORB. Need to make sure they match, and that we solidify the spec now that more browsers are shipping.

...: What's next?

...: `SecureContext=Injection`. Impact of XSS vulnerabilities are getting worse. XSS gives access to authenticated user data, pretty bad. But it also gives access to all permission-gated APIs the page has access to. If your page has camera access, your attackers have camera access. The core of permissions' security model is a choice on behalf of an origin, user makes trust decision about that origin. This works, up until XSS, at which point your attacker has access to. Any new permission-granted capability we add to the platform expands the risk of XSS.

...: We have good defenses against XSS: CSP. Google has seen vulnerabilities go way down through deployment. Solvable problem.

...: We have `[SecureContext]` right now. This tells you that you requested resources over an encrypted connection. Very far from "your application is secure". We think we can expand the concept to set a minimum bar you need to meet to be considered "secure against XSS", and to require this protection for requesting capabilities we add in the future. Challenge is deployability. Folks have told us that strict CSP is hard to deploy. And cross-origin isolation is hard to deploy. Unfortunate for developers.

...: Hardest thing is dependency upon third-parties. Artur Janc had this idea around introducing hashes for URLs and inline scripts earlier this year. That seems good enough for injection mitigation. Could also make this easier through devtools. This means you don't have to depend upon a third-party to do work to make their scripts CSP compliant.

...: Is this a good idea?

Nick: This is a very important problem to address, I think it does make the permission model risky for the website. I might want to ask the user for some capability, but I don't want to have some bug in the future that enables abuse. I wonder if a short-term effect could be to limit persistence if this protection isn't available? That is, if a website doesn't have injection mitigation, it can't have the permission forever, but could still use it on a temporary basis.

Camille: Good idea to explore. Planned to focus on new APIs, where there's no compatibility risk. Focus on really sensitive permissions, camera/microphone, etc. But persistence is interesting to consider.

Artur: Interesting carrot. Apply these protections, you get persistence. Don't, you don't. On the other hand, downside to users: permission fatigue. Abusive websites could leverage that to get more clicks on dialogs.

Camille: We should talk with our permissions team.

Artur: I obviously like the idea, moves the platform in a similar direction. John said something similar years ago. Boundary for permissions is the origin, CSP is document-scoped. Would need to match the 

Mike: If we follow the model of `SecureContext`, we wouldn't expose the API in contexts in which the injection mitigation wasn't good enough.

Artur: But injection on unprotected pages could open the protected page in a new window or frame and use the capability that way.

Mike: frame would be block by delegation. Opening a new window would be a problem, you're right.

Dan: In the TAG we very often finding ourselves leaving feedback on new specifications to the effect of "this will increase developer complexity, is this worth it?". It's clear that CSP is very difficult to use. Normal developers aren't using it, but your data shows that it does make a difference. Anything that helps developers adopt would be very good. Is there anything else that would simplify deployment of CSP would be better for security on the web.

Camille: One thing we've discussed it to have a [scripting policy](https://wicg.github.io/csp-next/scripting-policy.html) as its own bespoke policy. This is an easier way to deploy CSP. Our hope there is that it's a lot less complex. There are fewer options. Clearer for us to show developers how to do this, and harder to shoot yourself in the foot. Some people might go w/ allowlist approach - we've found this is hard and not necessarily the best approach. CSP documentation is very hard, which doesn't help. Such a policy could also enable `SecureContext=Injection` which Mike described.

*Dan: additional thought on this - it would be great to see some additional tutorial material on CSP in https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP*

John: I believe Artur was referring to ["Single Trust"](https://lists.w3.org/Archives/Public/public-webappsec/2017Mar/0034.html). Would be great if high-value pages were single trust: login pages, etc. Would love to evolve secure context beyond transport security. Strict CSP could be included, subresource integrity, etc.

Bartosz: I agree the scope has expanded. But permissions policy can help here. Some applications ought to disable access to things they have access to by sending policy along with their pages. Perhaps we could strengthen the defaults for those policies.

Camille: The issue is compatibility. I agree that it would be ideal to change the defaults of permission policy, and change the defaults, but risk breaking existing sites.

Jun: Tomorrow, I'm talking about that (during the permissions block at 17:00ish). This is different, though: permission policy doesn't mitigate XSS. Would prefer that restriction.

Camille: Another default we want to change is `COOP: restrict-properties`. Restricts your access to a popup to `postMessage()` and `close()`. Interested in this because with upcoming deprecation of third-party cookies in Chrome, we're interested in hardening the opener relationship, which should let us deploy cross-origin isolation more broadly. Again, probably have an opt-out: `COOP: unsafe-none`, but changing the default is powerful.

Artur: I'm excited about `COOP: RP`. More cross-browser compatibility is essential, as that allows developers to rely on these mechanisms. It would be great if browsers that weren't Chrome would work on `restrict-properties`.

Camille: We'll talk about the API in more detail tomorrow. Let's punt to then.

Bartosz: We haven't been able to enable COOP everywhere, COOP:RP will help.


#### [Request OTR](https://datatracker.ietf.org/doc/draft-sahib-httpbis-off-the-record/)

[link to slides goes here](#TODO)

Shivan: This is something that Brave has shipped. I've been talking to various standards orgs about this work. Spoke at previous WebAppSec meeting as well. 

...: Overview. The threat model is that the attacker is a local "UI-bound adversary". This means the attacker has access to the victim's device. Browser, browser history, cookies, caches. But we're not considering the case where they sniff the network or install malware. The attacker wants to idenfiy if the victim has been to a sensitive site, the victim wants to hide evidence. The website determins itself if it's sensitive. The UA could also have a list of sensitive websites, which is what Brave does.

...: Motivating use cases: intimate partner violence. Browsers are major attack victor. Victim is trying to find help. But also there are "hand over your phone" checks where you may not have advance warning.

...: The protocol is simple. HTTP Request header `Request-OTR: ?1`. In Brave, you see an interstitial if you'd like to visit the site in Off the Record mode. A banner up top in the UI as well when visiting.

...: Current approaches all have shortcomings. Private browsing overhides. Leaves gaps in history. Easy to forget to start or end. A lot of domestic sites have a "quick exit" button. The issue with this, as well as browsing history editing controls is you're not getting all the data. `Clear-Site-Data` has an issue that Mike pointed out. But you shouldn't rely on a site's implementation to be protected. When you start an Off the Record browsing session, your storage is ephemeral. But this can't be done retroactively. We want protection the first moment you visit a website.

...: Limitation. The user often goes to a search engine, then clicks on a website. We don't have a great way to solve this issue - search history is still associated with search engine. For an attacker who can download malware, they can also use this feature for malicious purposes. 

...: Shipping in Brave. We're working with researchers to evaluate the effectiveness. We'd like to standardize this to encourage servers to start using this. We presented at HTTPWG and had some interest. The definition is very simple, it's more complicated to describe the semantics in the browser, which would make WEbAppSec a better fit. Interesting in seeing if there's interest.

Nick: I support the work on the use case. It's an important use case, and a real opportunity. It seems like it's defined as a site-wide thing. As an example, my college's website has a section to report abuse. They're not going to turn this on to help me check my course website. Makes sense to scope? 2) A malicious website will use this to cover their tracks. I don't think that should stop the work. But we should propose some specific mitigations in the spec itself and try to get some implementation experience. Consent? Allow-list? We should try to document those.

Dan A: *+1 to Nick's voicing of support*

Shivan: For the specific page or path, agree. We would like to talk with sites who are interested in this feature for the full-site that is sensitive. But we should think about that. And we should document.

Ari: (1) Naming question. I understand this is a server requested version of private browsing / incognito. I know this is not about whether the website itself is storing information or not (just an instruction for the user agent), but I could imagine a proposal for an OTR request header that did exactly this. The naming is also a little confusing given this is an HTTP Response header (not HTTP Request header) that is called Request-OTR. (2) Should the browser's claimed respect of this header be communicated back to the server so it can inform the user? Obviously a user agent could lie or spoof, but there's probably some value there.

Shivan: We haven't considered the confusion on the name, but it's a good point.

Ari: the alternative (to communicating back to the server) is just UA sniffing.

Nick: currently the draft spec says the opposite - the UA should not reveal to the site. 

Shivan: typically we try not to leak private browsing mode to a server, this seems more private. Let me think about it.

Ari: if the website asks for OTR, the browser will specifically indicate that it's supporting it.

Shivan: Let me follow up, it seems to make sense. The server could choose to do something else or not depending on if they believe the user is protected.

Nick: I think that would exacerbate the malicious website problem. The website can make sure that the user agreed to clear site data, Then it can be sure that downloading my malware isn't recorded in navigation history.

Ari: I see.

Shivan: You can always just lie or spoof that. I need to think more. Good points that it could make it worse, Nick.

Jonathan: it's an interesting proposal, important use case. There's a :visited link proposal that Artur and Kyra are working on. Maybe that solves the search engine problem. Potentially the OTR record could be used to clear the :visited state of the previous site. We should think about other leaks like referer.

Shivan: Let me take a look at their proposal. For referer, we have pretty strong mitigations in Brave.

Mike: it seems like referer is outside the scope of this proposal, given that the scope is local information.

Erik: Any thoughts on the overlap with the "Unique" Origins proposal? Maybe separate given the privacy leaks that don't apply.

Shivan: I'll have to go back and look at that, I missed it.

Tom: I find it very interesting proposal. Regarding limitation, often users don't typically navigate directly to a website but use a search engine. Do you think it might make sense to ask the user to do additional actions rather than just opening the page in private browsing mode? Would it make sense to ask the user to clear browsing data for the past session or couple of minutes?

Shivan: asking users to manually clear? Not automatically?

Tom: I think the browser can see this OTR header, that some sensitive action being performed by user. Using that they might suggest additional actions.

Shivan: I'm wary of doing that automatically. But it may make sense to prompt a user. 

Camille: We've done a bunch of work with credentialess mode, or ephemeral storage. I wonder if this is a model that could apply here. We could have some thing where a site can get ephemeral partitions by adding a nonce to StorageKey.

Shivan: Yeah, that's how we've implemented it. We're using that work. I'm not sure about the W3C work in this space - it probably makes sense to cite it. If people have concrete text to point to, that would be appreciated.

Dan: As presented, this is a per-page header. This fits in nicely with the question about a college site that is mostly public w/ a report abuse page. For us, it would be more efficient to switch to private browsing mode since we already have that. But that implies applying to future navigations on the same site. Has there been thought around that? If the site sends cookies, but they're not there later?

Dan: the way it's specced is you're on an OTR page, what happens on next page without the OTR header? Maybe it should be treated as a toggle while you're on the site. That's valid, but not clear in the spec.

Shivan: We've implemented this as per-origin. Then you get an interstitial that you're leaving OTR mode.

Dan: on the same site?

Shivan: If it's set on the origin, and you're on a different page without the header - the mode doesn't change.

Dan: A site can't send `Request-OTR: ?0` to get out of this mode? Something to think about; there are trade-offs. From the header it sounds like a page-by-page choice. If it doesn't work that way, should it?

Shivan: if we move to an implentation where it's per-page, it's more clear that the same website might want to remove the user from OTR mode.

Dan: From a productive laziness POV, I would love if it was a toggle to put someone in private browsing mode. That's easy for us to implement. 

Nick: Switching to private browsing mode might protect you from accidentally revealing sensitive packets on the next hop.

Shivan: If you get a Request-OTR header, now you spin up a Private Browsing window there's a risk of a user forgetting to close that session. But we do get implmementation simplicity that way.

Dan: In Firefox, we implement private browsing mode as a window. 

Ari: I like the 'easy fast exit' button you suggested in the slides, might be worth adding other mitigations, e.g. something to fill a potential hole in browsing for that session. You might also want an 'if my phone is locked auto exit and clear' feature like the thing Safari added in v17 that auto-locks private browsing when the phone is locked.

Shivan: that's an interesting idea. Can you clarify question?

Ari: I thought if you were in OTR mode, there is a banner to easy exit. If the phone or device was locked, you could close out the session.

Shivan: That's a good idea, we haven't thought much about desktop vs mobile.

Mike: It sounds as if you're interested in getting this group to adopt the specification?

Shivan: It seems like WebAppSec is a better place for it. Brave would prefer here.

Mike: In that case, it's probably reasonable given the implementation and sites adopting, Dan and I can send out a Call for Consensus and we can discuss adding it to the charter conversation tomorrow. 

#### Web Crypto

Daniel: Status update. Secure curves draft in WICG. Specifies 25519 and 448. Implemented in a few places behind flags. Spec is close to ready. Minor outstanding questions, nothing very big. Should we think about adding 25519 into the main webcrypto spec? Or leave it in incubation to see if folks would implement 448 as well? Can't speak for Mozilla, but was requested from them.

Dan: Feedback I've gotten from our crypto team is that we're interested in 25519, but do not have an implementation for 448 in our tree, and don't know whether it would be useful to add. If that's added, we'll need some examples of use cases, where it's being used, or sell our crypto team on it.

Daniel: Fair enough! One argument for it is that it's a higher-security curve. Not super-widely used yet. Is in the TLS spec, though there it's also not implemented. In the new OpenPGP spec. Other places as well. But yes, it's not widely used yet.

Dan: references in the explainer would help.

Daniel: Should we leave the WICG draft for 448 only and move 25519 into main web crypto spec?

Dan: that would get support from Mozilla.

Mike West: Similar with Google. 448 isn't in BoringSSL, need to convince them for it to be implementable in Chromium.

Daniel: Additional algorithms. On the symmetric side: AES-CGM. Has some limitations around message size, and is generally not the nicest choice if you want a new AAD mode. Questions on the GitHub repo to add ChaCha-Poly and AES-OCB(?). Also a CFRG recommendation. For password-based key derivation: PBKDF2 is all we have, it's the worst one. Could add Argon2 (winner of password hashing competition some years back, also specified by IETF). Use case for this is webapps that want to encrypt data with key derived from a password can use this function. For webapps that choose their crypto algorithms based on what's in webcrypto, it's unfortunate that some apps use bad algorithms just because they're the fastest algorithms available. Can we add more modern alternatives? Could make another draft in the WICG with more secure algorithms.

Mike West: I am certainly supportive of exploring additional algorithms. Generally speaking, we want to have 1 place where crypto is impelmented in the Chromium project. If it gets into BoringSSL, it's fairly simple. If it's not, it's fairly hard to put it somewhere else. I don't actually know what the BoringSSL folks think, but we should find out. Sketching out a graph makes sense, but doing a lot of work doesn't yet without talking to the responsible folks. I heard from the group, shift to 25519 in the draft and we should be able to support that.

(dveditz: same from Mozilla -- all crypto lives in NSS)

Daniel: One other small thing: streaming. Requested often by web developers. All webcrypto algorithms take an ArrayBuffer all at once. Problem for hashing large files, etc. There's a draft in the WinterCG: streaming in webcrypto. Implemented by cloudflare in their server side runtime. Aren't working on the draft for now. Also makes sense in the WICG, want it in browsers.

Mike: Streaming should be less controversial. There are some things to work out. Conceptually it sounds good. If WinterCG isn't working on that draft and you would like to, shift it over to WICG.

#### End-to-End Encryption

[link to slides goes here](#TODO)

Marcos: This is very high level. Ideas of how we could do end to end encrypted email. Goals and requirements. Everyone loves email. It just happens that on the web we can't do the encrypted part. 

...: Goal and Requirements. We need remote key acquisition to get certificates from somewhere. There's key storage. There's the cryptographic operations to read, sign, so-on. Then the complex part of encoding and decoding messages. Email being ancient, the various formats are complicated.

...: Remote Key Acquisition. We need a means to request key usage from JS. Never want to expose key content to the web. We have primitives to do this already, as part of Web Crypto (non-exportable CryptoKeys). We will need to get consent to use these keys, they could have legal implications. We have cross-device sync - how do we achieve this?

...: Secure Key Storage. We don't have a secure way to store keys. We need some means for users to control usage of keys - per-origin. A concept of lifetimes as well. In many ways this looks like a "managed credential". If we could store these things, there might be other applications beyond email. For us at least, is email for now. But if we can solve for email it might be possible to do other things.

...: Crypto Operations. Signing, digest, encrpyt, decrypt and authentication for encrypted parts of email.

...: Encoding/Decoding problem. All of the legacy code brings a challenge. Should the OS or browser roll our own? This should work with OpenPGP too. Maybe WebCrypto is sufficient here. We may need a new API, we're not sure. 

...: Let's standardize something? It would be fun. Questions?

Mike: What is the threat model? What does e2ee mean in this context? One meaning would include things like the email is encrypted, when it's sent from someone to me it's encrypted entirely. Me to Apple's server is encrypted, and not stored on the client in a way that's extractable.

Marcos: We don't want the server to be able to read/see it.

Mike: I write text, it's encrypted locally, send to you, decrypted locally.

Dan: I will note that ProtonMail does this. What are they doing?

Marcos: OpenPGP.

Daniel: We use OpenPGP (I work on ProtonMail). We maintain an openpgp.js library that uses Web Crypto when possible. Doesn't have all the algorithms that Open PGP has, but use when possible. keys are generated in the client but accessible to the web application. They are stored/encrypted with a key derived from users password on our servers. This is slightly different from what Marcos is trying to achieve, where webapp doesn't have access to key at all. Devil's advocate: if you have the emails, you have the emails. If webapp is trusted today, but compromised tomorrow there might be some advantage. More generally one thing that's missing from the security model of the web is how to trust JavaScript.

Dan: Thank you.

Mike: I'd also point to Emily Stark's https://emilymstark.com/2023/09/09/e2ee-on-the-web-isolating-plaintext.html. Talking about challenges, suggesting that another portion that is critical is the application itself. Having some understanding of what an application can do. It's not clear to me how non-extractability of keys is. Given that you don't need to extract to get email messages. Also Camille spoke about increasing the risk of XSS. In cases where you want to make guarantees to users, you want to make techincal boundaries. Where you want to make sure email isn't being exfiltrated... I don't know, some kind of packaging. Figuring out what code should be executing and shouldn't is important.

Marcos: Part of the challenge is understanding the limitations in the platform and figure out if we can get there with the assurances we want.

Bartosz: I wonder about going a step further, putting some guarantees around client with respect of extensions. If an extension can access the key, they'd easily compromise e2ee application. I wonder if that should be more scrutinized and we should be putting more restrictions what they could do. 

Mike: I suspect news sites would be interested in encrypted news. Dealing with extensions is hard. Goes outside the set of threats that this group is well-equipped to solve.

Daniel: One small point, I think it might be difficult in the email context like you have features where you have plaintext in a reply as a quote. So the webapp needs to be very integrated - it needs to have lots of access. Making sure we can trust the code.

Nick: It's interesting to explore. What are the gaps that are preventing a web app using WebCrypto from implementing MLS, in order to engage in e2ee interoperable instant messaging (like with WhatsApp or iMessage). should that be an area to explore? 

Marcos: It would be cool to explore in parallel, I don't think anyone would be opposed to that.

*Daniel: ack, I would also be interested in hearing if there are algorithms missing in WebCrypto that are needed to facilitate MLS as well*

Reilly: Point at https://blog.cloudflare.com/cloudflare-verifies-code-whatsapp-web-serves-users/. Extensions can be both friend or foe.

Erik: the extension risks make the non-exportability more important. Would be valuable if the site was exploited. Might not have to reset your key to get back into a good (better?) state.

Marcos: We do have a more low-level proposal with API proposals.

Mike: There is interest. Would suggest when you have a draft, this group would be a great place to present it.

Marcos: I'm happy to share the draft that we have, come speak to me and if there's enough interest we will publish it in the WebKit explainer space.
