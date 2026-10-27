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
* Marcos Caceres (Apple)
* Nicola Tommasi (Google)

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

aaj: [Slides]: https://arturjanc.com/expanded-hashes-tpac-2026.pdf. I work at Google for 4 days, then I'm retiring.

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

## Day 2 - 2026-10-27

**Agenda**: https://github.com/w3c/webappsec/blob/main/meetings/2026/2026-10-TPAC-agenda.md

Zoom link: https://w3c.zoom.us/j/7907688363?pwd=ht9UJXZucyzNczCN29aKNeXEYG46ab.1 

### Attendees

* Mike West (Google)
* Artur Janc (still Google)
* Frederik Braun (Mozilla)
* Daniel Veditz (Mozilla)
* Tom Schuster (Mozilla)
* Noam Rosenthal (Google)
* Niklas Merz (ASF)
* Nicola Tommasi (Google)
* Aram Zucker-Scharff (The Washington Post)
* Daniel Huigens (Proton)
* Brandon Maslen (Microsoft)
* Barry Pollard (Google)
* Mike Taylor (Google)
* Andrew Williams (Google)
* Ari Chivikula (Google)
* Simon Friedberger (Mozilla)
* Simon Pieters (Mozilla)
* Takashi Nakayama (Google)
* (You!)

#### Trusted Types & Sanitizer

Noam: [Slides] at https://github.com/noamr/tpac-2026-presentations/blob/main/trusted-types-sanitizer/index.html

...: Sanitizer in Trusted Types. Something that's shipping in Chromium, but we'd like to discuss the opportunities going forward. We wanted to stream HTML into an element (`response.body.pipeTo(...)`). Sanitizers generally rely on having the content, running it through DOMPurify, etc. Those libraries don't know how to stream, grabbing one chunk after the other. They need the whole string at once, with negative performance implications.

...: But now we have a built-in sanitizer in the platform. Bringing those concepts together would be idea. Allow trusted types to be used for enforcement (no header for the sanitizer itself), and sanitizer to be used as the implementation guaranteeing safety.

...: New `runScripts` flag in the HTML parser (previously implicit in `createContextualFrament`, not explicit).

...: New trusted types mechanism called `createParserOptions(...)`.

Freddy: key change is that the sanitizer moves into the parser, so we can do it via a stream, and not just as an operation on a string.

Noam: Right, more integration into the parser. By default, this works with the new non-sanitizer methods (`parseHTMLUnsafe`, `setHTMLUnsafe`), and fits into the legacy sinks (like `innerHTML`) via the `default` policy Trusted Types defines.

...: So the default policy can enforce a set of sanitizer policies on those legacy sinks.

Freddy: This gives an opportunity to sanitize without rewriting scripts and libraries: default policy can enforce sanitizer everywhere (with temporary exceptions today).

Noam: This works for streaming usage as well. `await response.body.pipeTo(el.streamHTMLUnsafe(opts))`.

...: Precedence & Fallbacks: `createHTML` is still there, still needed for some cases. If `createParserOptions` isn't called, it falls back to `createHTML`. Doesn't work for XML/XHTML. Existing issue with Trusted Types.

...: Future things: `iframe.srcdoc` attribute, `document.write(...)`, `DOMParser.parseFromString(...)`, XML `innerHTML`, XML `DOMParser`.

???: Does this fall back to `createHTML`?

Noam: No.

Freddy: Some do.

Noam: Yes, some of these do.

???: XMLHttpRequest is another.

Noam: Right. Fallback to `createHTML`.

Freddy: Outlook: for future sinks, we can get rid of DOM-based XSS. With a tiny default policy, you can do this for your sites today. But it would be nice if we could remove the necessity to touch code at all by setting default parsing options, baking Trusted Types more deeply into the browser as a migration path for legacy applications.

aaj: Reporting? Is it possible to enable this in a report-only mode?

Noam: Yes. Takes this from TT's reporting mode today.

aaj: Today, we report on errors. We might not want that, but instead get a report about whether the sanitizer actually did something.

Freddy: Would be nice, but it's non-trivial.

aaj: Got it. This is a great idea overall, happy you're working on it.

Aram: Can you define your own sanitizer rules in this flow?

Freddy: Yes. The examples were all default, but you can supply a list of allowed elements, other configuration options.

Aram: Ok. Two things about what's next: 1. Don't make `document.write()` work any better than it does today. Generally, we should fundamentally deprecate the API. Nothing should encourage folks to use it. 2. For `iframe.srcdoc`: that would be highly valuable. Primary methodology for ad serving. Would love to stream and sanitize them. That would solve bad ads.

mkwst: you probably want a Trusted Types integration point. The sanitizer will prevent all script from running for all sanitized code, which won't work for ads / iframes. That will be stricter than you want. Trusted Types allows you to manipulate HTML before it's inserted into a page. 

Aram: This is a useful pattern as ad tech industry is looking at ??? style ad insertion. When you want to refresh an ad... it isn't solved because of this type of problem. You could maybe insert a fragment instead. And then you can sanitize it.

Luke: TT would be the integration point. Available today in all browsers. Also, only the "safe" variants of Sanitizer prevent script execution. The `setHTMLUnsafe` variants would work for you. On you to write a correct sanitizer, but it exists.

Freddy: TT gives you the callback for the frame, then your unsafe configuration can take care of it for you.

Luke: With `srcdoc`: does that end up getting reparsed once you set it? Just an HTML string? We might want a new API surface there to avoid XSS risk in that circumstance.

Noam: HTML starts parsing the string as HTML, we'd apply those rules when doing so. This should just be one parsing operation.

Luke: Possibly some ergonomic changes to avoid parsing into the content document.

Freddy: We had an issue about that, https://github.com/WICG/sanitizer-api/issues/117 

Luke: A blessed trusted types policy makes sense. Backwards compatibility... If we add that, the documentation should explain how to deal with that in all browsers.

Noam: This is the case for any CSP header. Need to make sure that it works across browsers.

Artur: Reporting: it could be good to think about how we'd do reporting that wouldn't send a violation report on _every_ usage. Those usages will be safe most of the time, but we really want information about times at which the sanitizer actually made a change to your page's behavior. I don't have an answer, but seems important to deployability.

...: Also: `*Unsafe` methods are interesting. I think it's worth being aware of that: the list of DOM sinks we've had in the past was relativly static. We've acquired a number of new DOM sinks over the last ~year, and it's important for folks to know about them. We've wired them up to sanitizer and they're architecturally sound, but a simple rule "Don't use `innerHTML`." isn't going to be good enough anymore with all these new methods. It's reasonable to add new methods to the platform, but it's something with an impact on developers and ecosystem.

Luke: Default TT policy: we want to make sure it's one that's just blocking XSS, and not stripping most attributes.

Freddy: Explainer has some variants. See https://github.com/mozilla/explainers/blob/main/trusted-or-sanitized-html.md 

#### Connection-Allowlist

Noam: [Slides] at https://noamr.github.io/tpac-2026-presentations/connection-allowlists/index.html

...: Connection Allowlists: current status and idea, and then embedded enforcement.


...: List of origins, WebRTC, redirect configurations, etc.

...: Aims to block outbound connections that don't match the list of origins provided. Covers `fetch`, navigation, DNS, etc. Any exfiltration vector is in scope.

???: Protocols?

Mike: No, it doesn't support distinctions between protocols.

Noam: Different from CSP: doesn't care about usage, only about connection. Key part of the design is this agnostic nature. WebRTC is weird, unfortunately.

Freddy: Well-meaning LLMs as a use case?

Noam: If you run your own LLM, you don't care what it does to the page, but you only want it to have access to it's own page.

Mike: Like a chat bot with a framed agentic code execution.

Aram: Does that include iframes?

Noam: Iframe itself opts into the allowlist. Navigation to the frame is covered. We'll touch on embedded enforcement later.

...: Special cases: redirects and WebRTC. Both are boolean: we either block all redirects or we don't, we either allow WebRTC or we don't (STUN/TURN, etc is complicated).

Artur: Why same-origin redirects?

Mike: Said things... Fetch says we will go through the whole process again.

Anne: I don't think Fetch does that. Poeple are arguing that it should.

Mike: You're probably right and I'm wrong. I remember there are problems in this space. I forget the details.

John: HSTS has challenges with mixed-content and ordering.

Ben: How do you handle the service worker awkwardness. The page has connection allowlist, but has a SW handling multiple pages?

Noam: It's protected twice. The fetch from the client, before the SW, you have to pass thru the document. If you trigger another request through the SW, it has to go thru the connection allowlist of the SW. 

Ben: Is that a redirect if the SW gives another response?

Noam: No. Gets quirky with Service Workers in `openWindow` and etc.

Anne: It's not double checked. It's independently checked.

Mike: You're both right.  It's checked twice. We treat the SW as the server from the page's perspective. Once the request goes to the server, the server does what it wants. We give you an option, but it's a boolean. We don't apply the page's policy to the request made by the SW. In the same way we can't apply to server to server communication.

Ben: Resitration time for SW?

Noam: We check whenever the script of the service worker is fetched during registration.

Ben: Based on history, you could have a SW registered prior to CA's instantiation.

Noam: Right.

Noam: There are a few things we don't block: rule of thumb, if the page could `preventDefault()`, we block it. If it's browser chrome (e.g. right-click menu), we don't. Aiming to prevent the page from doing things, not users. But it's a fine line.

...: Custom schemes that don't go through Fetch. `slack://`. We currently don't block those.

Anne: Those can go through Fetch.

Noam: Currently they're not touched in the spec, open issue as to whether it should be.

Anne: Check is presumably early in Main Fetch. Might need to explicitly allowlist certain schemes. That's before we handle `data:` and `blob:`

Ben: Why not at a lower layer?

Mike: The details are better discussed on GitHub. I'm hoping to get extra feedback, and things may need to shift around.

Noam: Several open issues on the specification. Custom schemes (#40), `client.navigate()` (#27), Context menus (#5), several others.

Branden: Embedded-enforcement: Use cases for iframes, and can't always rely on the iframe choosing to opt-into the policy. LLM, other dynamic content, want to enforce requirements from embedder.

...: Similar to CSP:EE. `<iframe connectionallowlist="...">`. `Sec-Required-Connection-Allowlist` header to advertise the requirement. Then embedded document either responds with the same or a more-restrictive.

Ben: What does more-restrictive mean?

Mike: We don't try to parse the regex. 

Aram: Why does the child have to consent?

Artur: Could break the page in ways that are security-relevant.

Anne: We don't want one origin to be able to alter the control flow of another origin.

Dan Veditz: Even same-origin.

Ben: If I have an iframe embedded in a thousand parents, I can't just copy from all thousand of the.

Anne: There's a request header.

Aram: Could do that on the edge.

Ben: Iframe could publish "these are the domains I expect to connect to."?

Brandon: There's also a CORS-like header that allows acceptance of the delivered policy.

Ben: Just worried about adoption in the ecosystem if there's a tight coupling.

Noam: Not a tight coupling. Just need to make sure the URLs you care about are allowed. 

Anne: If the iframe isn't usable if it can't connect to A, it might want to do something useful. Parsing the incoming header doesn't seem great. Would be nice if you could declare "I need to connect to A." It's potentially expensive to parse that header. But maybe the subset matching is good enough.

Freddy: Use cases?

Aram: I don't think this is something that can be applied to an ads use case. Control is too limited, ads ecosystem is too broad.

Tom: Already CSP:EE. We don't implement it. Haven't gotten any requests. Also not interested.

Aram: Too broad in some case, too linited.

Mike: [somethign about agents and their frames] 

Aram: That use case makes sense. I worry about th

[scribe's network connection died]

Double-iframe sandboxing.

Aram: Safe-frame has failed for reasons. But I guess if agents need it, it's a thing they need.

Ben: 
    
Mike: The original reason I wrote CSP:EE was for ads. It never got used. There are limited circumstances where this is useful. That said, there are a pattern of use cases whwere it is helpful for an embedder to have limited control over things that it embeds. The general pattern is where the embedder can offer requirements and the embedee can choose to accept. Focusing only on connection allowlist is only the tip of the spear. Also useful to consider a broader scenario. 

Aram: I agree that iframe controls are not sufficient. This solves a narrow problem. That's fine. The idea of the embedded entity consenting... while it matches the model for this problem. It's not the model for most of the concerns that people have with iframes. Most of the time the thing you are embedding is not trustworthy. And you have no way to trust or monitor it. Not an objection to this. If you want this to be tip of the spear, it should be tip of the spear for iframe controls more broadly. 95% of the use cases - you will not get an agreement between embedder and embedee. Ads are a good use case. But not all of them. Here in Europe, embeds of tiktok or twitter don't work without consent. That's the direction we would want to push iframes. 

Ben: The use case I thought of when I saw this. I am a big company, I have many domains that interact, e.g. Salesforce, Google, etc. They embed each other. They want defense in depth. Is that also a fair statement? Gmail embedding Gchat, etc.?

Mike: I think there are use cases in that direction. Not heard requests there. 

aaj: Let's discuss after.
    
Daniel: Another use case beyond chatbots and ads: Proton uses iframes to load emails, and we want to constrain those contexts. Content of the email untrustworthy, but it's loaded by the embedder, with full control over the loading, but wants to enforce certain things (external images, etc). Leak concerns are significant.

...: If loading from `srcdoc`, does the embedded enforcement apply? No headers?

Brandon: `srcdoc` inherits the page policy.

Daniel: Can the srcdoc set its own CA?

Noam: No headers.

???: Could it be hosted on a site, and not the srcdoc?

Daniel: Our domain shouldn't see the content. E2EE protection.

Mike: We adopted a few weeks ago. Will sync w/ Simone to figure it out.


#### Agentic Identification and web monetization

Wilander: We had a research seminar in Germany this summer. Professors, industry representatives, etc. Discussed various things related to web security and privacy. Age of AI, so that came up a lot as well. I hope there can be a group within the W3C where we can talk about these things. Not sure it exists today. IETF is doing things in this space, but I wanted to talk about things that came up there, and notes from a breakout session from yesterday.

...: Demo we saw yesterday identified you via an email address as soon as you visited the page. That's not the same as automatic sign in. That's discussed as "identifying". But also the AI agent identifying itself: what's that? The unique instance of the agent you're running? An AI Make and Model?

...: Typically, identification isn't needed. Overreach. Something leaner might be better. Authentication that it's a genuine AI agent, trusted to behave well. Raises questions about running local agents, etc. Questions around representing a user, or part of a cluster? Private Access Tokens, etc.

...: Authorization: is the agent allowed to access the site at all, site owner might say "I only accept these genuine agents." Or is the agent acting on the user's behalf with its own authoriation, or is it impersonating the user.

...: People here generally have an interest in those things.

...: [Slides] from Dagstuhl.

...: [Technical difficulties.]

...: Breakout session on where we're headed if users use agents to browse ad-funded websites. We had some assumptions about how this would play out: sites funded by ads won't offer content to agents without another way of earning money. May play out like ad blockers "Turn off your agent" or "Pay me some other way" before continuing.

...: We htink agents will be forced to present themselves somehow. Captchas, etc. otherwise.

...: Big players in terms of creating agents will be incentivized to behave well. Contract of some sort in the way sites will be funded, big players will play along.

...: Tail of home-grown agents, though. Not sure how that's going to play out.

...: "You're using me with an agent, that's not my usual thing, now I'm turning off the ad-funded model, you need to sign in."

...: Plausible scenarios: user, agent (inside the browser, or driving the browser), website. Product placement: websites will try to smuggle marketing information to the agent to make it show up to the user. Pepsi ads.

...: Ads might target the agent, not the user, to influence the agent to take action on users' behalf.

...: Agents will show their own ads, and will share revenue with websites.

...: Could imagine some agreement where websites say "This is the ad I would have shown the user. Please forward it to the user." requires impression counting, etc.

...: Agent gets material from multiple websites, synthesizes the response: maybe bidding to the agent on which website shows its ad to the user.

...: Micropayments? Finally?

...: Most likely from this group: agents will show ads, with revenue share back to websites.

...: Not a message from Apple: just my notes from the breakout session at Dagstuhl. Lots of smart people, interesting to explore.


#### Streaming SRI

Yoav: [Slides]

Yoav: Streaming SRI. Then I heard that it was somewhat discussed yesterday? This is my motivation for why we need this. Backstory: JS Modules are great for authoring content, but less great for delivering content. Long-lived pain point.

...: Previously, I worked on this in the context of Web Bundles to better-deliver JS modules for execution. Web Bundles are no longer among us, but essentialy we have ES Module Declarations that TC39 proposes, which accomplishes more or less the same thing for JS modules.

...: Rough prototype that enables this kind of declaration to get streaming execution, performance benefits: download time is used for execution, roughly subtracted from the overall time.

...: [Slide with bogus syntax]

...: SRI complicates this, as it hashes the whole response, which breaks streaming execution. Multiple options: MICE. Martin mentioned it yesterday.

MT: Can share a newer version of that.  https://martinthomson.github.io/chic/draft-thomson-httpbis-chic.html

Yoav: New content encoding where you have an initial hash, then hashes along the way for the missing pieces. Downsides from my perspective is the new content encoding, might complicate deployment.

MT: Right, can be a problem with things that don't properly deal with content encodings.

Yoav: Right. Otherwise great. Doesn't need to be module aware, seems like a good option if we can deploy it.

...: Or we could make up a new integrity mechanism where the HTML has a hash of hashes, header containing hashes for fixed-sized chunks. Downside: very large header. Limitiations on chunk-size.

...: Or import maps to reference the internal modules to have a large import map with integrity of submodules. Could split into multiple bundles, might be better for perf.

Ben: Large import maps: problem with ordering? Delaying large maps, but needed for streaming execution? Need to know the ordering.

Yoav: you need the maps before the thing you want to stream. Needs to be first. MICE seems like the best option. Deployability is unclear.

MT: Challenge is real. Content coding in theory works. If all the content codings are understood, they're all decoded, and it's fine. Practice hasn't really been tested. People use one encoding, and it's usually compression.

Yoav: Took Brotli a while.

MT: That might have shaken out some of the problems. Thing that concerns me is having two of these involved: compression seems necessary along with the integrity checks. A nice thing, though, is that even without SRI, you can serve the same content for everyone. There's a little overhead, but no difference in what you serve. Though you need to negotiate anyway to see who supports this header.

Yoav: Would be interesting to see what experiements we could run to see whether CDNs handle it correctly. Why MICE, now?

MT: Performance penalty for WAICT is quite large. Need to handle image decoding, etc. Generic, incremental integrity seems necessary for those use cases. Been sitting around for years, this proposal is ~18 months old. May speak to the relative urgency. Not sure we have stats on the performance penalty of SRI. What's the cost of delaying incremental parsing?

Yoav: All the benefits of the prototype are erased without streaming SRI.

Anne: Prototype?

Yoav: Using ES Module Declaration ~clone, delivering modules in reverse order so it can execute when it's downloaded. Requires changes to HTML, probably opt-ins, etc. Prototype.

MT: Our implementation of JS generally treats each file as a single unit, operates on it as a file all at once. Some basic parsing on the whole thing.

Yoav: Modules: you can simulate them being different files.

Anne: Question is: if they're separate files, what the added value?

Yoav: They're not. A single file has a pile of modules in it.

MT: Nice thing about new MICE is that you can align the integrity check boundaries to the edges of those modules. Variable length. You can release when it would be useful to release. Progressively-rendered image could do the same.

Mike: Behavior of integrity violations?

MT/Yoav: Everything that passed would execute. First 5 chunks are valid, and they'd execute. 6th chunk is invalid, and it would die at that point.

Anne: don't you need the whole module graph?

Yoav: Yes. That's why we'd need changes to HTML, opt-ins, etc.

MT: In theory, oyu could build it in a reasonable way.

Anne: Dynamic imports, sure.

MT: Also have this problem with inline JavaScript in HTML. Some will execute before you finish loading the rest. WAICT might introduce integrity for documents.

mkwst: I think there are good use cases for document integrity.

MT: I like the general capability. I think it makes sense. But tricky to ship.

Yoav: Yeah. Maybe we can chat about how we'd run an experiment to determine whether MICE is a viable option.

Anne: Would be interesting to see perf numbers.

Yoav: I can give you those from the prototype.

Anne: Comparing a large JS file with SRI today vs large file with incremental JS.

Yoav: Currently, I don't think it'll matter. But streaming execution of bundles would make a big difference, as execution happens in parallel with download. Larger the download, the more time you're saving.

Anne: Why were decisions made to have things be atomic as they are now. Breaking that might be possible, but need to understand.

Yoav: Opt-in. Not trying to change that by default.

Anne: Either way, would be good to know why. Might be hard to A/B?

Yoav: Could be. But future JavaScript?

Anne: Could do it with CSS? Might be a more fair test.

MT: Particularly with large stylesheets.

[Yoav/MT will get together to think about experimentation.]

???: Could this apply to web extensions as well? 

Yoav: Seems applicable.

#### A "Cors all the fetches" Document-Policy

Yoav: [Slides]

Yoav: No CORS is no good. But developers have no easy way to get CORS on their subresources. CSS used to not have anything, now we have something, but it's still not the default for many different things. Third-parties loading content, or another team on yoyr site, there's a risk of no-CORS resources.

...: I'm interested in this because we're moving things in the measurement space to being CORS-bound. I'd like to enable developers (me) to change the default. `default-cors-mode=anonymous` could help. Could also add `none` as an option if someone wants to downgrade? I don't have a use case...

...: For reporting mode: retries are probably the only way to do it. If a load failed with CORS, it would retry without. Not really report-only, would have production implications. [Syntax flashed on screen].

Simon: If there's a downgrade option, it's not enforced.

Yoav: It's just changing the default. And in practice I don't think anyone would set the downgrade option unless they really have to.

Anne: Use cases? We had use cases for exposing more information about resources, would require CORS, but we still decided to reduce the information collected from those resources.

Yoav: `content-type` in Resource Timing. Restricted to known resource types, but also locked behind CORS. `transfer bytes`, same thing.

Noam: Not only metrics: stylesheet not CORS, no metrics for subresources loaded from the stylesheet at all. Scripts sanitize errors, etc. It's quite a few things.

Yoav: Compression dictionaries.

Anne: Those seem reasonable. The measurement thing tingles spidey senses.

Yoav: This doesn't change anything about measurements, it's just defaults. When running a platform, you don't have control over developers' HTML, and lots of developers are out there, and they'll do unexpected things.

Ben: You could polyfill this with service workers?

Noam: Could polyfill with mutation observers, but not Service Worker.

Ben: Could flip to CORS in the service worker, then pass the response back? Just saying it's an ergonomics question.

Noam: Would get a no-cors request in the SW, make the CORS request for them, then pass along the response and the relevant data. Can't get the outcome in the document, though.

Yoav: You can polyfill this to pay the price of enabling CORS, but without the benefits. Not an exciting proposition.

Ben: Fair.

Noam: Maybe the opt-in doesn't need to be all-encompasing. Maybe URLPatterns, destinations, etc. to avoid breakage?

Yoav: That would make things more complex.

Anne: Feels niche. A boolean seems nicer.

Tom: CSS images: are there other cases where it's impossible to set the CORS flag?

Yoav: `cross-origin=omit` isn't available. But I don't have a use-case for it.

Anne: Right, that's not a thing.

Yoav: I think CSS was the last hold-out. We should have the possibility today.

mkwst: Any concerns about document policy? There are probably other things we could use it for.

[Crickets of approval]

mkwst: Great.

#### Agentic Security (Part I): Shared threat model for the web (for security agents)

Mike Taylor: https://github.com/user-attachments/files/34024787/TPAC.2026.Talk.-.miketaylr.recvfrom.pdf 

...: Less about web platform APIs, more about using agents to look for bugs. In browsers, but also in APIs and specs. Some framing: exponental growth in bug reports and fixes landed. I assume it's the same everywhere.

...: We've been doing a lot of this since March. Scanning the browser, finding many classes of bugs.

...: Extending this to the broader web platform: how can we take what we've done and share it with other interested people. How can we learn from other folks engaged in this work? How can we add this kind of thinking to the web standards process in general? Rules, techniques we can embed in specs? In web platform tests?

Andrew: To make this more concrete: agentic vulnerability discovery. Building a harness to find bugs at scale. Start with researcher agents: tasked with digging through certain areas of code. We feed in ideas about bugs we think could be found, with some curation. You set these agents off, they come up with findings. We want to make sure the findings are validated, not slop. Pass the results to a validator/critic, verifies source locations in code, compares against a threat model. In Chrome, we have a huge FAQ, and also `security.md` files explaining threat models for certain code locations. For further validation, we pass validated findings to an agent that builds a PoC,then we pass the finding and PoC to format a bug report and file the bug.

...: Here, interesting to talk about how we use specs, standards, etc to create inputs into these pipelines. Generating research topics: could avoid doing that. Just give the agent a file and tell it to look for bugs. Or break the file up into pieces and give them to agents. That works. but what we found useful is to go into the git history, look at prior bugs, and build topics based on what we find there. This is useful if you have a project without a written threat model. You can get a sense of the model from the code.

...: You can go into the code's libraries (//base, //net, etc) and have research agents figure out the invariants the code expects. Double-free, for instance. We built these invariant catalogs on a code level. Pretty successful. Specs could help generate these as well.

...: We haven't done this exactly, playing with the idea: you can create a SKILL that surveys a spec for a set of security invariants. Documents them.

...: Could do this for a range of things. Conformance. Privacy. Etc.

...: Useful over time, as the specs change you can regenerate the catalogs of invariants.

...: Prototype run: built a SKILL, tried it on a few specs. This is what it could look like: [example of invariant from Fetch with some spec text and metadata about the enforcement and impact of violation].

...: Shouldn't focus too much on this specific thing. Generated, not battle-hardened, etc. Just the idea of the shape of what we could build.

...: Looked retroactively to see if any of the invariants from our test run would have helped. Seems helpful.

...: Analysis: for Chromium, <1% of topics we fed in were from specs. In the experiment, we took those bugs and mapped them to the invariant catalogs. We found that ~60% of the bugs we'd found mapped to invariant catalog entries we came up with. Lots of clustering: some bugs were prevalant across the codebase.

...: Also interesting things in Fetch. ORB, for instance.

...: A non-scientific takeaway is that a spec-based approach works similarly-well. Could be worth pursuing further. Followon: how could we make this more available? Space in specs for making specs more clearly listed? Spec skills?

Mike Taylor: A lot of the work we've all been involved in is looking over lots of C++. In theory we're inventing new APIs that are forward-facing: how we do take advantage of agents to ship safer APIs with fewer bugs.

Andrew: Discussion!

Freddy: Fixing vulnerabilities, vs fixing specs? What was the split?

Mike Taylor: We've found both. More implementation-specific. Tension between discovering a vulnerability that requires a spec change: how do you protect users quickly, while also publicly talk about, debate, 12-months later merge a PR? Probably 99% implementation/1% spec, based on nothing but vibes.

Andrew: A process might help for cross-browser/spec issues. But folks are just trying to survive at the moment.

Ben: The invariant catalog: is that something you commit? Seems like a compressed version of the corpus. Would be interesting to know that a new invariant was produced after landing a change to a spec. "You've created a new invariant: did you intend to do that?"

Mike Taylor: There are things that look like this on various people's computers. I don't think any of this has been comitted publicly. Still experimental and researchy. Wondering whether it's useful for other people, and where we would stick it if it was. "Security Considerations" section that's actually good?

Ben: For Chromium?

Mike Taylor: Not today, but we could?

Ben: Would be good to avoid drift.

Andrew: We don't do anything automated with this today. We do have `SECURITY.md` files in the codebase today. Human led, but if we see many bugs in a particular area, then the people triaging those bugs, folks will change the `SECURITY.md` file to refine the bug finding.

Mike Taylor: You can look at those file in the Chromium codebase. We rely on the code owners to do that. Would be ideal for it to live in maintained web specifications.

Yoav: Updating specs takes a year? That's unclear. Maybe we need a fast-track for this kind of bug. Reported non-publicly, similar to what browser engines do.

Johann: We saw this happen for cookies. Reported to many vendors at the same time, and we just CC each other. Would be ideal to have a better way.

Freddy: WHATWG does that today.

Anne: GitHub repo has a securty tab and security issues. One limitation: admin only, but the admins can copy the relevant people. That is a good place. We already use that.

Johann: IETF? W3C?

Simone: W3C will publish a draft for this topic. Can enable more broadly.

dveditz: TC39 has a similar process. Industry-wide: CERT? Heavy-handed process.

Mike Taylor: We should coordinate in a private space so we can update as quickly as possible. These processes exist.

Anne: Security reports. They work. Curious about the invariants. They seem to restate spec text. Maintaining that in parallel seems like extra work. Not sure about accuracy.

Mike Taylor: Spec text is good, but models are non-deterministic. We've found it to be helpful to feed invariants.

Anne: Feed invariants of the spec?

Andrew: Could have agents rebuild the invariant catalog when there's a spec update. Could have evals that look at past bugs to give you some level of certainty to understand potential regressions.

Anne: If this comes with more people, then sure, let's do it. But if not, let's not.

Artur: lots of things in the platform that are load-bearing that aren't captured in specs. For example, `parser-inserted` is load-bearing for CSP. That relationship is implicit and in our heads. Broader questions of capabilities: CSS has certain boundaries, it shoudn't execute script, etc. We have implicit knowledge of these boundaries, and ask questions about them when folks have new proposals. So, how do we capture these security assumptions/invariants? Do we allow agents to extract them? Pool our knowledge as humans?

Mike Taylor: Andrew's asked agents to do this for the web platform. They'll come up with a theory, but it's unweildy.

Johann: Worried about extra work for humans? Or maintenance? I'm also worried about the up-front work. But if we put the text in the spec, and when you update the spec, you also update the invariant. That seems solvable to me, but the initial set of assumptions is very hard.

Anne: Human cost is not upfront and fixed. Maintance is also concerning.

Mike Taylor: To Artur: point is valid. Looking at Fetch: agent got confused about ORB.

Simon: Filing spec security bugs: do we want the researcher to file a bug against the spec? How could we achieve that? 

[Technical difficulties]

Noam: The gap is in someone pushing for the spec fix rather thanposting the bug and hoping. Not the researcher or the tool, but the person assigned to fix the bug. Subject matter expert in the area where the bug occurs. I can file bugs aginast HTML for the HTML parser, for instance.

Mike: That seems better, yes.

Noam: If the bot recognizes that this is a spec bug, it can make it easier for the person who's assigned the bug to file that against the spec as well.

Simone: We have some vulnerabilities sent to us. Researchers contacted the vendors for CSS, for example, and also Chromium. If you'd like to triage, I can put you in the loop. Finding someone to fix the bug is the hard part.

Mike: People are reporting vulns to W3C? What's the scope?

Simone: Spec. Sometimes fixing the spec requires fixing the browser too. Recent example: university researchers files a bug against Chrome, and also against us.

BenV: Should these be in the spec? I think there are three things: spec text, maintained alongside the spec; invariants text file in the same repo, updated whenever; or as a convinient artifact we build dynamically however we think we should do it. Maybe that's the right option for the next year and then we move it.

???: Target audience of the invariant catalog? Seems like little value added above the spec text itself for agents? Codifying it in a formal language might be more deterministic.

Andrew: Makes sense. This is just one research idea. Many other shapes possible. We did this on //base in Chromium. Did an analysis about how often the agents reasoned about our invariants. They got it wrong a surprising amount of the time. Extracting specific things the agents should does make things better.

Mike Taylor: We've found that as we discover and fix vulnerabilities, we can write WPTs, find variants, could show you specific WPT things that allow inference about vulnerability. Tighter private communication might be helpful for those cases. Need to avoid N-days on our friends.

Freddy: In the non-web spec security bug area, we're N-daying each other all the time. Also, yes to WPT.


#### Agentic Security (Part II): Gegneral-purpose AI agents running JS with the user's logged-in authority

Johann: [Slides]

Joahnn: AI agents are writing code on websites for regular consumers. Prosumers. That can be a security problem. One specific attack I can point to: Claude in Chrome (but it's a generic issue): attacker goal is to set things up such that a malicious email can prompt-inject Claude to run malicious code on GMail. Essentially account-takeover. Claude has safety classifiers, tries to classify things, so it's not a trivial attack. Running code in that context avoids those classifiers.

...: User says "summarize my email": prompt injection in the email. Visual hints, fake tags for the model to confuse it, and then a command to run `alert()`.

...: `alert()` worked, but other things didn't. Needed to be a little more clever to trick the LLM into doing something more dangerous. Turns out, you can trick LLMs into XSSing the user, which is bad. Especially bad since it bypasses CSP, etc. as an extension.

...: This seems like a problem. What do we do about it?

...: Maybe this is something for the Extensions folks? Also: agents aren't always extensions. Many ways in which scripts can be executed.

...: Isolated worlds are not meant to protect from the user, not the right threat model.

...: Do we need something stronger for agents, and what would that look like?

...: Stronger way of preventing loading external scripts: CSP-like thing? Access to credentials/storage? DOM manipulation? Seems absolutely necessary.

Freddy: These things exist to have access to all the things. I don't think a least-privilege model makes sense. Data exfiltration might be a boundary, but it's hard to specify generically. Problem is in the broad access itself. Executing JS isn't an API. Would be better to have a clear path.

Johann: Responsible agent wouldn't execurte arbitrary code. Sure.

Wilander: Idea floating around from WebKit contributers meeting: I asked AI ask a question to the panel: should we have an AgentView of web pages, representation intended for them, without DOM access, scripting access, etc. could design that representation with a threat model in mind.

Johann: Agents already use a11y trees, etc. includes more than user sees. Could make that so good that they don't need anythign else?

Wilander: We could try to build a new representation intended for agentic use. Doesn't have the risk of a threat model that assumes humans.

Johann: WebMCP becoming more popular might be helpful? I have an agent playing fantasy football for me. Website is weird, need to click on many things, so I can generate a script, my own tool for the ~10 clicks.

Freddy: The buttons are also on the a11y tree. LLM is assistive technology.

Johann: Still takes a while. Need to wait for things to happen. If competitve advantage to executing script, agents will execute script.

Freddy: Only if we expose everything. Maybe we shouldn't.

BenV: Agent is an extension. To deny script execution, you'd have to take it from extensions. That's hard. Ship has sailed. Even with a beautiful alternative, you've just added a single step to the process of hopping to the full page.

Wilander: Maybe we can enforce it.

Simon F: WebMCP is already defining how AI can take actions on a page. If that includes getting data from a page, youy could allow an agent to have full access, or just to the MCP-defined actions on the page. "You can read this email, but you're not getting OTP tokens." managed by website operator.

Johann: How do we communicate this to users? If not MCP tools available on a page, asking about "dangerous mode" sounds difficult.

Simon F: Need a policy to not allow "Dangerous mode"?

Wilander: Why should the same software serve both these purposes? Browser meant for agents, can't become an human browser. They're separate.

Johann: Sometimes that works. But takeover is hard. Sounds like we're not bullish on a "safer" mode? Things are not 100% in the agentic security world. We can rely on frontier models to not mess up more than a certain smart class of users. But these one-shot attacks: model thinks a thing is safe, and then it entirely loses control.

Ben: Seems like pasting into devtools. Maybe that's why Safari doesn't have devtools enabled by default.

Johann: I'll bring a more concrete proposal back to the group at some point.


#### Agentic Security (Part III): Content Trust Markers

Dylan: [Slides]

Dylan: Content Trust Markers. The problem: Browser-use agents: LLMs are succeptable to prompt-injection attacks, tricking the model into taking actions that have effects the user didn't intend. These agents interact with untrusted content all the time, which is a risk to users. Need a way for site publishers to tell agents what content on their site is unsafe: external, untrusted, User-Generated Content, etc.

...: Example: user reviews on an e-commerce site.

...: Why aren't existing solutions enough?

...: `rel` attribute: `rel=ugc` or `rel=nofollow` indicate trust in content. But only defined for a subset of elements, and used for SEO. Don't want to mix concerns.

...: `data-` attributes: forbidden to standardize suffixes.

...: First-party sandboxed iframe: performance overhead. Also harder to index. Require more network requests.

...: Proposing Content Trust Markers: flagging certain sections of a site as `untrusted` (e.g. `<iframe ... untrusted>` or `<div ... untrusted>`).

...: Could provide a justification string provided by the publisher: `untrusted="user product review"`, which could hide the content behind a tool call for agents, with the additional text as context.

...: Could also be used to blur text in screenshots, etc.

...: But we don't want this to be used as an anti-AI feature (e.g. marking the whole page as `untrusted`). We're not being perscriptive. If an agent needs access, it can still request it.

Ari: Mental model: this is most useful for sites with a mix of content. News site with comments, etc. Do you see it as applicable for things like Amazon? Other sites?

Dylan: If a site is mostly UGC, you could use different tags for different sections of the site. Gives agents more context.

Wilander: Wary of the absence of a signal meaning something. What about `trusted`? The browser or agent could know that a site owner has consciously not marked anything as `untrusted` because they believe that, not because they haven't read this spec.

Dylan: Presence of `untrusted` could allow an assumption about the rest. But we could add `trusted`.

Johann: [missed it]

Wilander: Mostly thinking about the presence of a positive signal that could tell youy something more.

BenV: Ari and John's comments: could have more categorizations generally. "1st party", "ugc", "third-party verified", etc. so Amazon can tease apart the subtilties of their content. Richer vocabulary.

Simon: Even when you know that content is untrusted, spotlighting, etc. That doesn't reduce the security risk. Also, what if the user wants to see the reviews? Will still enter the agent context. I don't think the proposal will work in a practical system.

Johann: Idea is that agent consumes content by default. Harmful/untrusted content is hidden by default. This means that for many tasks, it won't see this content, or will get different treatment. Spotlighting works. If the agent needs to show the content, it will make an unsafe tool call. Multi-step things, making a choice to show unsafe content, will take more precautions.

Simon: Don't disagree in general. These all work a bit, but it's all heuristics. Not convinced that it'll make a difference. Assume a review site: agent will make a tool call, still needs to make decisions about links to follow, etc. Maybe this reduces the probabilites in some cases a bit, but I'm not convinced it's worth it.

Anne: We can't trust websites to do the annotation correctly. Not sure what we make of the signal. `autocomplete=off` and we have to ignore the whole thing. Maybe this goes the same way.

Dylan: Not sure if the signal is trusted, because publishers lie?

Anne: Yes.

SimonP: Or maybe untrusted content can set the `trusted` attribute.

Johann: Yes. they could set it because they hate AI. That's something we need to think about. Not 100% clear how to solve that

Anne: Weird copypasta as well. We see that with `autocomplete`. Despite the niceness of the system if we worked together.

SimonP: If we take step back, and the goal is to prevent prompt injection: isn't it better to treat web content generally as untrusted? Wrap it in an ungettable tag, that the agent could use.

Johann: Information is represented to agents in ways different than the way they're presented to users. Tough to distinguish between a comment that says "END COMMENTS" vs an "END COMMENTS" tag. Or "Our comments have moved to XXX." How do we tell the agent which type of "The form has moved" is correct?

Ari: I wonder if there's an anti-incentive for sites to use this flag. Ads and comments are things that would be marked, and might make ad blocker's job easier.
