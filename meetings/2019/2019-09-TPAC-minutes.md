WebAppSec @ TPAC 2019
=====================

## TOC

* [`Sec-Same-Origin`](#sec-same-origin)
* [Secure Transport](#secure-transport)
  * [MIX2](#mix2)
  * [HSTS Fingerprinting](#hsts-fingerprinting)
* [Continuous Standards Development](#continuous-standards-development)
* [Injection Attacks](#injection-attacks)
  * [Trusted Types](#trusted-types)
  * [CSP](#csp)
* [Authentication](#authentication)
  * [`/.well-known/change-password`](#well-knownchange-password)
  * [`IsLoggedIn()`](#isloggedin)
  * [HTTP State Tokens](#httpsgithubcommikewesthttp-state-tokens)
* [Feature Control](#feature-control)
* [Origins and sites and entities](#origins-and-sites-and-entities)

## Exciting metadata

* **Location**: We're in [Sumire - 3F](https://www.w3.org/2019/09/TPAC/schedule.html#map), starting at 9:00. See you there!
* **WebEx**: [here](https://www.w3.org/2019/09/webappsec-tpac.html)

Attendees:
*  Artur Janc (Google)
*  Balazs Engedy (Google, observing)
*  James MacLean
*  Ben Kelly (Google)
*  Boaz Sender (Bocoup)
*  Brad Lassey (Google)
*  Carlos Ibarra Lopez (Google)
*  Christine Runnegar (PING, co-chair, observing)
*  Christoph Kerschbaumer (Mozilla)
*  Dan Veditz (Mozilla)
*  Dave Harbage (DuckDuckGo, observing)
*  Deian Stefan (UCSD, remote)
*  Dharani Govindan (Google, observing)
*  Eric Lawrence (Microsoft)
*  Hiroki Nakagawa (Google, observing)
*  Hiroshige Hayashizaki (Google)
*  Ian Clelland (Google)
*  J.C. Jones (Mozilla, observing)
*  James Fishback (Wikimedia, observing)
*  Jeff Hodges (Google)
*  Jia Qiang(China Mobile)
*  John Wilander (Apple)
*  Joshua Bell (Google)
*  Kinuko Yasuda (Google, observing)
*  Konrad Dzwinel (DuckDuckGo, observing)
*  Krzysztof Kotowicz (Google)
*  Laszlo Gombos (Samsung)
*  Lukas Weichselbaum (Google)
*  Luu Duy Tung (Canton Consulting)
*  Mark Nottingham (Fastly, observing)
*  Matt Falkenhagen (Google)
*  Melanie Richards (Microsoft, observing)
*  Michael Kleber (Google, observing)
*  Mike West (Google)
*  Nick Mooney (Duo Labs, observing)
*  Philippe Le Hegaret (W3C/MIT)
*  Pranjal Jumde (Brave)
*  RIchard Winterton (Intel)
*  Ricky Mondello (Apple)
*  Ryo Kajiwara (lepidum, observing)
*  Sam Weiler (MIT/W3C)
*  Scott Low (Microsoft, observing)
*  Simon Pieters (Bocoup)
*  Steve Becker (Microsoft)
*  Steven Soneff (Google)
*  Takeru Yamada (ACCESS, observing)
*  Tara Whalen (Google, PING co-chair, observing)
*  Tom Lowenthal (Brave)
*  Valerie Young (Bocoup)
*  W. James MacLean (Google, observing)
*  Wendy Seltzer (W3C)
*  Thomas Steiner (Google, observing)
*  Jeffrey Yasskin (Google)
*  Tsuyoshi Horo (Google observing)
*  Deian Stefan (UCSD, remote)
*  Michael Smith (UCSD, remote)
*  Yutaka Hirano (Google, observing)
*  Dominic Cooney (Facebook)
*  Rowan Merewood (Google)
*  Jeff Jaffe (W3C/MIT)

## Agenda:

## Tuesday, Sept 17th

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

## Thursday Sept. 19th ([Navis C, 1F](https://www.w3.org/2019/09/TPAC/schedule.html#map)) 

* 12:00 - 13:00 - 😋 Lunch 😋
* 13:00 - 14:30 - CSRF / 👻Spectre👻 / XSLeaks
  * [Fetch Metadata](https://github.com/w3c/webappsec-fetch-metadata)
  * Isolation ([Artur Janc's explainer](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/mobilebasic))
    * [Cross-Origin-Opener-Policy](https://gist.github.com/annevk/6f2dd8c79c77123f39797f6bdac43f3e)
    * [Cross-Origin-Resource-Policy](https://fetch.spec.whatwg.org/#cross-origin-resource-policy-header)
    * [Cross-Origin-Embedding-Policy](https://github.com/mikewest/corpp)
  * [Double-keyed (or more) caches](https://github.com/whatwg/fetch/issues/904)
  * Origin-level isolation
  * [Origin Policy](https://wicg.github.io/origin-policy/)
  * Protecting/sandboxing `<iframe>` sites (`history.length`, caches, `window[i]`)
* 15:00 - 15:30 - ☕ Coffee ☕
* 15:30 - 16:00 - Overflow
  * [CORS-RFC1918](https://wicg.github.io/cors-rfc1918/)
  * ...
* 16:00 - 16:30 - Cleanup
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
* 16:30 - 17:00 - Scoping the group, in light of everything above.
    * [Charter](https://www.w3.org/2019/03/webappsec-2019-charter.html) still reasonable?
    * Putting privacy more clearly in scope and make browser privacy policies part of the security review process?
    * Relationship with other groups (TAG, PING, HTTPbis, etc.)
    * Security reviews of upcoming features.
    * Various browsers' launch processes

## Overflow
* CORS-RFC1918
## Minutes:

### Introductions

* Round the room, introductions. (54 people!)

### Secure Transport
##### MIX2

**Carlos**: Mixed Content is bad. Still quite a lot of it. UX for it is interesting. We downgrade the lock; hard to tell what the actual problem is for users. We're trying to push more sites to move away from mixed content. For low-impact mixed content, we're trying to autoupgrade it to HTTPS. If the upgrade works, great. If it doesn't load, we simply fail. No HTTP fallback. Has the impact of blocking non-upgradeable content.
...: Been doing this on Beta for \~3 months now. Pretty successful for `<video>`, fairly unsuccessful for `<audio>`. \~50% success for images (~1.5% of navigations contain mixed images). Current plan for Chrome is to ship upgrades for `<audio>` and `<video>` later this year. Put out a proposal for MIX2.
...: 0.02% of navigations affected. So far, just one bug report. Podcast aggregator site. This might be the biggest problem for the proposal.
...: Plan is to add an opt-out.

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

**Carlos**: Chrome is shipping an enterprise policy that admins can use to opt-out of the policy.
...: Original plan was to ship an opt-out header, Chrome has shifted to an in-browser opt-out that's user-facing, not developer facing. They have a setting to allow active mixed content, we're now interpreting that as "allow mixed content". Used to be a shield in the address bar, will become a content setting.

**Mike**: There are two things we can do for MIX2: adopt [the proposal](https://w3c.github.io/webappsec-mixed-content/level2.html) into this WG. Or we can wait for Carlos's data and see what it says. I would propose we adopt this.
Get feedback from the list, let's make the decision offline, but reaction seems positive here.

No objection in the room.


##### HSTS fingerprinting

**Mike**: one thing HSTS does is solve the problem MIX/MIX2 is trying to solve -- upgrade resources from insecure to secure transport. HSTS is great for preventing SSLStrip-like attacks on navigation (first-party loads), but because of the mixed-content-blocking ordering it does not always work for sub-resources.

**John**: In WebKit, we implemented HSTS in ~2013. Only allowed first-parties to set HSTS. But even so, it was abused for tracking purposes. Links would be changed to take you to their sites and set HSTS pins for various subdomains to produce a tracking ID. ~32 subdomains == 32 bits of entropy. Legible from pages _on any origin_ by making requests and seeing if they fail or are upgraded.
...: Made some changes in 2018 <https://webkit.org/blog/8146/protecting-against-hsts-abuse/>.

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

**Mark**: Maybe something in the charter about how to liase?

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
**Koto (Krzysztof Kotowicz)**: https://github.com/WICG/trusted-types/wiki/W3C-TPAC-2019: Trusted Types aims to mitigate DOM-based XSS. Around a third of the high-severity vulnerabilities in Google products are DOM XSS. For other kinds of XSS, we think we have good answers (strict CSP, etc). DOM-based XSS is still a threat.

...: TT allows developers to forbid calling specific DOM-based execution sinks with raw strings, instead forcing those strings through a policy that produces a "trusted" type. As long as you can guard the creation of policies, and you review the policy code, you can ensure that no DOM XSS is possible.

...: Policies have names, that's how they're identified in the header. One is special: `default`. This is called implicitly if a string hits one of the sinks we care about. It is important for migrating sites, and is very useful as a transitional phase.

...: We've been piloting this API in Google applications for a little while now. Internally at Google, we have something similar (Google Closure Safe Types). We forbid developers from calling DOM XSS injection sinks, asked to call wrappers instead, closure compiler does type enforcement, we do security reviews of the creation points. This is where trusted types started: Internally we're starting to use TT as a layer underneath our existing system.

...: We started seeing a lot of bugs and anti-patterns that code in our application started using. We implemented a report-only experiment, and found a few places where folks have constructed custom script loaders with strange data. Turns out that developers internally were unintentionally bypassing the restrictions we thought we had in place. We also found folks doing strange things with the compiler that violated our expectations about how frontend development at Google ought to work.

...: TT let us discover this fairly easily. Once those holes are plugged, we can enable enforcement, and break frontend developers who are violating that internal policy. Ended up driving a wider refactoring internally to harden various aspects of frontend developement.

...: TT is a web API. We've done external outreach. Usage is landing in React, DOM Purify, lit-html, etc. Working with libraries to discover patterns of adoption. Preparing documentation for developers about how TT be used in existing applications.

...: Made some changes in the implementation over the last few months. We moved to CSP, as it aligns with existing mitigations and solves some delivery problems. Report-only is also a huge win. Defined infrastructure for us, multiple headers, propagation to `about:blank`, etc. Proposed `trusted-script` keyword for `script-src`.

...: Violation reports are incredibly useful. Reports for two things: 1. created a disallowed/duplicated policy. 2. String was passed to a sink directly and default policy doesn't exist, or rejects the value. `script-sample` contains data about the violation, which helps us track them down in the codebase.

...: Since TT is a JavaScript API, you not only have violation reports, but you can set up a debugger statement in a policy to see exactly where the violation occurs and explore the stack. Good workflow for developers, close to their everyday development.

...: Default policy can implement a report-only mode by deciding whether or not to accept the incoming string.

...: Another big change is that we dropped `TrustedURL`. The vast majority of violations in our applications were `TrustedURL` (used for `<a href>`, `<iframe src>`, etc). We only care about those for `javascript:` (at least insofar as we're targeting DOM XSS). Requiring a type for URLs in various applications requires substantial rework, for little benefit, especially if `javascript:` is not used at all. Put together a mechanism that makes it simpler to migrate to TT, even if the app uses `javascript:`.

...: `javascript:` is blocked unless there's a `default` policy, in which case the script content is sent to that callback and can be validated before execution.

...: Open question here: requires `script-src trusted-script`. Considering whether this should also require `unsafe-inline`, can iterate on that.

...: Trusted Type frameworks unblocked some work around `eval()`. Currently, `eval()` is a binary setting: either enabled or blocked globally. For some use cases this is undesirable. Some use cases require `eval()`. This means they need to turn `eval()` on everywhere if they use it anywhere.

...: Trusted Types allows us to more tightly scope this: we can require a `TrustedScript` object when calling `eval()`, and deny direct string execution. Requires CSP opt-in? Could go either way.

...: Metadata API. This allows JavaScript developers ask which type is required for a given sink. This might change in the future when new capabilities are introduced, gives enough context to developers to determine what is protected, and what needs to be processed.

...: We think we're converging on an API shape. Thinking about future developments. Current shape seems useful, allows for so much more. Would be much easier to adopt if string literals could be easily converted to Trusted Types in a safe way. JS doesn't currently provide that mechanism. If we can get a proposal through TC39, we could, for example, construct a trusted type from something that was _literally_ in the source. Could also think about producing policies directly from the browser. Built-in sanitizer, for instance.

...: Perhaps a TT policy that exposes a `script-src` allow-list for a given site. Maybe some magic that allowed per-script capabilities. Allow jQuery to apply a specific policy, don't apply that policy to the rest.

...: TT seems like the right framework for thinking about the DOM and XSS.

...: We have an implementation in Chrome. We have a polyfill. We think the interactions with libraries show fesiability. We've gained real value from the internal experiments.

...: I'd like to migrate this from WICG to WebAppSec.

**Dominic**: If you do a richer API, you run into the templating world. Since the browser has a good idea about when things switch modes (e.g. element -> attribute -> attribute value -> uri), it seems valuable for the browser to take more of a role in that space.

**koto**: We've had folks asking for more trusted types. CSS for instance. Templating was another use case. `eval()` integration was actually proposed by authors. Aiming to prove fesability on this initial set of characteristics. Seems like the right shape that could be extended in the future. Starting with DOM XSS sinks. Come up with a solution that's scalable to security review code for XSS. Of course if the framework is helpful for other use cases, we should be helpful.

**Simon**: Interest from other vendors? Tests?

**koto**: Second first: yes, tests in WPT. First second: I believe Mozilla is moderately supportive. No strong no?

**Dan**: Mozilla is evaluating it. Solves a problem we're interested in.

**John**: WebKit has looked at it. Worry that developers will find a way to break this anyway, but maybe that's fine. Always a little wary when something is complicated and solves problems for big corporations with a lot of developers. We regret that we didn't push back on CSP's complexity earlier, for example.

**koto**: On that note, we're also concerned if that's something that only large corporations can use. I don't think we can achieve 99% adoption, but sites that are under active development, we hope to achieve adoption through libraries. Actively targeting integrations with framework authors, etc. I can compile React with TT support. I can write my applications with React, and if I lock it down, it's TT compliant because React integrates. As soon as I introduce a script that doesn't do TT, this breaks, of course. As long as you use popular libraries, you get support "for free".

**John**: This sounds like an early-warning system rather than runtime defense for 10 years to come. If things break when you do the wrong thing, you fix things and then don't have to use TT?

**koto**: You get most of the security benefits without support from the browser. If you do the work to support enforcement, the same code running in a different browser has the same security properties.

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

**Koto**: I think it's impossible to ban eval() now -- 80% of CSP enable it. A lot of the times it's used safely in frameworks or the like. The approach of banning simply won't fly. Giving developers a way to call eval() carefully is a better approach. You have to call eval() because you need to, not because you always have.
...: more approachable from a developers perspective.

[break for lunch]

## Authentication

### `./well-known/change-password`

**Ricky**: We built a feature in Safari that let users know which websites they were reusing passwords on, and where they were using poor passwords. Goal is to get folks off of bad passwords, and we discovered that we'd have a much better feature if we could take folks directly to the place where they could change their password. Proposed a well-known URL at which they could change their password. Put that [proposal up at WICG](https://github.com/WICG/change-password-url) . Websites have been adopting it: CMS's, GitHub, Facebook, Google, Twitter, a bunch of smaller websites. It's going pretty well.
...: Also thinking about other uses, login page, etc. Happy with the feedback we've gotten so far, and the adoption we've seen.

**Dan**: Supported on non-secure sites?

**Ricky**: Sounds like it's not currently included; please file an issue, happy to take a look? Mitigations in place, taking a user to the right page is arguably the right thing to have something to do.

**John**: Potentially-trustworthy origin is in the spec.

**Dan**: I was looking for "secure".

**Mike**: Yeah...

**Mike**: any objections to adption in WebAppSec for Rec track? Please send us an email

No objections


### `IsLoggedIn()`

**John**: `IsLoggedIn()`. I sent out an email a week or so ago. Hope it wasn't garbled on the list. There's a repo now, will put a formatted explainer there.

...: Not a fully-baked, half-implemented thing. Taking it here to chat about an early idea and get feedback.

...: Trying to get to a place where the browser knows when a user is "logged-in" to a website. Then the browser can do some interesting things.

...: We have some existing things:

...: - Expired: basic/digest auth.

...: - Tired: Manual

...: - Wired: password management credential management

...: - Inspired: webauthn

...: The browser only knows, in the best case, that the user went through some transition. Doesn't know expectations around that, expiration, connection to stateful cookies, logout actions.

...: From a state and storage perspective, you're logged-in by default. There's a bunch of state in the browser. Cookies. Can have an expiry, can be session-bound, but these can last a long time. Weird scope.

...: DOM storage. No expiry. Session storage. Tab scoped. Do adhere to the same-origin policy.

...: Caches. Can't give a guarantee about caches. Expiry. Best effort.

...: Other stateful things. HSTS expires. Media keys don't. Service workers don't.

...: If you just go to a website for a fraction of a second, all of these can be set, some will never expire.

...: I hear from developers that there are legal consequences to the lack of expiry.

...: Accidental Logouts

...: Browsers have no way of helping the user stay logged in. Cookie jar overflows. Cookie header truncation. Periodic website data clearage (ITP for example).

...: These things could all be fixed if we had a trustworthy signal that the user is signed into a website. Help them log in, maintain state, and log out when they want.

...: Straw proposal: [read the email](https://lists.w3.org/Archives/Public/public-webappsec/2019Sep/0004.html)

...: If we tie privilege to this signal (if you get "forever storage" for signed-in users), sites will try to abuse it.

...: We'd need to avoid that for the signal to be trustworthy. A few ideas that might avoid abuse:

...: 1. Only allow setting the bit with modern login mechanisms (webauthn, password manager)

...: 2. Accept manual flows (detected via heuristics)

...: 3. Browser UI actively acquiring user intent. (ex. a prompt saying "This site wants to log you in.")

...: 4. Continuous browser UI highlighting the places where you're logged in. ("This site considers you logged in.") Fights abuse of not calling logout.

...: 5. Delayed browser UI. (ex. Seven days after the site claims you're logged in, "Do you want to stay logged into `news.example`?") 

...: 6. Staying logged in could require continious engagement with a site. Browser can hide credentials, let user reactivate session at some point later.

...: Credential tokens

...: We think we may be able to get away with an `__auth-` prefix. "This is the cookie we care about. It's expiry will control the expiry of the login state." Scope of cookie controls scope of sign in.

...: Then we have federated login. If you're using "Log in with Google", "Sign in with Apple", the site doesn't take the user through the login flow. No signal to gate the ability to set the login bit.

...: Perhaps we could facilitate.
...: On a site A, click "Login with X", you're taken to X. X validates the user intent, and declares its intent to sign the user into A. Now the user's taken back, that site declares its intent to log the user in via X. Need to be logged into the login provider before it can log you into site A.

...: Grandfathering problem: There are already a lot of sites that the user's signed into. How do we allow the sites to set the bit without walking the user through a new process?

...: What's a good value for a cap on sign in length.

...: Set of domains owned by the same organization. First-party sets? Some privacy concerns there, so not baked in, but you could imagine it working.

...: Could envision a full-fledged login API, grabbing tokens, doing the whole process. `IsLoggedIn()` is just a bit right now. There's much more that could be done to facilitate the whole process.

...: That's it!

**Steven**: Hi! PM at Google. Some sites have different levels of login. Bank might have you logged in to do transactions, and then you log out. Has a lower bar for signing you back in later, fraud mitigation, etc.

**Jeff**: Shopping cart.

**John**: We talked about a cap on the storage for a given site. Some sites drop a multi-year cookie. That seems unreasonable. But we don't need to wipe all state upon logout. We could start a timer, and delete if not engaged in some period of time.

**Jeffrey**: Storage folks are talking about expiring boxes of storage. "Box" being a term in the Storage spec, a bit of storage inside an origin.

**Ricky**: Sounds like an abstraction on storage that already exists.

**Jeffrey**: Expiration is a new feature.

**Ian**: Who's in charge of what happens when a user logs out?

**John**: Expiry? Active signout?

**Ian**: Both.

**John**: User can clear website data all the time anyway. So sites need to deal with that.

**Carlos**: Browser UI. Have you thought at all about how to distinguish that from the indicator that you're signed into the browser itself.

**John**: I'm not a UI designer. It's an abstract concept that we're listing for completeness. The lack of call to log out is an abuse case. We want to mitigate.

**Koto**: Multilogin? Multiple user profiles at the same time.

**John**: There's an affordance for that. Multiple user names.

**Artur**: Google does it like this: you might log into multiple accounts and switch between them. Credentials exist for all accounts, applications recognize who you are for that app.

**Ricky**: It sounds like you might need multiple calls for indicating logging in, and indicate dominant/operating account at that time.

**Koto**: Switching accounts.

**John**: If this API would delete tokens, it would need to know who you're logging out, who you're logging in.

**Koto**: Username field doesn't make sense if a site supports lots of users.

**John**: Persistent signal in the browser?

**Koto**: If you want to display that a user is signed in _as_ a user, you need to know which one it is.

**Tom**: Danger of UI indicator. If it's always visible, no one sees. Did you do any research on session length? Banks log you out after 30 seconds. Other sites until 2038. Risk I see is that folks get used to the indicator.

**John**: No, we don't. Multiple use cases, different expectations.

**Mike**: Quick note that we should assume we'll work out the UI. Not going to standardize it anyway.

**Steven**: Autocomplete for SMS might be a useful signal for sign in, especially in markets where phone numbers are prevalent. Recovery flows are also common. Clicking a link sets some state that sets up a session. Hard cases for heuristics. Passwordless login: Medium, Yahoo Japan. Question about overlap with credential management spec. Notifying the browser about these kinds of sign in are similar to previous use cases.

**John**: It's been a while since I read it. Safari didn't implement because of exposing credentials to JavaScript. I put it in here that I'd like it to be a signal, but I don't know the details.

**Ricky**: Open to feedback on where you see those intersection points.

**Dan**: Clear-Site-Data?

**John**: In the explainer we do explore that. If the state goes away, in any way, that is logging out. Also: if the browser knows you're signed in, it can blow away everything except the auth token.

**Steven**: Why not just require HTTP State Tokens? I like this proposal in general, and it seems like an opportunity to move the web forward.

**John**: There are pockets in our org that are very interested in that proposal. The reason why we bring in "legacy auth cookies" is thinking about the long tail. If we want to have policies around this, it's hard to change things associated with new HTTP headers. Cookies are established, and need to be supported as a legacy option.

**Ricky**: Classic tension about pushing things forward v. meeting existing websites and developers where they are today.

**Steven**: for all the devs who won't implement this (other priorities) what is the result -- their users get logged out more often?

**JohnW**: we need to establish that. Not at first but maybe after some time we say "after 90 days" and later move it up to 30 days.

**Steven**: I worry that people will come back and be logged out where that doesn't happen in native apps, and it will make people think native apps are better

**JohnW**: Brad Hill mentioned that Facebook didn't see a drop-off of their 30-day actives after Safari started expiring unused cookies after 30 days.
...: we don't want the expiry for "logged in" sites to be _more_ strict than for default sites.

### https://github.com/mikewest/http-state-tokens

**Mike**: Cookies are not very secure, and they're not private. What if you had a cookie that wasn't called a cookie? Giving it a new name is a chance to reset expectations even if it's basically the same kind of thing if you squint a lot.

...: generate a session ID on the client and give it to the server, associated with the account on the server. the client remains incontrol. There's no personal data embedded in the token. Client control is valuable.

...: the core idea is that the browser is the thing controlling the session. Explicitly random and generated by the client. We can do things like removing access from JavaScript. We don't have to migrate folks to "SameSite", we can just make that the way this works.

...: I would like state management to be simple, and a straightforward transaction. Not everything is good: performance implications. There are times when having the information sent by the client works if you hit a new server without access to the back-end, but people's servers can figure it out.

**JohnW**: 

**Mike**: for example your load balanacer isn't talking to your database to know where to send you on a subsequent request. If you end up on a new server then it might need to load all yohur information from the database instead of using cached data.

**Jeff**: This would require a lot of server-side changes, re-architecting.

**Mike**: at Google we would use "server-side cookies". Front-end would get your token, look up your "server" cookies and attach them to the requests sent on to other servers. I see this as aspirational. I want cookies to move closer to this proposal, and I want to have a migration path to point people at.

**JohnW**: similar to the isLoggedIn case: set up a migration

**Michael**: In my case if I'm not storing data in cookies I'm using localStorage, but you, John, are using "cookies" to refer to all stored state.

**Johnw**: cookies have particularly bad properties, sending lots of bytes over the wire.

**Mike**: some information would be sent over the wire, but not with every request. Should lead to net bandwidth

[room-too-hot break]

## Feature Control

**Ian**: Feature policy was designed as a generic mechanism for controlling "features" in documents and workers. Where "feature" might be an API, or a particular browser behavior, etc. Control features in a sane, predictable way, where all features are controlled the same way. Shipped in Chrome in 2017; dozens of features. WebKit has a partial implementation. Firefox has an implementation behind a flag.

...: `allow` attribute is widely used. Heavily weighted to allowing things that would be disallowed. `syncxhr` is the big thing there.

...: Heavily tied to permissions. Every permission in the Permission API has a corresponding feature. In Chrome, we've moved to a model wherein permissions are available to the top-level origin, and must be explicitly delegated out of the top-level origin into child frames. When geolocation is requested, for instance, the top-level needs the permission (even if the child would have it in its own top-level context). [Permission delegation](#TODO).

...: Since we launched, we've expanded in a few ways. Reporting violations via Reporting API. Controlling sandbox features via feature policy. New feature types for "performance best practices", for example. Things like size policy that ensures you're not loading images massively larger than their display size. This requires threshold values.

...: We've learned a few things. First, threshold values complicate the syntax, especially in conjunction with origins.

...: Behavior in popups doesn't match behavior in frames for things like permissions.

...: Not every feature has the same security requirements. Permissions turned off in one frame can't be turned on in child frames. Other things like lazy-load might have different characteristics.

...: Splitting this into two specs:

...: "Feature Policy" is a stripped-down variant. Controls things like permissions, and anything that's controlled at top-level and needs to be delegated across an origin boundary.

**Artur**: These cascade by default from a top-level down through child frames, unless explicitly delegated to the child.

**Ian**: I think that's true. We restrict these to boolean values. This set of features is available, everything else needs to be delegated.

...: The other model is "Document Policy". This contains things that may or may not need to be enforced in subframes. Performance charact

...: `Document-Policy` header. Has impact on just the document that sent the header, nothing else by default.

...: `Required` policy on a frame. Similar to CSP's embedded enforcement. Set a policy on the frame, that's the minimum policy everything in the frame needs to meet. If policy not asserted, we treat it as a network error.

...: document policy doesn't affect child documents -- they will need to opt in to that. hard to use sandbox right now because people want to take away features

Explainer: https://github.com/w3c/webappsec-feature-policy/blob/master/document-policy-explainer.md

**koto**: You mentioned that it's similar to CSP. Does the policy flow through `about:blank`?

**Ian**: Yes. Idea is to fit the same model as CSP with regard to inheritence.

**mike**: Should we move to structured headers?

**Ian**: No reason not to use that for document policy. Might not be able to do so for Feature Policy.

**Mike**: Two parsers for FP would be bad.

**Ian**: Also ambigious cases.

**Mike**: How do you decide which to put where?

**Ian**: FP uses the "Powerful features" model. Expectation is that it's a boolean flag. Should be blocked in third-party frames by default.

...: DP is everything else.

**Artur**: Do you intend document policy to be purely restrictive? Or can it also change behavior? This matters for cross-origin interop. If behavior changes, it's weird. Banning something is easier to reason about.

**Ian**: You should be able to set your lazy-load policy, which does change behavior.

**Mike**: Strategy to use FP to deprecate features. Add a feature for a thing you don't like, let folks turn it off.

**Ian**: We've never done that successfully. SyncXHR has a feature, need to explicitly disallow. Don't have a good story about how to change it. If we were doing it again, I'm not sure we'd do it the same way. SyncXHR is the only one that doesn't follow the pattern for powerful features.

**Dan**: Is it used?

**Ian**: AMP uses it. Disables SyncXHR for ad frames. Moving to document policy is an interesting idea. How do we support it in both places?

**Mike**: Do you need to support it in both places?

**Ian**: Maybe not.

**Artur**: Integrated with Reporting API? Report-only mode?

**Ian**: Yes, FP is integrated today, expectation that DP would as well.

**Koto**: I didn't see that in the spec.

**Ian**: I think there's a reporting explainer in the repo explaining the other header.

**Artur**: I would love to see this, and love to see us extend the set of features through more legacy APIs. `javascript:` URLs. Lots of legacy behaviors that surprise developers and cause risk. Would be nice to prevent developers from using them as an opt-in. First step towards switching the default. Google would use.

**John**: Are you suggesting a broad flag like "modern". I'd like a "Will my site work in 5 years?" flag that opts-into the vision of how the web should work.

**Ian**: We've thought about bundling features like that. It would be nice to be able to do that. Must be careful that we don't do the same thing we did with sandbox. Changing the meaning of a word over time is hard to do.

**John**: Sure. `modern2020`, `modern2022`, etc.

**Koto**: For `javascript:` in particular, this is a specific anti-pattern that causes security issues. Lets us target it without all the complexity of CSP. Having that would be pretty cool. Bridges the gap between CSP and CSP Next. Complex things that CSP Next has no interest in addressing might fit better here.

**Mike**: Cookies. We talked about it in FP. We talked about it in CSP. Didn't really fit either.

**Ian**: Kinda like client hints? We have an experiment going wherein FP can control client hints. Perhaps this could fit into DP, using origins as parameters. Not really well for FP, where the allow list is about delegation. Controlling access to `document.cookie` might fit in DP?

**Mike**: Hrm. I thought we shipped that.

**Ian**: No. Implications unclear.

**Dominic**: Can you give some background on that policy? How much is it about performance?

**Ian**: Sync access to cookie store is, in fact, slow. Could replace with the async cookie API. Other folks just want to block access to cookies entirely.

**Artur**: Spectre. Reading cookie brings it into your address space, and makes it available to attackers.

[break]

### Origins and Sites and Entities.

* ["same site" && schemes](https://github.com/whatwg/url/issues/448)
* [First-Party Sets](https://github.com/krgovind/first-party-sets)
* [Public Suffix List](https://publicsuffix.org/), and [its problems](https://github.com/sleevi/psl-problems/)
* [DNS Administrative Boundaries Problem Statement](https://tools.ietf.org/html/draft-sullivan-dbound-problem-statement) 

**Mike**: last topic is sites/organizations/origins. we see "origins" as the only real security boundary, but there other weird features like Cookies. And lately we're interested in features where a larger grouping of origins are related as a "site". We've defined a notion of "Site" in the SameSite cookdefinition.

...: cookies need to know the context of 1st and 3rd party, but something on the same "site" are considered 1st party even though not same "origin". Confused and conflicting definitions abound

**Mike**: I'm in favor of using origins as boundaries, and moving away from "sites" toward origins. If we need to keep using "sites", however, I want to lock down a formal definition of it.

**Artur**: I like origin as the boundary. But we need to make affordances when locking things down that have previously been possible, CORP for instance. We can't expect that requests will be same-origin, given history. That's still a valuable concept.

**John**: I wonder if the major problem of the "site" concept is the "e" in "eTLD"? "Real TLD or go home." Would that work as a boundary?

**Jeff**: That will never work. People have lots of reasons and usecases for wanting to denote things as "delegation-centric" domains undeneath the ICANN-managed set of TLDs. The size of the (misnamed!) PSL is an indication of the number of folks who have such use cases. [DNS Administrative Boundaries Problem Statement](https://tools.ietf.org/html/draft-sullivan-dbound-problem-statement) is a worthwhile document to read on this topic. IMO, it needs to be addressed at the DNS level, not HTTP level.


**dveditz**: Similar to Jeff; the PSL for all its warts was invented to solve a real problem that we were having. I wouldn't want to expand same-origin DOM access beyond an origin, but there is a desire for conglomerations of entities. PSL might be the wrong mechanism to do so, maybe Affiliated Domains or First-Party Sets would be better? But there's a need for the functionality.

**Mike**: See Ryans document about the problems with PSL and a possible shape of a replacement. [PSL problems](https://github.com/sleevi/psl-problems/)

**Mike**: would like to find a mechanism that is more declarative by origins than the current globally-defined PSL.

**Sam**: We, of course, aren't the only people who think this is an interesting problem. People in the IETF are interested in rebooting DBOUND to try to solve this problem again. One proposal: https://tools.ietf.org/html/draft-brotman-rdbd-02

**John**: Two things: Ryan's document is a good read in this space. Alludes to freezing the PSL. "From here on we're not going to support it?" Second thing: might be abuse of the PSL in the future that we just have to reject. As a comparison, we had to come up with a solution: something on the table was to scrap dynamic HSTS list and only go with preload. If we're in that situation, we might not have time to fix the PSL.

**Michael**: PSL is giving up capabilities you otherwise have. 

**John**: There are places in which it does grant capability.

**Mike**: For instance, Let's Encrypt rate-limiting.

**Brad**: Ryan isn't saying we should freeze the _content_ of the PSL as it is, but that we should not build new features on top of it. Assuming we have another similar mechanism.

**Jeff**: In specs, we wave a vague hand and say "You should treat this pattern differently. For example, the PSL." CA's all have distinct lists. Browsers have their own lists. It's "Good Enough", but no one is spending time to fix it.

**Brad**: That said, freezing the PSL is a good idea.

**Jeff**: There's a proposal floating around that address some issues. Using DNS; run a job periodically as things are populated in the DNS, seed into the PSL via that mechanism. E.g.: https://tools.ietf.org/html/draft-sullivan-domain-policy-authority

**Mike**: If we can move to HTTPStateTokens then the need for the PSL for cookies isn't there. The notion of first and third party would be independent of the PSL because the tokens are origin-bound.

**Artur**: Wanted to bring us back to the non-PSL bits: "same-site" is not really tied to the PSL. We've built it into specs.

**Mike**: Cookies are tied to the PSL. Subdomains are all assumed to be in the same administrative domain.

**Artur**: We need a "site" concept for the kinds of interactions that currently happen today in the "same-site" world that we have today. Many mechanisms that depend on it today.

**Mike**: I agree that we are using and need a mechanism to define sites. Should be opt-in.

**Jeff**: Doing things in the context of the web and stuff is probbaly fine as long as we view it as a near-term solution. Someone needs to work on the long-term solution. Otherwise we have skew between web and other things. DMARC, etc.

**Mike**: there are a variety of proprietary solutions. Google has one internally (for example the password manager). Apple has one. Mozilla has one for their tracking protection (youtube isn't blocked on a google domain, but is in other contexts, for example)

...: I'd like to take the things that are web-facing and specify something that can get browser interoperation.

**Jeffh**: Recognize that it's a transitionary solution. Need a real solution for the broader internet context.

**Mike**: My question is whether this is a topic that we should be doing here, as opposed to elsewhere.

**John**: Static list or dynamic list?

**Mike**: I don't care?

**John**: Dynamic will be gamed. I want to look at what folks have created.

**Mike**: I lied. I care. I'd _like_ a dynamic list. But if we can't get it to have reasonable properties, I'd accept a purely static list.

**Brad**: First-Party Sets would be reasonable to specify as origins and not eTLD+1 if we didn't already have the PSL. Also, one mitigation is to require a certificate to be minted for all the origin in a set.

**Mike**: FPS aiming at WICG? Maybe migrate here? Idunno.

**John**: Some affiliations are fairly well known. Apple/iCloud. Google/YouTube. Folks understand. Others are unknown to practically everyone. Mergers, consortiums, etc. Google/YouTube might be a happy-path view of this. Folks won't know about media conglomerates.

**Mike**: [Said interesting things.]

**Artur**: I tend to think in terms of narrow security features like `X-Frame-Options`. Some other features could have different use cases. Hard to reason about the characteristics of a given affiliation proposal. For example, "same-site" means one thing today. It would be nice if it didn't radically change in the near future, as that changes the security properties of the proposal.

**Brad**: Different amounts of information that can be shared across some entity boundaries. Oauth => { lots, of, things }, which might surprise users. Probably wouldn't wind up as a prevalent tracker.

**Mike**: We'd need to treat all folks in an affiliation together for things like ITP.

**John**: Could have different impacts on things like ITP: Don't count towards being classified as prevalent, don't block cookies to each other, count user interaction on any as counting for all of them. Mixed set of signals about what affiliation would mean.

...: Doesn't have to be "privacy stuff". Could also relax things like preflight. Perhaps you know what you're doing across your own domain names. Socket coalescing. Http cache partitioning.

Artur: I think this all makes sense, but the more functionality we put on top of this, the fuzzier the security story becomes. It might be perfectly ok for `google.com` and `youtube.com` to count together as having user activity, but for CORS we probably don't want that. Different levels of trust within a group.

John: I'm not in favor of redefining the "site" concept to include sets. Should be "origin", "site", and "set" as distinct things.

Michael: That requires killing the PSL.

John: But the PSL solves other things. Like cookies.

Mike: But we shouldn't have cookies.

John: That will take until 2045!

Mike: I'll be alive. They shouldn't be.


## Queue















