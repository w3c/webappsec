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
* Zak Ridouh (Apple)
* Hiroshige Hayashizaki (Google)


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

#### Web Crypto: Streaming hashing, Modern algorithms (status, Hybrid KEMs, "well-supported" criteria), and crypto.randomUUIDv7() (PR) (@twiss, @hubertchao)

Daniel presenting table at https://github.com/WICG/webcrypto-modern-algos/issues/25 

Daniel: Modern algorithms draft: some things have happened. Chrome proposed the addition of hybrid key encapsulation mechanisms. Previously we defined all the pieces for PQC separately: ML-KEM, ed25519, etc. Most everyone is shipping PQC in a hybrid fashion at the moment: Chrome proposed to ship one algorithm for that. One call to the API, apply both algorithms in a single call. That was added to the spec. Chromium has also shipped the PQC algorithms including hybrid KEMs behind a feature flag, plus ChaChaPoly.

...: We also have a mostly complete implementation of all the algorithms in servo. Partial implementation in Ladybird. Firefox also working on PQC, has implemented ML-KEM.

...: When can we start merging some of these things into the main spec? In the charter that once proposals are well-supported, they can be merged into the WG's draft. We've merged curve 25519 into main web crypto. Then, we waited for everyone to support. What do we want to do here? Wait for Safari? 2 implementations?

Pascoe: We have expressed support for hybrid algorithms in a WebKit standards positions issue.

Daniel: Explicit call for the PQC algorithms?

mkwst: CfC for adoption sounds reasonable to me.

MT: Would be a good to have a process for deciding whether or not each algorithm is blessed or not. I would put Kangaroo12 and Argon2 and OCB... would draw into question (maybe). Would be good to know... do all the implementations support all the things we care about. Some of these are on the fence. Poeple have voted with their feet. Knowing where things are would be great.

Daniel: SLH-DSA can clearly be dropped. There's been discussion about all of these algorithms in WICG. There's benefit to merging them incrementally. There's support for PQC and ChaChaPoly. Let's start with that, but not debate Argon2, etc. Clear use case at Proton, but maybe others don't have a use case for that.

Christian: It's important to split out PQ candidates from this list into their own CfC. It's a ticking clock for a lot of people to get these implemented. Having WebCrypto capability on these ones is more important now vs bikeshedding over other things. There is pressure to implement PQ now.

Daniel: SHAKE is used in hybrid KEM deployments. OpenPGP unfortunately, the construction is different from the rest of IETF landed on. We do need shake to be able to implement hybrid KEMs there. Not necessarily cSHAKE but plain SHAKE at least. I do agree that PQC is the highest priority. 

Christian: Composing primitives. SHAKE isn't particularly constant time concerned as opposed to other ones. SHAKE could be JS, or WASM.

MT: Not sure that's always true. Could be true for some.

Daniel: We do ship JS. But we can always improve upon that.

Daniel: Brief update on streaming. We have an open PR for accepting async iterables to be able to do streaming hashing. We got positive implementer interest from WebKit and Mozilla. We don't have a separate WICG draft, just a PR. And some tests. Perhaps we should have a CfC?

mkwst: These seem reasonable. It's necessary for us to let people not present to object.

Daniel: A proposal randomUUIDv7. It's not from me. I will try to represent it. We have have randomUUID. New addition that has better time locality. There is an experimental implementation in server runtimes (node, deno, bun), but AFAIK, not much in the way of (browser) implementer interest or positions. Unsure what the next steps are.

mkwst: Anne commented on this - noting that it seems reasonable. Similar to my opinion. No objection to supporting well-specified UUID implementations. We already support v4. It would be unfortuante to need a separate UUID API when v8 comes out. Might be reasonble to have a property bag to pass in, vs a different function. It's not clear to me that there's a lot of demand. But, if there is a desire for it from devs - not a huge implementation lift. 

MT: Trivially polyfillable. Random number generator and a clock. Do we have any evidence that people are building this on their own? If not, not strong evidence to put it in the platform. Not a fan of UUIDs. 

mkwst: Fair perspective. If we don't have evidence of demand, implementing doesn't make a lot of sense. But, no objections in the abstract. I agree with Martin, understanding the demand is helpful when doing prioritization. 

Daniel: Node.js has implemented v7. Some npm package as well. 

MT: In respond to demand? Or just sending a PR?

Daniel: Not sure. Would be nice to have someone to drive this proposal. 

mkwst: I will summarize this discussion and comment on the list. We can continue discussion there.

Daniel: That's all. Thanks.

mkwst: You have some CfCs for us to discuss. We will post something for UUID. Then we need to talk about how to move the document along REC track. I will ping Simone and we will figure out the process. Publishing as a living CR seems reasonable. Getting the set of PQC algos adopted - reasonable for us to push along that path.


#### Sealed form fields (sealed-fields CSP directive + <sealedinput>) (WICG #307) (@decleezy)

<https://github.com/madeit-build/koschei/blob/main/docs/specs/explainer.md>


#### Grab-bag

Christian: Hashes v2. Will that close the wasm hole for modules?

aaj: Is there an `unsafe-wasm-eval`?

Christian: Yes.

aaj: Would make sense to have the same thing for wasm that we'll build for eval. Would be conceptually consistent to have the same mechanism here that we have. Better than a blanket opt-out.

mkwst: Injection Mitigation. https://mikewest.github.io/injection-mitigated/ 

Pascoe: "Plugins"? Does that deal with extensions as well?

dveditz: No.

mkwst: Digitial Credentials _is_ concerned about extensions

Pascoe: Right. DC and WebAuthn might be different.

Wilander: Almost 10 years ago, I wrote an email to this group proposing something similar. Single Trust. "Only the 1P is doing something on this page." could signal that to the user.

Johann: Interesting. We have a session in this group tomorrow to talk about things we see in Chrome right now: AI Agents writing code inside pages to help people do things. It's on the users' behalf, but also very risky. Published exploits where agents included third-party script. I'd like to find some kind of safe mode we could enable in which we could execute these scripts on users' behalf.

MT: Model being involved doesn't change anything. Extension doesn't change things either. People make a choice to use these tools, they are part of the user agent. "That sounds super-risky, I'd rather my agent not do that, but that's a choice I'm not going to force on you." Would be best for this group not to decide who's making choices about users' agents.

Johann: Not take features away from a page, but inform browsers about the pages on which it's safe to inject script.

MT: User agent isn't fully in control if the page controls the level of access.

Eric: Generally agree with Martin. I get nervous when people say "Maybe webauthn shouldn't work with extensions." Maybe cleaner extension points, but given the tools, we don't have the context to apply context for the user.

Johann: I agree with that. In the end, users can choose an agent that runs dangerous scripts. But agents can look at signals to determine where script execution is reasonable.

Daniel: `SecureContext`. There's been some discussion in WebCrypto about requiring secure contexts for `randomUUID()`. Trivially polyfillable. Originally shipped as requiring secure contexts. Libraries still ship pollyfills because they're not sure about the contexts into which they'll be loaded. Do we need this reqwuirement for trivial functions?

Wilander: Unfortunate naming. But is there an opportunity to fix that?

Freddy: To Daniel's question: we've generally decided that new APIs should be behind `SecureContext`, but we didn't apply it universally. See e.g., crypto.getRandomValues -- `randomUUID()` is similarly trivial. So, maybe fits into that precedent.

MT: I've come to the view that HTTPS has won, and perhaps the carrot we were hoping to create with `SecureContext` was something of the past. If there's a small reason that removing it here would make things better, that doesn't hurt so much. Carrot might not be necessary anymore.

---

MT: Hashing and integrity: major problem with integrity attributes is that you need the entire thing before hashing. Incrementally verfiiable hash of content would be ideal. Delivery of the bits necessary to get the hash validation incrementally. Need additional hashes along the way. Content-encoding version of this that I'd floated. Nice thing with those encoding is that bytes are delivered to a client that understands the encoding. If there's a hash it can be verified, if not, it can still be used.

[mt] The old thing I worked on was called MICE (https://datatracker.ietf.org/doc/draft-thomson-http-mice/ with Jeffrey); the new version of this is a little more flexible (https://martinthomson.github.io/chic/draft-thomson-httpbis-chic.html).

Simon: More secure contexts. Local networks. Could get rid of the contexts that don't use HTTPS.

mkwst: MT had an approach.

MT: In 2015.  https://docs.google.com/document/d/170rFC91jqvpFrKIqG4K8Vox8AL4LeQXzfikBQXYPmzU/edit?usp=sharing

Simon: Post it.


#### Local Network Access (@MayyaSunil, @hubertchao, @christhompson)

Sunil: LNA. Why? Lots of reasons. Local network access creates attack surface. Local routers, etc. LocalMess was a recent, high-profile example. User agents reacted quickly, and mitigate this with LNA.

...: Google proposed this: segregate IP addresses into three spaces: loopback, local, and public. Prompt user for permission to go from public->local->loopback. Deny access to non-secure contexts.

...: Firefox now implements the prompt, as well as a permission model and debugging information in the console.

...: LNA status: Chromium and Firefox, shipping in Chrome since M142. Now shipping in Firefox to EPT users, hopefully by default in the next release. Restricted to subresource loads, top-level naviation is excluded. Restrict public->loopback and public->local. Same for Chrome, right?

Hubert: Correct.

Sunil: Permission Policy: we align on permission names. Collaborating on the granularity. Apply to websocket and web transport, as well as dedicated workers. Service/Shared worker requests are blocked unless the origin already has the permission. Top-level page needs to request on the worker's behalf. WebRTC is in discussion.

...: Mixed content relaxation: Gecko hasn't implemented this yet. We do plan to implement, but not yet. Hubert, do you have plans for other web APIs? WebSocket, etc?

Hubert: I think we had plans for websockets. We haven't finished that yet. Need a new parameter. Web Transport is all secure, so no need.

Sunil: XHR?

Hubert: Need to think about it.

mkwst: IMO, we shouldn't change XHR.

Freddy: Mixed content relaxation?

Sunil: Fetch options addition allows the ability to start the process of connecting to a domain prior to resolution.

Freddy: Enables pages to talk to local in ways that MIX would have blocked?

Sunil: Yes. So, what's next in Firefox? Reports and suggestions from our users that tey need more context and better understanding about the prompt. Enterprise users need options. We'll add a "more info" dropdown in the prompt. We also have this gap for MIX relaxation, we'll add that. Finally, we'd like to block trackewrs and insecure requests from local network access entirely rather than prompting for them. Top-level navigations are in-scope, and we'd like to prompt prior to connection. WebRTC is another gap we'd like to close.

...: Top-level navigation (issue #48). Without this, we're still vulnerable to CSRF/rebinding attacks. We tried to ship this, but found breakage. Google Auth, for instance. Our implementation triggered server-side breakage detection, need another path.

Hubert: Initially broke this by mistake. Okta as well. Now we've addressed it.

Sunil: We could take a standard approach: enable this for local network, gather experience in the local network only, fix breakage, then roll it out more broadly. But ideally, we'd prompt before establishing a connection.

mkwst: Asking about this.

Sunil: OAuth problem with localhost. Public->loopback.

Wilander: This is a common case, right? Claude.

Eric: Spotify. Lots of examples.

Sunil: We want to enforce these restrictions, right?

[crickets of agreement]

Sunil: We'll add usage data, and pursue this approach to see how it works. As implementers of the standard, we should apply the restrictions in a similar manner across applications. Loose agreeent on a timeline could be helpful? When can we enforce.

Hubert:

dveditz: John, what about WebKit?

Wilander: There's a bug against WebKit, around for many years. We wanted to make a clean switch from HTTP to HTTPS. Group decided to open up HTTP first. We stuck with it, which makes our implementation quirky. We're happy to see the progress here. Solves many of the problems discussed in 2016. That's where we're at. We generally don't like prompts, but no one does.

dveditz: CORS approach tried to do it without the prompt. But in practice, no one's updating the things people want to talk to.

Wilander: Some kind of latch mode might be helpful. Maybe easy for the first local port you talk to, harder for the rest. Addresses port-scanning. That's still interesting to us. Could give you one try to prompt, then make it harder.

MT: Not concerned about the tracking potential? One port prevents scanning, but with local apps there for tracking purposes the concern isn't addressed.

Wilander: No, there's still a prompt for the one. We're just not going to give you more tries.

Sunil: Next issue: prompt before connecting (issue #103). Implementations prompt after establishing connections. Bypasses still exist given this hole in existing implementations. URLs can be encoded with tracking IDs, hostname is sent in SNI parameters, so it's enough to create tracking potential. If we restrict to IP connections: your local app might be listening to multiple localhost addresses: last octet is a communication channel. Best defense is that we should prompt before making an actual connection.

...: Challenges: unexpected prompts on local network, because captive portals push folks to local IPs. Content blockers do the same. Also happy eyeballs is a race between multiple connections.

...: Except for happy eyeballs, one possible solution would be to prompt before loopback connections only. Also perhaps integration with happy eyeballs. Also, no specific step for connection establishment.

mkwst: [confusion about happy eyeballs]

MT: [clarity about happy eyeballs]

annevk: Fetch doesn't model happy eyeballs. Maybe it should. It's tricky, Sometimes we only want to resolve and not connect. Could we have a happy eyeballs variant that didn't establish conections?
    
Sunil: Happy eyeball integration (issue #7). Possible solution space: 1. classify every resolved endpoint. 2. decide once DNS is final.

...: WebRTC? Open question. What should our plans in this space be.

    
#### Device Bound Session Credentials (DBSC): Updates and extensions (cookie-less mode, JS API, per-endpoint deferral opt-out) (@arnar)

Slides: https://drive.google.com/file/d/1Q2j7N4S0o4EJdMMhMpKQ8FFu1m2WnGSF/view?usp=sharing

Arnar: Not going to try to explain all of DBSC, but we want enough background to talk about some proposals to get folks' input. Threat model is cookie-exfiltrating malware. Browser needs to produce credentials to authenticate requests. But malware has the same privilege as the browser in most cases. That makes things hard to solve from the platform level. OS needs to take responsibility. But we see very successful attacks at scale with infostealer malware. Installing the malware dumps your profile to an attackers' server: all the abuse happens after the malware is already cleared off your machine. DBSC aims to prevent this exfiltration, and force abuse to happen locally rather than after the fact.

...: Protocol in which the website starts a session, gets a public key from the browser, and then the browser authenticates requests by proving possession of the corresponding private key. It's on the browser to protect that key. Nothing in the spec says there must be a TPM, nothing hardware-bound, no attestation to the site about the nature of the protection the browser offers. Not there to give signals to the website. Shipped in chrome for Windows and macOS, and Edge for Windows. We use this at Google to protect accounts.

...: Design constraints: 1. we can't protect a key from malware and also expect to sign every request. Signatures are expensive. So we want to prove possession of the key periodically, and use something else inbetween, 2. We can't require sites to rewrite their tech stack to deploy this.

...: Many apps have an authentication component as middleware. If a request isn't authenticated: 1. do a full redirect to sign in, 2. serve anonymous results, 3. return an error and let the client handle it (e.g. XHR).

...: None of this can happen frequently. Periodic proof of possession happens on the order of minutes, can't log you out during that period.

...: DBSC sessions require the client to push a cookie with a certain name on all requests. If thst cookie expires, I'll queue all requests to your site, hit a specified endpoint to refresh the cookie via a challenge, and then attach that cookie to the queued and ongoing requests.

...: [Protocol examples.]

...: That's what exists today. Deferral allows middleware to do what it's always done without require rewrites of server-side logic. But it has the side-effect of engangling DBSC browser state with cookie state.

...: Proposal 1 aims to decouple. If we say we can change the authentication component on the server, server provides the browser a challenge, and delivers a signed response to that challenge to all outgoing requests for some period of time. The server can send a new challenge at any time, which restarts the clock. But if the session expires, requests will be queued, and the explicit refresh protocol will execute.

MT: The basics here seem like an improvement. Website can also set a short-term cookie, then magic happens.

annevk: Now there's another header with credential data beyond `Cookie` and `Authorization`. Middleware needs to know about the new thing.

Wilander: Along the same lines: there's something missing for me: since these are short-lived, and as soon as they're dead you refresh, something else needs to carry the notion that you're still logged in.

Arnar: Sessions have a specific scope. you declare that any requests within this given context will carry the session. But server needs to tell the browser that the session is dead.

Wilander: State of being logged in is not managed by the browser.

MT: Existance of the session is distinct from the cookies associated with that session. Expectsation is that the server will tell the client when the session is dead.

Wilander: How does that work?

Arnar: Session can end in two ways: user clears site data, or site tells the browser that it doesn't recognize the session/signals its death. Then the browser deletes the key. Sessions can be logged in state, but they could also be other things: Google has a session for the sign-in flow even for non-signed-in users. State of the session is persistent in the browser, explicitly managed.

MT: And lifetime matches cookies.

dveditz: We have mechanisms to persist cookies across browser restarts. Would need something similar for this challenge.

MT: Similar to indexeddb: created, then there until it's terminated by the user or the server. Session continuity feature.

Wilander: Assumption that the key material is stored in a better way than cookies.

Arnar: Browsers can store private keys in better places. But it's not a tool for websites to see that that happened. Could implement DBSC with a software-stored key, just reduces the risk mitigation.

MT: Could implement for all users in software, and push to hardware for the subset of users with hardware that supports stronger protection.

Freddy: for the user agent to decide?

MT: Yes. Not the site.

Wilander: Malware is a local attack?

Arnar: Malware today exfiltrates cookies. Pushes abuse to active, persistent local malware.

Freddy: This needs constant refreshing, limits the risk of exfiltrated cookie. Also, user agents generally do use TPMs when available.

MT: The malware needs to be active and operational constantly. That makes it more detectable, and means the attack ends when the malware is removed.

Wilander: Still assuming the browser is sandboxed so other processes can't access its files.

Eric: Can work within many models of protection. Can reduce in various ways.

???: Threat model: when we move from cookies to these headers, there's a consideration regarding ???. `SameSite` cookies: need to think through treatment of DBSC sessions in iframes, etc.

MT: Cookies complicate things.

???: yes. But needs to be specced.

Arnar: Proposal 2: Deferred opt-out. Refresh takes time, needs a fresh challenge, slow signing mechanisms (e.g. TPM). However, browsers shouldn't keep refreshing if the user isn't using the site. So it's unavoidable that there's a delay when you come back after a gap in browsing. Possible to deal with this on the server if anonymous results are useful for your server's use casde (e.g. search results). Server could specify that certain paths don't require deferral.

...: Proposal #3 is a JS API. This doesn't need to do anything with cookies or headers. DBSC is asyncronous: can be a pain point for developers who wish to wait for the session to be established before doing things. Issue #299 is a proposal to provide session events so developers csn understand the state of the flow.

...: One more: DBSC-SSO. Allows IDPs and RPs to collaborate.

MT: Turns out to be tricky. From our perspective, anything that require exposing attestations to arbitrary websites is a non-starter. That was a part of the enteprise variant of this, but I don't think it's necessayr. Will continue the conversation. Can be less-intrusive.


#### CSP: speculation-rules-src and the Speculation-Rules header (#808) (@vickiez) 

Viktoria: CSP and `speculation-rules`. When dealing with external speculation rules, came across integration with CSP. Developers want to be able to use these, especially in cases where headers can't be applied. Need to decide how CSP applies.

...: For inline speculation rules, the `script-src` directive applies. Open question is what we do with header-delivered speculation rules for external speculation rules. We don't want to make `script-src` more leniant, but want to enable getting these rules: still want to exempt the header from CSP.

...: Options for integration between `speculation-rules-src` and `speculation-rules` header: 1. Full exemption. 2. Explicit-only (only `speculation-rules-src`). 3. Default-fallback: `speculation-rules-sec` -> `default-src`. 4. Script-fallback: `speculation-rules-src` -> `script-src` -> `default-src`.

...: If we apply CSP to the speculation rules header, `CSP: script-src 'none'` would break.

...: Cloudflare would be affected. Other CDNs as well. Office online.

...: In Chromium, there's `inline-speculation-rules` which allows inline speculation rules as part of `script-src`. For new rule, we could support `unsafe-inline`. The `unsafe` prefix could dissuade developers from using this. We also want to support nonces and hashes, could be better than allowing any inline speculation rules.

aaj: Some thoughts: the risk we're worried about is speculation rules that allow querying the DOM in ways that are similar to CSS selectors. Gather information about the DOM, and cause requests to be made to an attacker's site. For the header-delivered rules, the same issue doesn't apply: generally less-likely that injection happens in an HTTP header. But if you could, you could inject the CSP header as well. There's little risk associated with this.

annevk: That's weird. We don't do that for other headers.

Barry: Link is governed by CSP, but depends on the order.

annevk: Headers arrive in an atomic block. Seems like a bug.

aaj: I won't comment on the weirdness. But from a security perspective, it doesn't seem like something we need to be worried about.

annevk: CSP should govern all fetches from a document. Why exclude the headers? Injection into one header doesn't create injection into all headers.

aaj: CSP report-uri? Could be arbitrary external destination.

dveditz: Integrity manifest for WAICT.

annevk: Does it go through Service Workers? If it goes through the same fetch flow, it seems reasonable to apply the policy.

mkwst: What's the client? We don't have a document at this point?

dveditz: What's the use case from Cloudflare?

Barry: Cloudflare was injecting speculation rules to improve performance. They need to modify the CSP in order for that work to happen, and the risk of that is higher than the risk of the speculation rule header in the first place.

Simon: Looked into which Fetches are governed by which CSP. There's a link in irc.w3.org #webappsec chat (https://gist.github.com/zcorpan/3aa2e7127b3330964afd8731109a6962): `refresh` header isn't blocked. NEL and Reporting as well .

annevk: if those are the only exceptions, we're good. Icon is suprising. Any subresource request should go through the same Fetch flow, rules should all be the same.

