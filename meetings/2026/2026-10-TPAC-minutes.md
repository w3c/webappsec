# WebAppSec @ TPAC 2026

## Day 1 - 2026-10-26

**Agenda**: https://github.com/w3c/webappsec/blob/main/meetings/2026/2026-10-TPAC-agenda.md

Zoom link: https://w3c.zoom.us/j/7907688363?pwd=ht9UJXZucyzNczCN29aKNeXEYG46ab.1 

### Attendees

* Mike West (Google)
* Tom Schuster (Mozilla)
* Daniel Veditz (Mozilla)
* Frederik Braun (Mozilla)
* Anne van Kesteren (Apple)
* Tom Van Goethem (Google)
* Erik Anderson (Microsoft)
* Daniel Huigens (Proton)
* Ricky Mondello (Apple)
* Artur Janc (Google)
* Mike Taylor (Google)
* Andrew Williams (Google)
* Ari Chivukula (Google)
* Arnar Birgisson (Google)
* Martin Thomson (Mozilla)
* Antonio Sartori (Google)
* Camille Lamy (Google)
* Simon Friedberger (Mozilla)
* Benjamin VanderSloot (Mozilla)
* Yi Gu (Google)
* Sunil Mayya (Mozilla)
* Lucas Santos (Google)
* Takashi Nakayama (Google)
* Anna Weine (Mozilla)
* Balazs Engedy (Google)
* Pascoe (Apple)
* Brandon Maslen (Microsoft)
* Ari Chivukula (Google)


### Minutes

mkwst: (...agenda overview...) There's a little slack in the schedule if we need to shift things around. 

#### Document Isolation Policy (annevk, camillelamy, arturjanc)

annevk: Upstreaming this proposal? And while implementing, I noticed issues with the spec that I raised. Built new tests as well.

Camille: Looked at the tests; been a but busy, but will look into it more deeply. I generally agree with the concerns. With the spec, my plan is to put up a spec PR against HTML based on the monkey-patch spec. Will pay attention to the questions around workers. I think we might have done a few changes in Chrome's implementation. Speaking of which, some of those changes might make sense to port to COEP. Gist of the issue: dedicated workers. We look at the header returned for the script to determine COEP status. If you had a document with COEP, then when you created dedicated workers, if the dedicated workers didn't have a COEP header, we'd block them. I don't think this is ideal. With Document Isolation Policy (DIP), we inherit the DIP of the creator for dedicated workers. That seems to make more sense and is more usable.

annevk: For that issue: COEP has it that way because workers were seen as navigations, treated similarly. So workers required it. But there are other things we inherit into workers, which is weird, especially for shared workers. Race situation. But since we're already doing it for some things, it might not be too bad. It does create some questions around where reports are going: do you still need to respect the reporting endpoints header delivered with the worker?

Camille: With DIP: we ignore the header for a dedicated worker...

annevk: What about the reporting endpoints header?

Camille: For DIP violations, we use the parent's reporting endpoint.

annevk: That's what I prototyped, but it doesn't match the spec. Going through the regular reporting API infra means that you'd look at the worker's endpoint.

Camille: Then we need to change the spec. Shared workers, on the other hand, just don't work. But no one's complained about it yet. We have options if we'd like to change it.

annevk: For shared and service workers, we might not need DIP, can only implement COEP.

Camille: Yup.

annevk: `cross-origin-isolated` permission. Is that required for documents that opt-into DIP? Spec suggests yes, that's what I implemented.

Camille: No. I think I wrote in the spec that wasn't the case. I'll double-check. In practice, no, we don't want DIP to be controlled by the permission policy. That was a significant impedement to deployment in subframe widgets, core use case. If we're relying on site-isolation, there's no good reason to control via embedders' permission policy.

annevk: Can you end up in situations where the top-level is COEP, then embeds DIP, which then embeds COEP... I guess the innermost still requires delegation?

Camille: Yes. That can happen. The one in the middle would also require COEP, otherwise the nested frame wouldn't be isolated.

annevk: I guess that's reasonable. Seems weird.

Camille: It is weird, but that seems like the least-bad option, so that's what we choose.

mkwst: related question: to what extent is COEP going to be relevant in a Document Isolation Policy world? DIP seems simpler for developers and has the properties we need. Not that we should throw away COEP, but I'm not too worried about conceptual conflicts between the old and new approaches if we want developers to focus on the new (DIP) approach.

annevk: I think it would need to be more concrete.

mkwst: I agree the conflict is weird, but it's OK in the end. More of a transitional problem.

annevk: Reasonable to decide conflict based on what aligns with our current interest.

Camille: If we have DIP everywhere, I'd tell developers to only use that. COEP has interesting properties for xsleaks, but DIP is much simpler.

mkwst: Thank you. For the speaker queue, log into zoom and use the hand-raising feature there. But also, physically raise your hand and I will try to mediate. 

aaj: The relationship between COEP and DIP. Inetresting question: what is the migration path of COEP. If we don't need it and there's a better thing. How to replace COEP w/ DIP? Should we think through. Not trivial if it has any actual use.

annevk: We need COEP for shared and service workers.

mkwst: I think that's right. I'm thinking about this from document context where you have nested change. DIP breaks that intentionally. We want opportunities for frames to protect themselves in ways COEP doesn't allow. Seems reasonable for developers. Pushing them towards the thing that protects them in ways they care about seems good. Agree that we can't simply from COEP. We don't have alternatives for everything. ServiceWorker is confusing. Shared Worker is special. We have discussions later today on other topics like Permissions Policy. Figuring out how those contexts work in a shared space is not trivial. For that context, we still need COEP... but I'd like to have a clear story for developers on a thing that is easier to deploy. It might be the case that we cause more confusion. Let's keep talking. Takeaway: good to come up with a recommendation doc that discusses the right path forward for isolating contexts given the breadth of options that are available. 

#### CSP: [Sandbox directives in Web Workers (#279)](https://github.com/w3c/webappsec-csp/issues/279) (@azaika, @yoshisatoyanagisawa, @hiroshige-g)

Takashi: Long-standing issue from 2020: when I proposed this talk, I though it was a bigger problem, but it turns out to be more minor than I'd expected. Scenario I'd like to discuss is spawning workers with `CSP: sandbox allow-scripts` directive in the worker's response headers. There's some divergence in the spec and implementations. CSP3 declares that the browser should provide a network error if `sandbox` is declared. But Chromium generates an opaque origin for the worker, while WebKit and Gecko ignore the `sandbox` directive for worker scripts. There are some use cases that can be affected: some services try to execute untrusted script within their same-origin worker. They have to create blob workers inside a sandboxed iframe to make this work, given browser support. Conflict between spec and implementation. When allowing dedicated workers to be created with the `sandbox` directive, there's a concern we recently fixed in Chromium: inheritance of active service worker from the creating document, but if sandboxed, it shouldn't be controlled by the service worker. Chromium addressed this. We propose two spec changes: 1. in CSP, we should accept dedicated workers, and deal with opaque workers in HTML. Extending `data:` URL support to include other sources of opaque origins. 2. In HTML, adjust "run a worker" to apply sandboxing flags and clear the active service worker if necessary. Thoughts? Other information to drop, beyond service workers?

annevk: Generally, this looks good. One problem is an existing issue with `data:` Workers. They create an opaque origin, but not an agent cluster. We should account for that somehow. Documents and the worker can have shared memory in the current implementation, which shouldn't be possible. Already happens with `data:`, so not a problem with this proposal, but an underlying issue. Breaks expectation of isolation. That will require some more novel spec changes that are more tricky.

Takashi: Got it. Same problem as `data:` here.

MT: New agent cluster (and therefore new process)? Unique per sandbox?

annevk: Each gets its own agent cluster. But any `data:` worker could also create a same-origin opaque orign. this is complicated.

mkwst: New agent cluster does not necessarily imply "new process", implementations might combine multiple opaque origins into the same process.

dom: Not web-observable?

annevk: Yes, it would be. postmessage a SAB.

MT: If conceptual boundary exists, we throw (even if same process).

mkwst: Yes. Web-facing behavior is correct, might not be the case for the underlying implementation because of constraints. TL;DR: new agent cluster seems correct.

Takashi: Allowing the creation of workers is not what developers expect for the `sandbox` directive. Should we start emitting a network error? Or should we move towards allowing opaque workers, building a basis for agent clusters?

annevk: Don't need to fix all spec issues at once, but we do need tests for the agent cluster boundary being in place.

mkwst: Yes. ...

Takashi: Shared worker with sandbox directive? Is this useful? Perhaps we can punt on that by banning opaque shared workers.

mkwst: ...

dveditz: What does Chromium do for sandbox shared workers?

Takashi: Not clearly designed in Chromium. It just sets the origin to `null` and doesn't touch anything else.

dveditz: Two pages create a shared worker with an opaque worker: is it shared?

Takashi: Need to look into it.

dveditz: Blocking it sounds good, but not sure about breakage, given current behavior which seems to allow sharing.

Takashi: Will look into metrics on usage. In Chromium, it's not implemented in an idealistic way. I'm happy to fix it. If a service depends on Chromium's behavior, it wouldn't be the right dependency, but will double-check.

dveditz: Since Gecko and WebKit are ignoring it, that might have implications for developer expectations, even if the current behavior is accidental.

annevk: Moving towards blocking would be nicer.

dveditz: I agree. Shared opaque things seem like a problem.

annevk: Spec requires same-origin check for connection, shouldn't work.

dveditz: Implementation might check based on URL. That might happen in Gecko/WebKit by accident.

annevk: Opaque service worker: no cache? No point.

mkwst: Sounds like a clear path forward: look into our implementation and metrics about usage, then put up spec PRs.
    
annevk: Active service worker: there have been requests to sandbox an iframe, but still have requests routed through their service worker in some fashion. Sandboxed iframe, but offline usage.

MT: Service worker as client-side intermediary. If the `sandbox` attribute came from the service worker, that seems valid.

dveditz: Relative loads in the sandbox are relative to the URL, not the origin.

mkwst: What do we do for documents?

annevk: We skip it for documents. We should skip it here, just thinking about possible opt-ins for this going forward.

yoshisato: Some use cases for sandboxed shared workers? WebKit/Gecko ignoring the header. Environment uses the opaque origin. I fail to understand the use cases.

mkwst: ...

dveditz: Right. For instance, 

annevk: We support `data:` shared workers. We do the accounting to determine whether the creator can connect to it. So we could in theory support CSP for shared workers. So maybe it's fine in that case.

dveditz: Sandboxed workers should work like `data:` workers.

annevk: Note, for Service Workers, there's no such thing.

mkwst: I'm interested in... it feels like we have clear options for Dedicated Workers. Shared Workers could go in the direction of "we don't support this", or the current state "we support connections from your creator..."

annevk: No, you can join data workers as long as they're same origin. A thing that doesn't work if you have top-level A, and B w/ nested A, those As can't connect. 

mt: not complicated at all.

mkwst: Useful to summarize current state. Pull that out into separate discussion of what we want the state to be.

takashi: I will collect some data, and propose some next steps. I think allowing sharedworker... is not the right thing from security POV. But I will look again.

#### Permissions API & Permissions Policy updates (@marcoscaceres, @annevk)

annevk: Marcos wanted us to take over editing. Also, we should drop `document.permissionsPolicy`/`document.featurePolicy` in favor of Permissions API?

dveditz: There's not complete overlap between those. Fundamental distinction between policy-controlled features and powerful features.

annevk: Thought they were the same policy?

dveditz: Not entirely overlapping.

Ben Vandersloot: Inheritance into and control over frame.

annevk: Notifications is an interesting example, no delegation.

mike taylor: What's the proposal?

freddy: Delete `document.permissionsPolicy`? (nee document.featurePolicy)

Mike Taylor: From the spec position, that makes sense. Would need to look into the details to figure out what the implications are for implementations and developers.

dveditz: Sync XHR: in permissions policy, but not via the Permissions API.

annevk: Would be better to push developers through `permissions.query()`.

Mike Taylor: Seems reasonable. But use counters show a lot of usage. Upshot, I believe, based on vibes, that most of the usage is Privacy Sandbox ads APIs, which we're deleting. So maybe that drops. Lots of devrel guidance for Topics API, for instance. That no longer exists.

annevk: WebKit has no requests for this API. Think the same is true for Firefox.

freddy: Not the JS API, but the header.

annevk: We should do the header.

freddy: vibes to science?

Mike Taylor: Sounds like work.

annevk: Easier to delete?

Mike Taylor: patches welcome.

annevk: Careful what you ask for.

Mike Taylor: Deleting the Privacy Sandbox APIs, we can adjust our metrics to exclude them from the counter to see what real usage looks like. If no one's asking for it, perhaps it's less urgent to delete from Chrome.

annevk: Chrome's current implementaion is not in the spec. Not sure how that works in WPT. Perhaps we need a negative test in WPT?

freddy: All permissions policy tests use the API today. They should be written to test the feature, or use `permissions.query()`, etc.

Mike Tayor: Next steps: we should take a look at the actual work involved to do this and go from there. What's the set of features/permissions? What would it look like to plumb through `permissions.query()`, then a separate question about whether we can delete it.

annevk: We could perhaps fold these specs into one thing.

dveditz: 
    
annevk: We had an understanding that the API would go away. Was never formalized. Renaming was entirely our idea, followthrough is lacking.

mkwst: Talk to Balazs and Antonio for Chromium.

dveditz: Talk to Freddy for Mozilla.

dveditz: There's a disconnect of what is a "permission" in the Permissions API and a "permission" in the Permissions-Policy. Need to consolidate

annevk: Some permissions can't work cross-site though (e.g., can't delegate notification/storage because they involve someone else's storage backend)

mkwst: yes, but embedder should control access towards frames. There might be examples where cross-site might ask (embeddee is aksing, rather than embedder is delegating). So you can delegate authority vs. delegate feature access

mkwst: capabilities  are sometimes origin-bound and partitioned

freddy: More minuters?

Simon: Tom and I discussed this a while ago. Permissions Policy (and Connection Allowlist??) don't use the policy container. Might not work, given inheritance requirements.

### Extra topic!

Wilander: Talked about something with Simone yesterday: any part of W3C that's talking about this, but it's on our minds. Agentic web: bots and agent authentication. Stable identity per user or device, bad privacy implications? Whole web model for ad funded websites? Some work in the IETF for bot authentication. Needs to be some part of W3C to discuss that.

mkwst: ...

Wilander: At Dagstuhl: we talked about the ad funded model in a world where your agent is browsing. Could go through the scenarios.

mkwst: I'll add that to the WebAppSec schedule at 11:45 tomorrow.

Simon: DBSC: Not differential trust. Protecting cookies, not exclusion.

#### Extending Permissions Policy to Workers (@antosart)

Antonio: [Slides].

Antonio: Proposal to extend permissions policy to Workers. Hasn't ever been supported in those contexts. Many issues on the spec and on other API specs pointing to this problem. There's a link to an explainer: github.com/explainers-by-googlers/workers-permissions-policy

Antonio: For child iframes, three components (it's complicated): parent has a permissions policy. parent can specify `allow` attributes to delegate/restrict child. child has it's own permissions-policy header. Combination of the three makes up the permissions policy of the child iframe.

...: Question is how to extend this to workers in a reasonable way. Essential differences between dedicated/shared/service workers. Same mechanism for all three cases is impossible. Proposal differentiates between these cases. For dedicated workers: this is the easy case. Very similar to child frames. Proposal is to do the same thing we do for iframes: combination of creator context permissions policy, specified `allow` parameter in the worker constructor (e.g. `new Worker(url, { allow: "..." });`), and `permissions-policy` header for the Worker script.

...: Shared Workers are more interesting. They're different because they're shared between contexts. Race/consistency issues with applying the same logic. Proposal is to combine the creator context permissions policy, a specified `allow` parameter on the worker constructor (e.g. `new SharedWorker(url, { allow: "..." });`), and a `permissions-policy` header from the shared worker script.

...: For connecting to the shared worker, the `allow` parameter would "key" the shared worker. If some other context tries to connect to the shared worker, it would only allow exact matches for the `allow` parameter. Simplest to fail in any non-matching case, whether stricter or laxer. There could be variants here, but this seems simplest to start with based on feedback thus far.

...: Also: allowed features are empty by default. That's different from same-origin child frame, but same as cross-origin child frame. Also: if the creator context can't delegate a given feature (because it's disallowed to them), then it will fail upon construction or connection. Listed these choices in the explainer.

...: This seems as simple as possible, but still functional.

Freddy: Multiple error modes: one looking to the Worker constructor, one looking to the permission-policy header returned with the worker?

Antonio: `permissions-policy` header can be a further restruction, but doesn't result in an error.

Freddy: So only visible by testing?

Antonio: Yes. I wonder what the actual use case for the header actually is. Not clear that this will be used to restrict capabilities in the document itself. There's an additional reporting angle: I think that's still useful to extend to workers. Easiest way to do that is to have the same reporting header for Workers.

annevk: an error event is a different pattern than what we do for cross-origin iframes. for those, we just ignore and not fail, right?

Antonio: For cross-origin iframes, we ignore them.

annevk: That's my preference. You can restrict the header more, but allow creation? Better for compat, as a header change doesn't break scripts. Also: is the allow attribute canonicalized? Ordering?

Antonio: Yes. We'd parse and construct a map and compare those.

...: If a feature is listed that isn't allowed in the parent... shared workers are shared. Could be connected to A->B and B at top level. Top level can delegate, A->B can't.

annevk: A->B shouldn't be allowed to connect to the same worker as B?

Antonio: In Chrome, this works.

annevk: Not alignment on that. Spec issues as well. I think you can make this point without the embedding question: two top-level Bs can have distinct policies, still creates conflict.

Antonio: True.

annevk: B1 only allows A, B2 only allows B. Why do you want conneciton to be different from iframes?

MT: Depends on which one creates the shared worker, dictates the policy. The policy cascades into the creation of the worker.

dveditz: The allowlist keys the shared worker. But the key should be the actual policy allowed, not the policy specified in the creator.

Antonio: If the policies aren't allowed by the creator, the worker doesn't start. If the worker starts, it matches the policy.

annevk: If there's a race, the creator wins, the other fails.

dveditz: Could just have two shared workers?

annevk: Sure.

MT: Adding another dimension to the key?

dveditz: Other issues crop up: cached worker script, then a different header from the network? Might need to key based on the resulting policy, not the declared policy from the constructor. Also: if creating a worker suddenly breaks because the document's policy changes, that's not friendly either.

Antonio: Either you can use the API controlled by permissions policy or not. Same error thrown.

annevk: You could imagine the Shared Worker library grabbing all the permissions it can. Could imagine that breaking in this model.

dveditz: Especially if we get rid of the feature policy API. then no way to ask.

tom: Thought we were doing that via the `permission.query()` API?

Ben: If someone naively grabbed everything and it now fails, that has positive outcomes?

MT: Web compat.

annevk: Doesn't impact existing libraries, because `allow` is new.

dveditz: No allow list? No permissions

Antonio: Right now, there's no delegation. No API that relies on permissions policy that's available in Shared Workers.

Tom: A list of APIs impacted on workers. Serial?

Antonio: Only dedicated workers in Chromium.

dveditz: Same thing applies to dedicated workers? You said there needed to be explicit allow?

Antonio: We'd follow iframe for dedicated workers. No keying, intersection of features is delegated.

dveditz: Cross-origin dedicated workers?

mkwst: We don't support cross-origin dedicated workers.

annevk: Which APIs motivate this?

Antonio: Explainer lists out a few: Serial, Sensors, etc. In Chromium, there's code dedicating compute pressure API, other AI-related APIs. Things that generally aren't prompted, but require delegation. Seems meaningful to find way to support them.

annevk: There are some things where allowing delegation is hard. Cross-origin isolated. Worker needs its own mechanism.

Antonio: unique case.

mkwst: Delegating potential vs delegating the capability.

annevk: This generally seems reasonable. No strong opinion.

Antonio: In principle, lots of small things where different decisions could be made. But I think the overall idea, considering the constratints, is good.

...: For service workers: `permissions-policy` header for the SW. No delegation from documents at all. Exposing any API to service workers is hard because the run in the background, visibility constraints. Header should constrain them, enable reporting, but should ack that extending APIs like Sensors, etc to Service Workers requires many more considerations than other APIs.

MT: Notifications is a permission in Service Workers. The empty set is not a reasonable default in this case.

Antonio: Notifications aren't covered by Permissions Policy. Can't be delegated to child iframes. Cross-origin child frames can't prompt. And if they have permission, they get sent in background, so the delegation doesn't make sense.

MT: Only true if the notifications permission is the same as the push notification permission. It's a little weird.

Antonio: Certainly.

MT: `allow: "a; b"` vs `allow: ["a", "b"]`?

dveditz/freddy: Same parser as iframe attribute?

annevk: If it's a list of strings, we could just do that. Did you consider that?

MT: Not important.

annevk: Somewhat important.

Antonio: Might be easier to make it a list.

annevk: What about the header? That makes it more complicated. Maybe the header syntax could be simpler?

Tom: Oh no, please.

Simon/MT: LNA permission. Empty set might not fly.


#### CSP: Expanded script-src hashes (script-src-v2) (@arturjanc)

aaj: [Slides]. I work at Google for 4 days, then I'm retiring.

[general applause]

aaj: CSP hashes. Talked about this a while ago, always "nice to have but awkward". Never any real urgency to this, and spelling questions, and etc. But things have changed a little bit over the last year or so: in the past, I jumped right into the changes themselves, rather than why it might make sense to make them. Want to rectify that now:
    
...: Chromium has an implementation behind a flag. Igalia is working on an implementation in Firefox. Talking with Mozillia folks to see if it makes sense to ship. There are good reasons to ship it if we can figure out how to do so. Agents finding XSS everywhere at scale, will talk through that.

...: Motivation: original spelling of CSP looked at the sources of script, create an allowlist of all the places you trust. That doesn't work: domain-based allowlists are too coarse. Research shows limited security impact. But would be ideal to set policies just by changing a header.

...: Strict CSP: shifted to a model that addresses the security issues we had with allowlist-based CSP. Nonces and hashes are finer-grained policies that allow only specific scripts to execute, rather than all scripts in a given domain. `strict-dynamic`, etc. helped delegate authority from a trusted script.

...: Deployment concerns: need to add `nonce` attributes, generate new nonces which makes content dynamic, need to thread nonces through the templating systems, etc. You can do it, and large developers have proved that, but it's an investment in rearchitecture.

...: We've known for years now that developers don't have the time to invest in rearchitecture. From a Google perspective, even though we've enabled strict CSP by default in all our well-lit paths, we still have thousands of internal applications not built on these paths, which haven't all migrated. Deployability remains a concern.

...: Ideally, we'd like to have the original deployment idea of CSP: look at all the things an application loads, but with security guarantees of CSP3 nonces/hashes. We want safety but also without requiring changes to applications. This would make it possible to adopt CSP in a scalable, automatible way.

...: We might need that in order to... [waiting on zoom]... XSS is important. Still top vulnerability. Agents are good at finding XSS (cf. https://blog.google/security/agentic-hacks-real-proofs-inside-googles-pagebreak-project/) . ~500 internal vulnerabilities in internal Google apps. 80% reflected XSS. A little scary. Similar things externally: HackerOne hackbots. XSS is easy to find and easy to verify: agents are very good at this.

...: We have this legacy attack surface on the web. Don't have on-by-default solutions. We're going to need to continue dealing with this while folks rewrite applications to have safer defaults. We need a scalable way to deploy CSP.

...: Hashes have the shape we want. Hashes let us allowlist a specific script, identified by its digest, without changing the application. We have to set the CSP with a hash, but not more invasive changes.

...: Hashes already work for most of the kinds of scripts we have on the web. They work for inline scripts, inline event handlers, `javascript:` URLs. They don't work for external scripts (SRI pins the content, needs an integrity attribute; doesn't work for dynamic content), and `eval("...")`. `unsafe-eval` is not fine-grained control. 

...: We want to make a small change: apply hashes, or something hash-like to external scripts and `eval(...)`. The proposal (implemented behind a flag in Chromium and Gecko) is to allowlist the specific source of a `src` attribute. `url-sha256-...` and related keyword.

...: `eval-sha256-...` does the same for `eval(...)`.

MT: Why hash the URL? Hashes are long, and CSP is already not short.

aaj: This is core. Let's come back to it in a few slides!

...: If we have this, than any kind of script loaded by a page has a corresponding hash representation. Policy remains backwards compatible in the same way as strict CSP. Could create a policy based on violation reports that would be relatively strict. Could also put hashes of scripts into violation reports.

...: Does the goal even make sense? From my vantage point, there's value in providing a mechanism to allow deployment without changing anything else about an application. So let's talk about syntax and the core proposal of hashing URLs.

...: Three main arguments: 1. Old-style URL-based allowlist is dropped via `'strict-dynamic'`. Dan pointed this out a decade ago, but we did it for backwards compatibility. But, URLs don't have the granularity we want: they ignore the query parameter. JSONP URL and similar: no way to make that safe with the current URL syntax.

annevk: Can you clarify that? Perhaps CSP could preserve the query? Why don't we support this today?

dveditz: Queries more sensitive, page could figure out 

mkwst: ... 

annevk: Why can't we ignore it for existing comparison, then we do it for strict-dyanimic-src case, we don't ignore it.

mkwst: Backcompat is a problem we need to solve. 

aaj: For backcompat reason Mike refers to, we can't change existing behavior. But we can come up w/ a new syntax for expressing URLs in CSP.

annevk: I don't understand the backcompat issue. If you include something w/ query param it gets dropped?

mkwst: ...this means when you use strict-dynamic, we drop all URLs. We tell you to use hashes or nonces... we would need to come up w/ mechanism that preserves that, while also segretating off URLs we want to allow. There are mulitple problems.

mt: Something like this would work.

aaj: A few ideas here. 3 different things we can look at. 1 - current proposal. Do opaque blob hash. Least readible. 2 - could have hash of path and query value attached to the origin. That doesn't tell you exactly what you're allowing, but tells you the origin. 3 - we could have new syntax for URLs, or have URL verbatim. THen it has the full URL.

...: each of them would work.  

freddyb: why hash the URL? It's weird and obscure. Now I think I understand... it's easy for the browser to look at HTML and the policy, compute a hash and compare. For every other tool it's obscure and complicated to figure that out. I would prefer more explicit "url-whatever", so every other tool can figure this out and see what's in the policy and the HTML.

aaj: Your argument is for the 3rd option. 

mt: This works w/ fully qualified URL (https://....). Not clear if this works w/ relative referecnes (i.e., ../foo). Hashing depends on what happens of resolution of foo.

aaj: From deployability perspective. Having the literal value be reflected there is more useful. Otherwise if you canonalize it, you will have diff hash depending on the path of the document that loads it.

annevk: if we have browser URL differences... that seems preferable.

mkwst: We need to see if "?" is acceptable for CSP parser.

annevk: And comma.

mkwst: We can explore this.

annevk: Call it something else if it's an attribute value.

Tom: I'm concerned about base URL usage.

freddby: you want a different keyword for relative or absolute?

annevk: no, only literal values. 

dveditz: eval?

mkwst: eval has to be a hash.

aaj: unsafe hashes only work for attributes and javascript URIs.

annevk: I feel like hashing those as well... it would feel more consistent if we have hashes for all of them. If they're not actual URLs.

dveditz: hopefully Unicode is already answered. It should be consistent (or fixed).

mkwst: This is a good and useful conversation that we should continue at lunch. We should have a thing we can agree on. Freddy makes good points on legibility and non-browser tooling. Many options seem reasonable. We agree on the thing we want to do. Let's figure out how to spell it.

aaj: SGTM

#### W3C Advisory Board: Experimental Process (w3c/process#1189) and Group Culture (@torgo)

torgo: Representing W3C AB here, pulling the conversation from the detailed level to a high-level process discussion. Last year, we talked in Kobe to solicit feedback about our process. We want things to work better for all of our groups. We took that feedback and tried to bring it into issues raised in the Process CS. That group's responsible for revising the process. Want to make things work better and more quickly.

...: Next version of the process document will include an experimentation mechanism. Run this particular WG or spec with an experimental version of the process, removing or enhancing certain requirements. Will see the results of the experimentation and help move our process revisions forward more quickly. Trying to make people's lives easier, but also trying to make W3C a more attractive place to do work.

...: We are doing this experimentation. Link to the process PR in the issue. Take a look at it, help us understand how WGs might use this experimentation mechanism. Are there blockages to the process of publishing technical reports that we could address through experimentation? Would anything in particular be useful for this group.

...: Please come talk to me, and to other members of the AB if you have thoughts about an experiment you'd like to run within the process. Mike, as chair - any ideas?

mkwst: I think the main thing has historically prevented the group from moving documents to REC is less about process and more about cost time benefit analysis. It seems like a lot of boilerplate work to go throught the process. It' ssometimes difficult to see the value in doing that, given that implementations dont' feel constrained on the document status. It's not clear to me that there's a process experiment that would make it simpler. What would be simpler... the steps necessary to go to next stage (CR, REC), the more automation we can put there, the better. From my POV, w/ chair hat off. A lot of that work is simply work that doesn't add additional value to spec or implementation, instead just checking boxes. There is value (i.e., IP protection). But, it requires time and sometimes hard to justify that work. 

...: Why do this work? If we can automate the process so folks don't have to think so much. Instead, we collect things we care about automatically, i.e., point it at WPT vs writing an implementation report. For browser vendors, we're in the process of moving to a model of a "cross-functional review"... in Chromium, you can look to chromestatus.com to see how we launch web platform features. We have a lot of gates to ship a feature. But many can be handled on your own. Answer a questionnaire - and self-certify. e.g., if a feature doesn't touch UX, why ask for a11y review?

torgo: That's very valuable. We talked to a lot of people who had these issues. On horizontal review - we want to make it more async, so people aren't blocked on an a11y review, instead of moving something forwards. In w3c, we see horizontal review as one of the benefits of the organization. This is all very helpful and reflects my impressions already.

...: the other question. On culture within w3c and this WG. The other area that AB is responsible for us culture. We want to make sure that we're not being blind to issues that crop up. That we're paying attention to each WG's culture. We want to learn from you all. Are there culture issues? Are the culture artifacts useful (i.e., code of conduct)? Do they help have a more productive or inclusive culture? If anybody has any feedback on the topic, please talk to the AB on that. Happy to hear it now. We want to encourage w3c culture to be positive, a place where people feel heard. Inclusivity as a core value. Want to make sure that continues to be the case. Happy to address any comments. 

* seagulls chime in *

torgo: Please feel free to talk to AC rep. Talk to friendly AB person. Talk to anybody in the team. Raise issues and let us know how we can help. Thank you.

mkwst: We will recovene at 1:45pm.

#### Sealed form fields (sealed-fields CSP directive + <sealedinput>) (WICG #307) (@decleezy)

#### Web Crypto: Streaming hashing, Modern algorithms (status, Hybrid KEMs, "well-supported" criteria), and crypto.randomUUIDv7() (PR) (@twiss, @hubertchao)

#### Local Network Access (@MayyaSunil, @hubertchao, @christhompson)

#### Device Bound Session Credentials (DBSC): Updates and extensions (cookie-less mode, JS API, per-endpoint deferral opt-out) (@arnar)

#### CSP: speculation-rules-src and the Speculation-Rules header (#808) (@vickiez) 
