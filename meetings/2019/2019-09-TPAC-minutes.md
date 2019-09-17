 
WebAppSec @ TPAC 2019
=====================

## Exciting metadata

* **Location**: We're in [Sumire - 3F](https://www.w3.org/2019/09/TPAC/schedule.html#map), starting at 9:00. See you there!
* **WebEx**: [here](https://www.w3.org/2019/09/webappsec-tpac.html)
* Attendees:
  * Artur Janc (Google)
  * Balazs Engedy (Google, observing) 
  * James MacLean
  * Ben Kelly (Google)
  * Boaz Sender (Bocoup)
  * Brad Lassey (Google)
  * Carlos Ibarra Lopez (Google)
  * Christine Runnegar (PING, co-chair, observing)
  * Christoph Kerschbaumer (Mozilla)
  * Dan Veditz (Mozilla)
  * Dave Harbage (DuckDuckGo, observing)
  * Deian Stefan (UCSD, remote)
  * Dharani Govindan (Google, observing)
  * Eric Lawrence (Microsoft)
  * Hiroki Nakagawa (Google, observing)
  * Hiroshige Hayashizaki (Google)
  * Ian Clelland (Google)
  * J.C. Jones (Mozilla, observing)
  * James Fishback (Wikimedia, observing) 
  * Jeff Hodges (Google)
  * Jia Qiang(China Mobile)
  * John Wilander (Apple)
  * Joshua Bell (Google)
  * Kinuko Yasuda (Google, observing)
  * Konrad Dzwinel (DuckDuckGo, observing)
  * Krzysztof Kotowicz (Google)
  * Laszlo Gombos (Samsung)
  * Lukas Weichselbaum (Google)
  * Luu Duy Tung (Canton Consulting)
  * Mark Nottingham (Fastly, observing)
  * Matt Falkenhagen (Google)
  * Melanie Richards (Microsoft, observing)
  * Michael Kleber (Google, observing)
  * Mike West (Google)
  * Nick Mooney (Duo Labs, observing)
  * Philippe Le Hegaret (W3C/MIT)
  * Pranjal Jumde (Brave)
  * RIchard Winterton (Intel)
  * Ricky Mondello (Apple)
  * Ryo Kajiwara (lepidum, observing)
  * Sam Weiler (MIT/W3C)
  * Scott Low (Microsoft)
  * Simon Pieters (Bocoup)
  * Steve Becker (Microsoft)
  * Steven Soneff (Google)
  * Takeru Yamada (ACCESS, observing)
  * Tara Whalen (Google, PING co-chair, observing)
  * Tom Lowenthal (Brave)
  * Valerie Young (Bocoup)
  * W. James MacLean (Google, observing)
  * Wendy Seltzer (W3C)
  * Thomas Steiner (Google, observing) 
  * Jeffrey Yasskin (Google)
  * Tsuyoshi Horo (Google observing)
  * Deian Stefan (UCSD, remote)
  * Michael Smith (UCSD, remote)
  * Yutaka Hirano (Google, observing)
  * Dominic Cooney (Facebook)
  * Rowan Merewood (Google)

## Agenda:

## Tuesday

* 9:00 - 9:15 - Introductions, problem statements, framing the next day and a half.
  * Artur Janc's ["Baby Steps Towards the Precipice"](https://www.arturjanc.com/usenix2019/) is helpful reading.
* [Deian will dial in at some point to discuss [`Sec-Same-Origin`](https://docs.google.com/document/d/1wKWuN61MIY5AZYNeR2JQ1MB6A1Bmj0k3RFJVh1ktufw/edit#)]
* 9:15 - 10:00 - **Secure Transport**
  * [MIX2](https://w3c.github.io/webappsec-mixed-content/level2.html)
  * HSTS fingerprinting: [Apple's mitigations](https://webkit.org/blog/8146/protecting-against-hsts-abuse/), [Strict-Navigation-Security](https://github.com/mikewest/strict-navigation-security)
    * [Requiring `Secure` for `SameSite=None` cookies](https://mikewest.github.io/cookie-incrementalism/draft-west-cookie-incrementalism.html#rfc.section.3.2)
    * [Should origins with distinct schemes be considered "same site"](https://github.com/whatwg/url/issues/448)
    * RFC6797bis?
  * Intranet / Internet: is [CORS-RFC1918](https://wicg.github.io/cors-rfc1918/) the right goal?
* 10:00 - 10:30 - [Continuous specification](https://www.w3.org/wiki/Evergreen_Standards) ([plh@](https://github.com/plh), [wseltzer@](https://github.com/wseltzer))
* 10:30 - 11:00 - **☕ Coffee**
* 11:00 - 12:15 - **Injection**
  * [Trusted Types](https://github.com/WICG/trusted-types) ([@koto](https://github.com/koto)) - [Summary for TPAC](https://github.com/WICG/trusted-types/wiki/W3C-TPAC-2019)
  * ["Strict CSP"](https://csp.withgoogle.com/docs/strict-csp.html) && [CSP Next](https://github.com/mikewest/csp-next)  
* 12:15 - 13:30 - 😋 Lunch 😋
* 13:30 - 14:45 - **Authentication**
  * [`/.well-known/change-password`](https://wicg.github.io/change-password-url/index.html)
  * [`IsLoggedIn` API](https://lists.w3.org/Archives/Public/public-webappsec/2019Sep/0004.html) ([@johnwilander](https://github.com/johnwilander))
  * [HTTPStateTokens](https://github.com/mikewest/http-state-tokens)
  * [Credential Management](https://w3c.github.io/webappsec-credential-management/)
* 14:45 - 15:30 - **Feature Controls**
  * [Feature/Document/* Policy](https://www.w3.org/TR/feature-policy/) ([@clelland](https://github.com/clelland))
    * [Cookie Controls](https://github.com/w3c/webappsec-feature-policy/issues/85)
    * [`<meta>`](https://github.com/w3c/webappsec-feature-policy/issues/55)
  * Protecting/sandboxing `<iframe>` sites (history.length, caches, window[i])
* 15:30 - 16:00 - ☕ Coffee ☕
* 16:00 - 17:00 - **Origins and Sites and Entities, oh my.**
  * ["same site" && schemes](https://github.com/whatwg/url/issues/448)
  * [First-Party Sets](https://github.com/krgovind/first-party-sets)
  * [Public Suffix List](https://publicsuffix.org/), and [its problems](https://github.com/sleevi/psl-problems/)

**Overflow**:

* CORS-RFC1918

### Thursday

* 12:00 - 13:00 - 😋 Lunch 😋
* 13:00 - 14:30 - **CSRF / 👻Spectre👻 / XSLeaks**
  * [Fetch Metadata](https://github.com/w3c/webappsec-fetch-metadata)
  * COOP
  * [CORP](https://fetch.spec.whatwg.org/#cross-origin-resource-policy-header)
  * [COEP](https://github.com/mikewest/corpp)
  * Double-keyed (or more) caches
  * Origin-level isolation
  * [Origin Policy](https://wicg.github.io/origin-policy/)
* 15:00 - 15:30 - ☕ Coffee ☕
* 15:30 - 16:00 - Cleanup
  * Moving CRs to Recommendations: 
    * [Referrer Policy](https://www.w3.org/TR/referrer-policy/)
    * [Secure Contexts](https://www.w3.org/TR/secure-contexts/)
    * [Mixed Content](https://www.w3.org/TR/mixed-content/)
    * [Upgrade Insecure Requests](https://www.w3.org/TR/upgrade-insecure-requests/)
  * Getting to CR: 
    * [Clear-Site-Data](https://www.w3.org/TR/clear-site-data/)
    * [Credential Management](https://www.w3.org/TR/credential-management/)
    * [Embedded Enforcement](https://www.w3.org/TR/csp-embedded-enforcement/)
  * Should we obsolete [UI Security and Visibility API](https://www.w3.org/TR/UISecurity/) in favor of [IntersectionObserver v2](https://w3c.github.io/IntersectionObserver/v2/)
* 16:00 - 17:00 - Scoping the group, in light of everything above.
    * [Charter](https://www.w3.org/2019/03/webappsec-2019-charter.html) still reasonable?
    * Putting privacy more clearly in scope and make browser privacy policies part of the security review process?
    * Relationship with other groups (TAG, PING, HTTPbis, etc.)
    * Security reviews of upcoming features.
    * Various browsers' launch processes

## Minutes:

### Introductions

* Round the room, introductions. (54 people!)

### Secure Transport
#### MIX2

**Carlos**: Mixed Content is bad. Still quite a lot of it. UX for it is interesting. We downgrade the lock; hard to tell what the actual problem is for users. We're trying to push more sites to move away from mixed content. For low-impact mixed content, we're trying to autoupgrade it to HTTPS. If the upgrade works, great. If it doesn't load, we simply fail. No HTTP fallback. Has the impact of blocking non-upgradeable content. Been doing this on Beta for \~3 months now. Pretty successful for `<video>`, fairly unsuccessful for `<audio>`. \~50% success for images (\~1.5% of navigations contain mixed images). Current plan for Chrome is to ship upgrades for `<audio>` and `<video>` later this year. Put out a proposal for MIX2. 0.02% of navigations affected. So far, just one bug report. Podcast aggregator site. This might be the biggest problem for the proposal. Plan is to add an opt-out.

**John**: Scripts? When we originally discussed this, there was a worry that scripts we were blocking would be loaded.

**Carlos**: We decided not to upgrade scripts.

**John**: We already won that one, was hard-earned. Shouldn't back off.

**Dan**: Between HSTS, we decided that MIX would run first, and HSTS would only run afterwards. The idea was to not give folks mysterious failures based on user navigation habits. If we're planning on upgrading anyway, perhaps we could try HSTS first?

**Jeff**: What do you mean?

**Dan**: I'm saying we do HSTS first; translate the URL to HTTPS, then try to load that.

**Mike**: Something...

**Carlos**: We do have a plan to move ahead with images, but nothing else at the moment.

**Dan**: I know this thing is restricted to this one bit, perhaps we should look more broadly at other types and take HSTS into account.

**John**: When we discussed this last time, we discovered a weird quirk in HSTS for redirects. HSTS redirects generally happen before MIX for redirects because of implementation details and locations in which things are upgraded.

**Mike**: before we move on to HSTS in general, any other thoughts about the MIX2 doc Emily sent to the list? 

**John**: Enterprise? Do we need to talk about that?

**Carlos**: Chrome is shipping an enterprise policy that admins can use to opt-out of the policy. Original plan was to ship an opt-out header, Chrome has shifted to an in-browser opt-out that's user-facing, not developer facing. They have a setting to allow active mixed content, we're now interpreting that as "allow mixed content". Used to be a shield in the address bar, will become a content setting.

**Mike**: There are two things we can do for MIX2: adopt [the proposal](https://w3c.github.io/webappsec-mixed-content/level2.html) into this WG. Or we can wait for Carlos's data and see what it says. I would propose we adopt this. Get feedback from the list, let's make the decision offline, but reaction seems positive here.

No objection in the room.


#### HSTS fingerprinting

**Mike**: one thing HSTS does is solve the problem MIX/MIX2 is trying to solve -- upgrade resources from insecure to secure transport. HSTS is great for preventing SSLStrip-like attacks on navigation (first-party loads), but because of the mixed-content-blocking ordering it does not always work for sub-resources.

**John**: In WebKit, we implemented HSTS in ~2013. Only allowed first-parties to set HSTS. But even so, it was abused for tracking purposes. Links would be changed to take you to their sites and set HSTS pins for various subdomains to produce a tracking ID. ~32 subdomains == 32 bits of entropy. Legible from pages _on any origin_ by making requests and seeing if they fail or are upgraded. Made some changes in 2018 <https://webkit.org/blog/8146/protecting-against-hsts-abuse/>.

**Mike**: looking at related proposals, things like MIX2 will reduce the scope of the problems. Another proposal floating around is to do [something with SameSite cookies](https://mikewest.github.io/cookie-incrementalism/draft-west-cookie-incrementalism.html#rfc.section.3.2), such as defaulting to SameSite, and requiring SameSite=none to have the secure flag so they aren't sent over insecure transport.

gjvkgucddfellickjflddknfcghcunih...: in the past it was common to have single-signon...?

https://github.com/whatwg/url/issues/448 "Consider introducing a "same-site" concept that includes scheme"

**Mike**: there's "actual" same-site and schemeless samesite.

[Strict Navigation Security](https://github.com/mikewest/strict-navigation-security)

**Mike**: Stop doing upgrades for sub-resource requests on insecure pages. Still do upgrades on navigations. Thoughts at the bottom of the document. Curious about interest in the room. Time for an update to the HSTS spec and push through a draft? If there's interest, what IETF group would work on it (original group was disbanded)

**John**: For HTTPS pages, autoupgrade all mixed content. For HTTP pages, you're not upgrading subresources (and we won't send cookies because they must be marked `Secure`)

**Mike**: worse than status quo connections we could have upgraded with HSTS won't be, but better than status quo because [??]

**John**: In the imaginary update to the spec, could we say: "Regardless of how the browser decides not to send cookies, it needs to do so in order for this to happen."
...: There's some outstanding work in IETF that we're on the hook for. Not sure we can take this on right now.

**Mark**: Not huge sensitives about where this ends up. Don't think anyone would be sad if it ended up here rather than there.

**Jeff**: The right people need to know what to pay attention to.

**Mark**: Maybe something in the charter about how to liaise?

**John**: We don't need to restart that group?

**Mark**: No.

[ Jeff: Update RFC6797 with one page saying "Go over here." -- just a thought wrt how to manage cross-SDO spec evolution...? ]




### Sec-Same-Origin

**Deian**: [`Sec-Same-Origin`](https://docs.google.com/document/d/1wKWuN61MIY5AZYNeR2JQ1MB6A1Bmj0k3RFJVh1ktufw/edit#). Trying to eliminate CSRF, anything resulting from an unexpected cross-site request. We have lots of mitigations out there, but they don't really work unless you're a large company. Folks fall back to tokens, nothing else really works.
...: We have a proposal that tells the server who's talking to it. `Origin` header meant to address this attack, but failed: 1. Doesn't address privacy. 2. Referrer policy. 3. Not with every request.
...: `Sec-Same-Origin` is a simple header that's a `0` if the request initiator is not same-origin, and `1` if it is. A little more detial there, but that's the core.
...: `Sec-Frame-Same-Origin`. We care whether the request is going to be loaded in a frame, and whether the frame will be same-origin with its parents.
...: This tells us whether the request is same origin, and allows us to deal with these bugs.
...: `discloseorigin` attribute on frames, discloses the exact origin along with these requests rather than a `0` or `1`.
...: It's a super-simple idea; just telling the server who it's talking to.

**Artur**: Have you followed the [Fetch Metadata](https://w3c.github.io/webappsec-fetch-metadata/) request header proposals? It tries to address a very similar problem in a fairly similar way.

**Deian**: It seems like there's quite a bit of overlap with a few differences.
...: 1. The way we classify an origin as same-origin is a bit different. Should probably be the same in both.
...: 2. `Sec-Frame-Same-Origin` gives a little more information than Fetch Metadata sends.
...: 3. `discloseorigin` is more detailed than Fetch Metadata as well.
...: Presumably we could fold all this into Fetch Metadata.

**Artur**: I do think that the `Sec-Fetch-Mode` header, combined with `Sec-Fetch-Site` gives more or less the same information. Via the combination of these headers, you know whether it's a same-origin or same-site `<iframe>`.

**Deian**: Actually it doesn't. We need to know if the page containing the `<iframe>` is same-origin or not.

**Michael**: Once you have the Sec-Same-Origin/Sec-Fetch-Site/whatever, you can disable sending Origin by default in 90% of cases

**Deian**: We probably don't need to create a new thing if Fetch Metadata exists. If there's already buy-in there, it would be lovely to fold that in.

**Mike**: Please file an issue against w3c/webappsec-fetch-metadata and CC @arturjanc and @lweichselbaum

**John**: Would be nice to talk about default behavior; do you expect folks to opt-in, or is this something that laggards would need to be pushed into? Is this only for high-value target sites?

**Deian**: From our experience porting a bunch of web apps: you can keep using `referer` sniffing and tokens, and just layer this in as additional protection. We implemented middleware for WordPress, just ~100 lines of code, pretty easy to layer in.
...: We can distinguish whether the browser supports this, so the new layer can work only in those new browsers.

**John**: Quickly approaching the situation in which cookies aren't going to be sent in third-party requests. So folks are going to make changes. Perhaps we could force them to change to look at this header as well?

**Dan**: Are you suggsting that a browser makes a request with a `Sec-Origin` header, and if the site doesn't respond in a reasonable way we kill the request?

**John**: Could be a preflight. Could be a CSP opt-in. Many ways to make it work.

**Artur**: One thought I had is that this/Fetch Metadata allows you to distinguish between `same-site` and `same-origin`, which can give additional security.
...: `discloseorigin` seems like a good idea that isn't at all part of Fetch Metadata.
...: In the past, some folks from Mozilla had concerns about exposing the origin. We originally wanted to always send the `Origin` header on every request. Concerns around `referer` leakage, so Fetch Metadata landed on a very coarse enum (`same-origin`, `same-site`, and `cross-site`).
...: Is a markup-level opt-in enough for Mozilla folks?

**Dan**: You can already opt-into this via `referrerpolicy` on `<a>`/`<form>`, and `fetch()`. I don't know what `discloseorigin` is doing above and beyond setting the referrer policy for the request.

**Artur**: So you wouldn't be terribly worried abut this as it's already possible with `referrerpolicy`.

**Dan**: I'd like to make sure we're not duplicating it for no reason.

**Deian**: `discloseorigin` is trying not to tie things to referrer policy. We'd want to disclose origin even if referrer policy says not to for this specific request.

**Mike**: Dan is talking about the `referrerpolicy` attribute.

**Dan**: Not objecting to this if it's offering something different, want to make sure we're not duplicating things.


### [Continuous Standards Development](https://www.w3.org/wiki/Evergreen_Standards)

Slides: https://docs.google.com/presentation/d/1jKiPIrbIH6RdJE15nYWA-xr1DDVuYAeurpfhu6Dug-c/edit#slide=id.g5e27cbf49c_0_0

**plh**: Lots of discussion in the past ~18 months about evergreen standards.

...: Background is: Can we improve the current REC track?

...: If you work on a neverending technology, you need to revise your specifications quickly. REC track doesn't allow that easily.

...: Pinpointing a point in time at which you have everything at REC status is hard.

...: Lots of paperwork, etc.

...: Patent commitments. Only happens at REC. Calls for exclusion, etc.

...: If the doc never reaches REC, you get nothing.

...: Earlier this year, we agreed on a different model with WHATWG, which is an interesting model.

...: Many kinds of WGs in W3C. Some work to REC, some don't.

...: Closer to the core => more likely to prefer "living standards".

...: We need to secure commitments earlier, reduce overhead, rapidly upgrade, etc.

...: Still a commitment to "wide review".

...: Ship something in this space for Process 2020.

...: Earlier, there was a proposal for "evergreen". Mixed feelings. CG developed another proposal to change REC track.

...: Not exclusive. Can be done at the same time if we like.

...: Modifying REC is appealing for some. It's what I'll focus on here.

...: First, we need to fix the patent policy. Crazy to iterate for years without patent commitments.

...: Calls for exclusion are sent at periodic intervals. We want commitments at that point.

...: Today we send one after FPWD. We'd like it to be the case that after ~150 days, you have royalty free commitments on that draft.

...: But, took 3 years to change a document license. Perhaps an alternate track would be faster?

...: AC might, however, be more willing to change the patent policy than we thought.

...: Survey opened in August, ending 30 September, to see how far we can go changing the patent policy.

...: One idea is to issue calls for exclusion more often. Maybe we want to do this for each working draft as well.

...: 1. We want to streamline routine CR update approvals. Tool that could do all of the paperwork for us.

...: In 90% of the cases, CR updates are approved; should just automate it away.

...: 2. Decoupling CR updates from CR review drafts.

...: When do we send the calls for exclusion? Not going to send for every commit. Perhaps we could have "review snapshots" against which calls for exclusion could be issued.

...: Still have to demonstrate wide review to trigger a call for exclusion. Don't have to resolve all issues, of course, but need to show wide review/support.

...: 3. Modifying a REC.

...: If we want to fix an error that's substantive, we have to go all the way back to CR -> PR -> REC.

...: Create an errata model instead.

...: 4. Allow updates with new features as well as bug fixes.

...: 5. Dedicated registry process. Not terribly relevant for this group.

...: Groups that aren't terribly interested in REC can begin getting patent commitments at CR. For some that's a good thing, models a "living standard" as the CR can be updated at will. For some others, they want the forcing function that the CR is actually implemented and signed-off on. Big advantage is getting patent commitments earlier.

...: For horizontal groups, it will increase the frequency at which you'll ask for wide review. Some of the additional strain can be resolved via tooling.

...: Don't want daily snapshots for patent commitments so as not to overload lawyers. ~3 months, ~6 months. Haven't settled on that yet.

...: Similarly, we won't allow changing REC every week. May have rate limits here as well.

...: Earlier commitsments for implementers. Official specs reflect current WG thinking. Improved maintenance for REC.

...: Alternate track: concept is to avoid touching the "sacred" REC track and freaking out the AC, modifying the patent policy, etc. Got feedback that the additional statuses would be confusing, and that it doesn't fix the REC track. If we agree that the REC track is broken, we should fix it rather than inventing a new one.

...: I'd like to understand what this WG wants so we can take that back to the AC.

...: Still a need to document substantive changes. Ways to do that easily by adding keywords to commits in GitHub. CSSWG specs have a summary of the change between drafts. That's really helpful for reviewers.

**mkwst**: anything that makes the process eaiser is good for us. Would be valuable to be more closely aligned with Living Standard. Not clear to me what changes. 

**plh**: SWWG doesn't care about recs. they want to be able to update docs. SO they like this, stay in CR forever.  Some other groups want to get to Rec. Lets them get to rec and continue to iterate. 

**mkwst**: historically, we haven't been that interested in getting to Rec, as demonstrated by our recent specs. Patent commitments are useful, but Rec not so much.

**wseltzer**: if your lawyers are interested, send them to PSIG

**mkwst**: patent commitments earlier are good. I'd be happy if EDs got commmitments. CR seems fine so long as we can continue updating. 

**plh**: if you want to trigger a snapshot and commitments, you need to show you've done wide review

**mkwst**: understand that would be the case at whatever level you want commitments.  Who evaluates whethe rthe review is wide enough?

**plh**: Director. If the horizontal groups sign off, that makes it easier.

**mkwst**: personal perspective, this seems like a good direction

**jeffh**: +1

☕☕☕

Back at 11:00.

### Injection Attacks

#### Trusted Types

https://github.com/WICG/trusted-types/wiki/W3C-TPAC-2019
**Koto (Krzysztof Kotowicz)**: https://github.com/WICG/trusted-types/wiki/W3C-TPAC-2019: Trusted Types aims to mitigate DOM-based XSS. Around a third of the high-severity vulnerabilities in Google products are XSS. For other kinds of XSS, we think we have good answers (strict CSP, etc). DOM-based XSS is still a threat.

...: TT allows developers to forbid calling specific DOM-based execution sinks with raw strings, instead forcing those strings through a policy that produces a "trusted" type. As long as you can guard the creation of policies, and you review the policy code, you can ensure that no DOM XSS is possible.

...: Policies have names, that's how they're identified in the header. One is special: `default`. This is called implicitly if a string hits one of the sinks we care about. It is important for migrating sites, and is very useful as a transitional phase.

...: We've been piloting this API in Google applications for a little while now. Internally at Google, we have something similar (Google Closure Safe Types). We forbid developers from calling DOM XSS injection sinks, asked to call wrappers instead, closure compiler does type enforcement, we do security reviews of the creation points. This is where trusted types started: Internally we're starting to use TT as a layer underneath our existing system.

...: We started seeing a lot of bugs and anti-patterns that code in our application started using. We implemented a report-only experiment, and found a few places where folks have constructed custom script loaders with strange data. Turns out that developers internally were unintentionally bypassing the restrictions we thought we had in place. We also found folks doing strange things with the compiler that violated our expectations about how frontend development at Google ought to work.

...: TT let us discover this fairly easily via the default policy mechanism. Once those holes are plugged, we can enable enforcement, and break frontend developers who are violating that internal policy. Ended up driving a wider refactoring internally to harden various aspects of frontend developement.

...: TT is a web API. We've done external outreach. Usage is landing in React, DOM Purify, Lit, etc. Working with libraries to discover patterns of adoption. Preparing documentation for developers about how TT be used in existing applications.

...: Made some changes in the implementation over the last few months. We moved to CSP, as it aligns with existing mitigations and solves some delivery problems. Report-only is also a huge win. Defined infrastructure for us, multiple headers, propagation to `about:blank`, etc. Proposed `trusted-script` keyword for `script-src`.

...: Violation reports are incredibly useful. Reports two things: 1. created a disallowed/duplicated policy. 2. String was passed to a sink directly without a default policy. `script-sample` contains data about the violation, which helps us track them down in the codebase.

...: Since TT is a JavaScript API, you not only have violation reports, but you can set up a debugger statement in a policy to see exactly where the violation occurs and explore the stack. Good workflow for developers, close to their everyday development.

...: Default policy can implement a report-only mode by deciding whether or not to accept the incoming string.

...: Another big change is that we dropped `TrustedURL`. The vast majority of violations in our applications were `TrustedURL` (used for `<a href>`, `<iframe src>`, etc). We only care about those for `javascript:` (at least insofar as we're targeting DOM XSS). Dropping `javascript:` from various applications requires substantial rework. Put together a mechanism that makes it simpler to migrate to TT, even if the app uses `javascript:`.

...: `javascript:` is blocked unless there's a `default` policy, in which case the script content is sent to that callback and can be validated before execution.

...: Open question here: requires `script-src trusted-script`. Considering whether this should also require `unsafe-inline`, can iterate on that.

...: Trusted Type frameworks unblocked some work around `eval()`. Currently, `eval()` is a binary setting: either enabled or blocked globally. For some use cases this is undesirable. Some use cases require `eval()`. This means they need to turn `eval()` on everywhere if they use it anywhere.

...: Trusted Types allows us to more tightly scope this: we can require a `TrustedScript` object when calling `eval()`, and deny direct string execution. Requires CSP opt-in? Could go either way.

...: Metadata API. This allows JavaScript developers ask which type is required for a given sink. This might change in the future when new capabilities are introduced, gives enough context to developers to determine what is protected, and what needs to be processed.

...: We think we're converging on an API shape. Thinking about future developments. Current shape seems useful, allows for so much more. Would be much easier to adopt if string literals could be easily converted to Trusted Types in a safe way. JS doesn't currently provide that mechanism. If we can get a proposal through TC39, we could, for example, construct a trusted type from something that was _literally_ in the source. Could also think about producing policies directly from the browser. Built-in sanitizer, for instance.

...: Perhaps a TT policy that exposes a `script-src` allow-list for a given site. Maybe some magic that allowed per-script capabilities. Allow jQuery to apply a specific policy, don't apply that policy to the rest.

...: TT seems like the right framework for thinking about the DOM and XSS.

...: We have an implementation in Chrome. We have a polyfill. We think the interations with libraries show fesiability. We've gained real value from the internal experiments.

...: I'd like to migrate this from WICG to WebAppSec.

**Dominic**: If you do a richer API, you run into the templating world. Since the browser has a good idea about when things switch modes (e.g. element -> attribute -> attribute value -> uri), it seems valuable for the browser to take more of a role in that space.

**koto**: We've had folks asking for more trusted types. CSS for instance. Templating was another use case. `eval()` integration was actually proposed by authors. Aiming to prove fesability on this initial set of characteristics. Seems like the right shape that could be extended in the future. Starting with DOM XSS sinks. Come up with a solution that's scalable to security review code for XSS. Of course if the framework is helpful for other use cases, we should be helpful.

**Simon**: Interest from other vendors? Tests?

**koto**: Second first: yes, tests in WPT. First second: I believe Mozilla is moderately supportive. No strong no?

**Dan**: Mozilla is evaluating it. Solves a problem we're interested in.

**John**: WebKit has looked at it. Worry that developers will find a way to break this anyway, but maybe that's fine. Always a little wary when something is complicated and solves problems for big corporations with a lot of developers. We regret that we didn't push back on CSP's complexity earlier, for example.

**koto**: On that note, we're also concerned if that's something that only large corporations can use. I don't think we can achieve 99% adoption, but sites that are under active development, we hope to achieve adoption through libraries. Actively targeting integrations with framework authors, etc. I can compile React with TT support. I can write my applications with React, and if I lock it down, it's TT compliant because React integrates. As soon as I introduce a script that doesn't do TT, this breaks, of course. As long as you use popular libraries, you get support "for free".

**John**: This sounds like an early-warning system rather than runtime defense for 10 years to come. If things break when you do the wrong thing, you fix things and then don't have to use TT?

**koto**: You get most of the security benefits without support from the browser. If you do the work to support enforcement, the same code running in a different browswr has the same security properties.

**John**: Sounds more like an IDE thing.

**koto**: Also interested in that!

**Mike**: Runtime protection gives you defense against the things you haven't tested.

**Dan**: I'm happy that large corps have adopted CSP. That was always a goal. I don't think it's complexity that's holding CSP back. It doesn't help, of course, but we always hoped that libraries and entities like Blogspot and Wordpress would adopt, and then we're covering lots of people's content. I don't think we need to shy away from features that large corps can use. Small sites have difficulty adopting anything. Doing breaking changes by default is breaking, not going to fly.

**Artur**: If you look at where web users have their data, and where they spend their time, it's skewed towards places where CSP is actually used. If there's XSS to an origin to which you're not authenticated, it doesn't have access to your data. If the end result is that big sites adopt a mitigation, we have substantial effect on user safety. Of course, more adoption is great, and library integrations help.

**John**: Complexity drives two things: barrier to entry, and getting it right. Folks have CSP, but it's a bad CSP.

**Dan**: Always the problem. Crappy applications are hard to secure.


### CSP

https://csp.withgoogle.com/docs/strict-csp.html

**Mike**: CSP is compext. We have patterns that are more implementable, such as Strict CSP. It is viable, we've seen large corps adopt and looks like smaller ones could. You can label scripts you intend to run, but injected scripts don't get your lable. Autor has talked aobut how it has been deployed at Google.

**Lukas**: simplify CSP by setting nonce on scripts rather than a complex allow-list. For external reports to Google of XSS this approach mitigates 60% of them, and the remaining is mostly DOM XSS that Trusted Types intends to address.
...: `strict-dynamic` is super important for this. we have a fallback to try to address browsers that don't support it but it only goes so far. Explaining the fallbacks to devs reintroduces the complexity.

**Artur**: we have 85 new applications in last half year. 50 got it automatically through frameworks and 30 did it manually with little effort. Developers don't even need to touch it if it's done this way in the framework.

**Mike**: Google tends to care only about XSS mitigation and not about other parts of CSP. Facebook, for example, doesn't care much about XSS but is very concerned about containment. These are two very different things. Wrote up a thought experiment that splits these two approaches into different places.
...: the spec is currently not getting maintained, and I'm uninterested in doing a "CSP4". Can we extract things out of CSP that are targeted at specific use-cases? Would love feedback on this brief proposal.

https://github.com/mikewest/csp-next

**Mike**: most interesting to me is "scripting policy", simple option is the default. There's more stuff for flexibility.
...: Is this worth it? introducing a simpler thing that more people can understand might be a win. Assuming we have this thing that already works [CSP] is it worth doing the work of simplifying this into a new thing that basically does what we already have?
...: thoughts on two options vs continuing?

**John**: I've always been in favor of breaking this apart. I try to convince people to use the scripting bits, they go to the CSP document and get confused and sad. Grievences with CSP1/CSP2/CSP3. No versioning. If we're going to do this, we should have a level as an attribute in the policy. Then you can send out a bunch, and the browser can pick the one it likes. Should we call this something with "Security"? We like the word "Security", developers don't like it. I've advocated "architecture", that might be better.

**Dan**: "Content policy"?

**John**: The label makes folks less inclined to use it. If we could not support `eval()` at all, I'd be happy.

**Lukas**: I agree, but, if you have an application that has a single use of `eval()`, you can't deploy until you refactor, and refactoring may be impossible. We see lots of XSS elsewhere, not much XSS in `eval()`.

**Artur**: I like the idea of making things simpler, will be better for everyone. If it's not going to ship in all browsers soon, then developers who want to enable these restrictions will need to set both mechanisms and keep them in sync. This will increase complexity until major browsers adopt the new feature. Only then can folks get rid of CSP. Is it worth it? That's somewhat contingent on it actually shipping.

**Dominic:** Facebook would like to ban some things, like cross origin window.frames.length. We would probably be fine if the specs are refactored provided there's a way to pursue confinement stuff.

**Yutaka**: There are some cases where we fail to implement CSP correctly. I'm not a CSP expert, hard to assess risk of breakage. Does this simplification make browser devleoper simpler.

**Mike**: Yes and no. More or less the same hooks.

**Lukas**: it's a problem what different browsers support, but if you have CSP2 support already the backend for this probably already exists. The CSP 1-2-3 evolution with complex fallbacks needs to be avoided

**JohnW**: eval makes me grumpy. We've talked about gating some features (e.g. credentials) on having a CSP. "OK, then I'll have a wide-open policy". SO then way say you have to have a "sane" policy.

**Mike**: some libraries like ember use eval() because it has unique features that nothing else does. We have some TC39 proposals that may eventually fill those needs but for now they need to use eval()

**mnot**: from talking to people with websites of varying sizes I think this would be good. They don't understand the complexity of CSP or which guide to use and no confidence they are getting the security they want out of it. A saner simpler feature would be advantageous.

**JohnW**: <strict-dynamic parsing?>

**Rowan**: this sounds like it might be something that fits into Feature Policy instead? what is the difference.

**Mike**: this sounds like Scripting Policy to me

**Artur**: like most people here I dislike eval(), but when we ban it we find things like angular reimplementing eval() in javascript. So now we still have eval-like behavior but no way to turn it off globally. Developers will use the thing they want to use.

**Koto**: I think it's impossible to bad eval() now -- 80% of CSP enable it. A lot of the times it's used safely in frameworks or the like. The approach of banning simply won't fly. Giving them a way to call eval() carefully is a better approach. You have to call eval() because you need to, not because you always have.
...: more approachable from a developers perspective.

[break for lunch]


## Queue



















