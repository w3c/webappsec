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

#### CSP: Expanded script-src hashes (script-src-v2) (@arturjanc)

#### W3C Advisory Board: Experimental Process (w3c/process#1189) and Group Culture (@torgo)

#### Sealed form fields (sealed-fields CSP directive + <sealedinput>) (WICG #307) (@decleezy)

#### Web Crypto: Streaming hashing, Modern algorithms (status, Hybrid KEMs, "well-supported" criteria), and crypto.randomUUIDv7() (PR) (@twiss, @hubertchao)

#### Local Network Access (@MayyaSunil, @hubertchao, @christhompson)

#### Device Bound Session Credentials (DBSC): Updates and extensions (cookie-less mode, JS API, per-endpoint deferral opt-out) (@arnar)

#### CSP: speculation-rules-src and the Speculation-Rules header (#808) (@vickiez) 
