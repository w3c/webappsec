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
* [CSRF / 👻Spectre👻 / XSLeaks](#csrf--spectre--xsleaks)
  * [Fetch Metadata](#fetch-metadata)
  * [COOP/COEP/CORP Explainer](#coep-coop-corp-explainer)
* [Double-keyed Caches](#double-keyed-caches)
* [Origin-level Isolation](#origin-level-isolation)
* [Origin Policy](#origin-policy)
* [`<iframe>` leaks](#protecting-iframe-leaks)
* [CORS-RFC1918](#cors-rfc1918)
* [Cleaning up oooold documents](#old-documents)
* [Working Group Scope](#working-group-scope) 
* [AOB?](#aob)

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

### Secure Transport

#### MIX2

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


## Day 2

### CSRF / 👻Spectre👻 / XSLeaks

#### Fetch Metadata

**Artur**: Impetus for much of this are side-channel attacks like Spectre. What mechanisms could we build into the web to protect from these bugs? Seems strange to build web features to compensate for CPU bugs. Wondered if we could build things that worked with the web, and give better isolation guarantees independent from Spectre itself. See also ["How do we stop spilling the beans across origins"](https://www.arturjanc.com/cross-origin-infoleaks.pdf).

**[lweichselbaum@](https://github.com/lweichselbaum)'s [Fetch Metadata Slides](https://github.com/w3c/webappsec/blob/master/meetings/2019/2019-09-TPAC-lweichselbaum-fetch-metadata-headers.pdf)**

**lwe**: I work in a team at Google that deploys all the web platform features WebAppSec is constructing. We have a lot of frameworks in which we can try these mechanisms out, want to share our results.

...: Fetch Metadata allows servers to protect themselves from cross-origin attacks. CSRF, XSSI, timing attacks, clickjacking, spectre, etc.

...: The browser sends information about the request's context in HTTP headers. Server can make security decisions based upon this context.

...: Shipping in Chrome 76. Getting actual user data in our products, we can try a few different policies and see how they behave in practice.

...: Three headers:

...: `Sec-Fetch-Site`: Which website generated the request? `same-origin`, `same-site`, `cross-site`, `none`

...: `Sec-Fetch-Mode`: The request [`mode`](#TODO link to fetch)

...: `Sec-Fetch-User`: Is this request the result of a user gesture?

...: [examples]

...: Resource isolation

...: Isolate your resources on the server by denying requests you don't expect. For example, block all `Sec-Fetch-Site: cross-site` requests. Possible exceptions for cross-site non-state-changing request, or a navigation, or for API endpoints that are explicitly expected to receive cross-site traffic. Prevents attacks based on the attacker forcing the loading of a resource into an attacker-controlled context.

...: [code snippets]

...: It might also be possible to build a navigation policy? Niche use case, as it breaks linkability. Might be interesting for super-sensitive applications: admin portal, etc. Those could simply redirect to the entry page rather than allowing direct navigation to sensitive portions of the application.

...: Google internal pilot:

...: Large scale (400+ services and products) experiment.

...: Rolled this out in report-only mode: the server determines whether it would have blocked a request, and reports to itself internally.

...: Promising results: 70% were compatible with the resource isolation policy without any change. Can deploy without much effort for these simpler applications. No CORS-based cross-site traffic, simple policy.

...: For the remaining 30%, we needed to allow access for legitimate CORS / cross-site traffic.

...: Some policy violations were discovered to be due to browser bugs in Chrome's implementation. Sometimes some headers were set, but others weren't. Extensions were an edge case, for instance. HTTPS -> HTTP -> HTTPS also.

...: With these fixed, violations occurred for < 3% of traffic. Need to do more research to determine if it's a bug in browsers, or legitimate traffic we need to support.

...: Would love to see cross-browser support to protect more users.

...: Web Platform Tests to ensure a complete and consistent implementation.

...: <https://secmetadata.appspot.com/> is a playground you can poke at.

...: Overlap with `Sec-Same-Origin`.

...: Can be used to know when you can deploy `Cross-Origin-Resource-Policy`

...: `Vary` headers on `Sec-Fetch-Site` forces separate cache for same-origin traffic.

**ericlaw**: The spec notes that you should set `Vary.`

...: Is anyone outside Google using this? Could use the `vary` header to determine whether that's happening...

**artur**: Some interest from folks working on middleware. Accidentally broke some banks: detected an unknown header, classified it as malicious, etc. Once they figured out what it was, they fixed the bug, and expressed interest in adopting this for security reasons. Also interest from Facebook at one of the XSLeaks meetups. For FB, `same-site` vs `cross-site` granularity didn't give them enough information about whether cooperating sites were sending requests. `messenger.com` and `facebook.com`. 
[sec-same-origin](https://github.com/w3c/webappsec/blob/master/meetings/2019/2019-09-TPAC-minutes.md#sec-same-origin) had some thoughts about opting into sending `Origin` more often. Might be worth looking into.

**yoav**: Talking to Takashi earlier about `Purpose: prefetch`. He mentioned that we could in theory add that to Fetch Metadata. That could be possible once we actually spec this as part of Fetch. Should we?

**mike**: it's not the only request header that exists in the platform in isolation (service worker has one for SW scripts). Makes sense to add that to that framework.

**artur**: In the spec, but behind a flag in Chrome is `Sec-Fetch-Dest`. LEts you know whether the request would be used as a script or a style or etc. LEss critical from a security pov, but that might be a good fit for that.

**yoav**: Not a new destination. Just a speculative request. In the process of being added as another flag in Fetch: https://github.com/whatwg/fetch/pull/881

**dom farolino** Perhaps interesting to add a new destination for speculative loads?

**kinuko**: Prefetch destination could be script 

**Mike**: take prefetch discussion offline and go in more depth later?

**yhirano**: Destination. It's the browser responsibility to add the destination? Or the resource owner's responsibility?

**artur**: `Sec-Fetch-Dest`, right? The browser attaches this header, the server could use it in a `vary` header? It would probably be fine not to have the `vary` header. Most useful for `Sec-Fetch-Site` to distinguish cross-site from same-site requests in the cache and serve the one but not the other.

**zcorpan**: playground has Google internal links. Fix that?

**lwe**: Yes. We should.

**mnot**: From a CDN's perspective, we're interested. Concern will be false positives. Will need input from customers about how to handle these headers for each application. Incentive not to break sites, might slow adoption.

**ianclelland**: Concerned about exposing the fetch mode in this way over the network. Will make it difficult to add new modes in the future. If folks are using this and failing closed if something other than `navigate` and `nested-navigate`.

**artur**: This is a great concern. Had a discussion about how to structure the logic of the policy for unknown values. Might want to fail open if no `sec-fetch-mode` header? Fail closed if unknown? Or the other way around? Doesn't address your underlying concern. Have thoughts on how to fix?

**ianclelland**: HTTP has big chunks of codes set aside. Could do the same here with prefixes? `navigate-*`?

**mike**: File a bug. Let's discuss it there!

#### [Cross-Origin-Opener-Policy](https://gist.github.com/annevk/6f2dd8c79c77123f39797f6bdac43f3e)

**[lweichselbaum@](https://github.com/lweichselbaum)'s [`Cross-Origin-Opener-Policy` Slides](https://github.com/w3c/webappsec/blob/master/meetings/2019/2019-09-TPAC-lweichselbaum-coop.pdf)**

**lwe**: Cross-Origin-Opener-Policy. We need more isolation on the web. Spectre, other attacks that rely upon cross-origin window handles.

...: COOP is a mechanism that provides developers with the ability to break the opener relationship.

...: If COOP values are the same, and the origins of the documents match, then the documents can interact with each other. Otherwise, they can't.

...: [examples]

...: Only applies to top-level documents, not frames.

...: `unsafe-allow-outgoing`, `unsafe-inherit`. These turned out to be important for deployment in practice. The former allows the page to open a window that has a reference to the opener. The latter allows the page to accept any opener's COOP, which allows the site to be used as a popup (e.g. OAuth sign-in pages).

...: Neither of these can be used in combination with `SharedArrayBuffer`.

...: COOP Case Study:

...: Investigated ~50 Google and external sites by creating an extension that tracked `window.open` and interactions with the opened window. Manually interacted with sites and monitored interactions.

...: Confirmed assumptions with Firefox Nightly, which has COOP implemented.

...: [screenshot of logs]

...: Results:

...: 33 instances where `window.open` was called, but no cross-window interaction. Gmail <-> Hangouts used broadcast channel API, didn't use window reference.

...: 3 same-origin window interactions.

...: 15 cross-origin/same-site window interactions. Can't say up front that they would break with COOP enabled, case-by-case.

...: Sometimes the `window` reference was only used to call `focus()`. Might not actually be breakage if that call failed. Others fail completely.

...: Google Play used PayPal, checks `.closed`, then do validation. COOP shows the window as `.closed`, so this integration breaks.

...: Federated sign in. Implementation specific breakage.

...: Conclusion:

...: Majority of sites could adopt COOP without changes. Most don't communicate cross-window.

...: The rest could enable COOP with refactoring (e.g. broadcast channel), policy adjustments (e.g. `unsafe-inherit`)

...: Most common case was federated sign in. Endpoints should set `unsafe-inherit`.

...: Google Play could set `unsafe-allow-outgoing` to open PayPal.

...: Rollouts need to be coordinated across multiple origins/services. Hard for percent-rollouts, no rollback safety, if only one service rolls back. Recommend to enable COOP `unsafe-inherit` before rolling out enforcement.

...: Hard to find the places where the cross-window communication happens. Requires manual evaluating. Would be lovely to have a reporting feature that allows us to roll it out in reporting mode first so we can find the endpoints that break.

...: Can't be safely tested without enforcing it. Will only discover breakage during rollout. Product team won't let you break them twice, so we need to be very careful. Report-only mode would be very helpful.

...: Discussion:

...: Which form of reporting can we support? Report-only? Report breakage? No reporting?


...: [missing]

**annevk**: The match is per-response. A->A -> B -> A it breaks.

...: What to use instead of referecebased cross-window interaction?

**annevk**: whatwg/html -> labels for cross-origin-opener-policy, cross-origin-embedder-policy

**yhirano**: Reporting mode: is there any method for reporting when `window` is called?

**annevk**: There's an issue discussion. Reporting is easy if we only report non-match. It's hard if we need to report on usage, because no one want to hook into the window proxy object.

**jun**: How would you treat CSP sandbox? `same-origin`? `same-site`? Treats site as null origin, not `same-origin`. Looks like same-origin endpoint until you get the response header. Only know after you parse.

**mike**: Seems like we can define it either way in Fetch.

**anne**: Open a bug against HTML.

#### [COOP/COEP/CORP explainer](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/mobilebasic)

**artur**: We started talking about COOP as a mechanism to enable exposing APIs that would otherwise be dangerous. `SharedArrayBuffer`, etc.

...: The doc talks about what we think should work as a mechanism to enable access to these powerful features. SAB is motivating example, but `window.performance.memory` might also fit, and others.

...: The document that gets these capabilities should not be able to load content it doesn't control. Can otherwise access data it shouldn't have access to via Spectre, etc.

...: Need to protect resource loading. Need to ensure you don't share a process with other windows.

...: Need to set `COOP: same-origin`, and promise to the browser (and let the browser enforce) that it doesn't load non-cooperating resources.

...: [Cross-Origin-Embedder-Policy](https://github.com/mikewest/corpp). Implemented behind a flag in Chromium. The implementation has not severed certain communication between realms. We haven't supported shared and service workers.

**anne**: Firefox has COEP behind a flag as well.

**mkwst**: Is this interesting to people? Are you following changes on COOP, discussion on COEP?

**johnwilander**: There are things implemented around COOP, nothing for COEP yet. We're interested in all of this.

**mkwst**: We believe these are both solid. Probably time to move patches to Fetch.

**anne**: Tricky cases around navigate algorithm, browsing context group. Doing refactoring of navigation and agent clusters. 

### Double-keyed caches

**mkwst**: Double-keyed caches. Doing research to understand the performance risk. I personally think we should just accept the risk, but it's not just my decisions.

**anne**: Folks might want to do more than double-key? 

**brad**: We're running experiments with both double-keying and triple-keying. Not seeing much difference between the two. Disables frames from cache-attacking each other. Seems valuable, still evaluating.

**johnwilander**: We've been shipping double-keyed HTTP Cache for 6 years. We measured the hit in 2012, it was ok, and we shipped. It works. We double-key on site, not on origin. If other vendors go with origin, we'll switch as well.

**brad**: We're experimenting with origin.

**kinuko**: I generally like the concept of a partitioned cache. Concerned that the aggregate overhead is fine, but puts a performance penalty on smaller sites.

**annevk**: My main thought is that we don't have an alternative to doing it. XSLeaks attacks are real, and bad.

**kinuko**: Perhaps for very common resources, we could figure out a way to share them across sites? Seems like a good thing to explore.

**annevk**: In principle, sure! We've explored public cahing, but hard to scope it in such a way that it's privacy preserving.

**johnwilander**: Worried about the cache being used for tracking? Or data leakage?

**annevk**: XSLeaks is quite specific. <https://github.com/xsleaks/xsleaks>

**johnwilander**: In 2012, we were mostly concerned about trackers. Now folks are trying to abuse the partitioned cache as well. Revalidating cache entries after 7 days. Wouldn't help against XSLeaks, but does help against tracking.

**annevk**: We don't want A to know that you visit B.

**brad**: XSLeaks is the primary motivator, but also fingerprinting.

**artur**: Thinking about widely-used resources. Any data about the performance loss? I could see a world where 3 resources are loaded on every site, and could exempt them without worry of privacy risk.

**yoav**: How do you determine which resources those would be? How do you not bias against the future 3 resources.

**brad**: Introduces incentives. Insecure version of a library is popular, lose performance by fixing the bug.

**kinuko**: For performance data. Brad's team has loading time performance data. For individual resources, the performance looked different...

**Brad**: 3rd party fonts, ...: Increase in cache miss rate. 30.9 -> 40.3 for fonts. ... for scripts. ... for style. Doesn't result in a statistically-significant change in first-contentful-paint, or other stats we looked at.

#### Origin-level isolation

**james**: Want to do process isolation in Chrome at the origin rather than site level. Performance and security implications.

...: Can't go right there because we'd break cross-origin scripting via things like `document.domain`. That said, we did a pilot in spring, turned on strict origin isolation for a subset of users. Cross-origin scripting isn't as prevalent now as it previously was. Obviously, we can't just turn it on, but there may be individual sites that would want to opt-into this mechanism.

...: How might we set up this opt-in mechanism? We've been thinking about using origin policy to make assertions about the pages on a given origin. "It's totally safe to lock me down to a process for my origin. I'm not going to touch cross-origin pages."

...: Best-effort mechanism delivered via origin policy. Floating that idea, want some feedback generally. Interest in cooperating?

**annevk**: Best-effort for process allocation seems fine, but best-effort for APIs working or not would not be ok.

**james**: Right.

**wanderview**: At a high-level, we'd spec it in terms of user agent cluster, browser could map that to a process.

**artur**: If we could have something in Feature Policy that would guarantee that you're not using `document.domain` via Origin Policy, that might get us there. Would like to be able to make these kinds of declarations for an entire origin.

**annevk**: `document.domain` can't be the thing. SAB still allows sharing cross-site. Need to shift the agent cluster allocation.

**dveditz**: We could totally break things if folks touch `document.domain`. Sites who use document.domain can keep using historical features, but nothing new.

**Mike**: document.domain is used on a lot of sites (like 40%?) but only has an effect on ~3%. Brad Hill has done tremendous work eliminating its use by the Facebook like button which reduced global use by a lot. That dip is all Brad. [graph drops from ~4.5% to ~0.8%]

**johnwilander**: Crazy idea: look at TLS certs. When were they issued? That shows active maintenance?

**yoav**: CDNs are doing the updates.

**annevk**: I'm wondering about something else: if the goal is to have this, can we do it for SAB? Instead of the shared memory scope being the SAB, we'd do a same-origin check.

mike: [something]

**wanderview**: I believe Chromium only supports `postMessage` to dedicated workers for SAB. Perhaps there's not large adoption.

**simon**: How could we lock in wins for `document.domain`? Add a console error. Combined with breaking other things, it might be reasonable. Maybe break sync xhr too.

### [Origin Policy](https://wicg.github.io/origin-policy/)

**Mike**: Origin Policy started as a proposal from Mark Nottingham inclusing a set of headers that apply to the entire Origin. Improved that proposal. The current spec is old, but an important mechanism that can improve both security and performance. Could apply CSP and Feature Policy to all your documents, even the ones you forgot.

...: For performance, CORS preflights are a pain, and we can make that declaration ahead of time. A lot of value in having that config for the entire origin. Mozilla?

**ckerschb**: working on an implementation, not yet in the code base. Looking at caching and fetching. A lot of WPTs that they'd upstream. Thinks it's worth our time.

**Mike**: Chrome has an ongoing implementation. Hopeful it will move forward soonish. A couple of pieces in the spec: First request to origin A, A responds with an origin policy, the browser will fetch the policy and apply it before committing the document. The response can then guaranty that the OP is applied. That's critical for e.g. CSP. That's complicated and we need to change it. There are some cases where it's required, but in some cases, it's not. e.g. logo update that shouldn't block the page rendering.
You can imagine ways of doing this. Currently, it's a version sstring. You can imagine version number. Something along these lines, but you can imagine others.

...: Need to figure out this and integration with Fetch.

...: Otherwise, the version is indicated to the server and can act as a cookie. We need to change that. That may look like the version system from above. Need to do some work.

...: Needs to be keyed along the rest of the storage, as it has the same characteristics of a cookie, as the policies are web exposed. (e.g. can hide uid in CSP eval directives). 

????
...: For CORS, it means that a server cannot declare itself as speaking CORS for all origins. Maybe that's fine, maybe we need something else.

...: The format needs to change. Currently header-based in structure, and we need something that's more declarative in structure. Probably JSON. Would be easier to developers.

...: A lot of work to be done. Some implementation, some spec. Hoping folks would help design and shape the API. Would love to be involved, but if you want to be an editor, call me. File issues and send PRs.

**sam**: How many of these short headers shold be stuffed into the HTTP service record?

**mnot**: None.

**yoav**: I want that server opt-in to be available in the other direction, as an HTML-based opt-in. Multiple sources note that developers have a hard time flipping on HTTP headers and having one that indicates an origin policy would enable them to just changfe a text file.

**mike**: [Interesting things]

**yoav**: Yeah, that wouldn't work for CSP, but might be ok for others.

**annevk**: Can we figure out why that's the case? It's a problem if developers can't do headers. People should fix it instead.

**yoav**: Regarding the scaling comment, OP allows us to make sure it will scale, so folks can flip on OP and then stick all the meta information there.

**annevk**: Only works for HTML responses. What if folks pull JSON or CSS files?

**Mike**: it's in the spec, and that's where double-keying would come in. Chrome hasn't implemented it, but it's in the spec.

#### Protecting `<iframe>` leaks

**Mike**: ads on same-origin (same ad server) can script each other -- they shouldn't. [other examples]

**ian**: Another use case is something like a sandbox barrier that allows it to host frames that are same-origin wth each other.

**annevk**: There are some differences too. Maybe you could make the windowproxy object behave differently, but doesn't affect the named getter or indexed getter. Another factor that wasn't mentioned yet is `history.length`. If one of the frames navigates, the other frame can notice. Can influcence by using `.back()`, etc. One idea we want to experiment with is limiting `.length` to 1, 2 or 2+ the number of times `pushState` was executed? Maybe drop the ability to affect global state from frames.

#### CORS-RFC1918

**Mike**: Old attack, taking advantage of the user's access to local things that the remote site can't reach directly. for example, reaching in and connecting with your printer using a "private" IP address.

...: the suggestion is to say that "local" addresses require CORS preflight. Do a DNS look-up, evaluate what scope it is. If the site and the destination are both "intranet" then fine, but if not send this CORS-like header to check if the request is OK.

...: things like printers won't understand this new request, so things will fail closed. intent is things that can't update like your printer can't be reached by stuff on the internet.

...: localhost servers won't respond, unless they're updated to be aware of these risks.

...: DNS could return both IPv6 and IPv4 addresses, and they might be in different domains. to do this spec you'd have to wait for the connection to see which one was used. CORS used to be in blink, but that involved lots of roundtripping through chromium modules. It's now in the network module.

...: knowing the IP address is critical. However, knowing the IP address for the pre-flight doesn't guarantee that the follow-up request will use the same IP address! What Chrome is trying to do now is a small piece of the CORS-RFC1918 spec. To know which mode to use you need to know the source of the request, so we're going to restrict access to "internal" and localhost addresses from insecure (http:) contexts. Solves a small piece of the problem.

...: interested in what others think, particularly Microsoft [looks meaninfully at ericlaw]

**ericlaw**: MS is interested. Has had things like this in the browser for a while. Security model used to be based on assigning permissions to "Security Zones". Similar kinds of categorizations. IE3ish timeframe. Internet couldn't navigate to the Intranet. Annoying and weird dialogs. These existed through IE's lifetime, but the barrier was a bit permeable.

...: With Win8, we had process isolation on a per-zone basis. We had app container that could sandbox networking for processes. This would drop requests on the floor when making requests from the internet to the intranet. This was good, as it protected things. It was bad as it was a substantial portion of the bugs filed against IE/Edge. Mixed networks; some in corp, some in prod.

...: Somewhat opaque. No ability to debug. Bad choices for error pages. "Not loaded" isn't enough of an explanation.

...: These mechanisms need an investment in debuggability. Primitives are very interesting. NTLM negotiation might leak sensitive data to a site. Don't want to have those capabiilties on the internet, might want them on the intranet.

...: We think this is interesting. Just noting compatability issues. Ability to do CORS preflight: Web Transport for instance might make that approach difficult. Perhaps there's an advertising mechanism we could use? ALPM?

**johnwilander**: We discussed this in WebAppSec a long time ago. Different reps from Microsoft, worried that the preflight itself would break things. Request would be misinterpreted by servers.

**ericlaw**: Historically, that has been something of a concern. Web Socket handshake design, went to great lengths to avoid breakage, smuggling data around. Might be cases in which an internal device could be poked at in a weird way. Don't have a particularly relevant security concern. Still, just dropping things via the firewall would be safer. But I'm not aware of anything that can be attacked via `OPTIONS`.

**johnwilander**: We see fingerprinting attempts that poke at `localhost` servers. Scanning those servers to build a fingerprint. Do you envision these zones as ordered? If so, we wouldn't have those problems. Intranet could embed internet.

**ericlaw**: Our isolation levels actually partitioned storage across these zones. Intranet sites moved to the internet, requests could then fail.

**johnwilander**: If we find that intranets are a bag of problems, we could do it in two stages: first shut down loopback, not as much breakage for enterprise. Also, we've also moved CORS around to the network process as part of anti-Spectre. Might be easier for us to do that too.

**dave**: I wrote Happy Eyeballs. On the one hand, this is a good thing to look into. That said, dragons. How do you define intranet? In Apple, some of these aren't on reserved addresses. Also, DNS: you're talking to `evil.com`, browsing `evil.com`, swaps out DNS, rebinding attacks. focusing on loopback feels tractable. For the rest, best defense is only allowing it via HTTPS. SNI ensures that if I'm talking to my printer with an SNI of `evil.com`, it would reject.

**ericlaw**: Related to that, the secure context bits are helpful: mixed content protections. One of the other things we could do is check the preflight, make sure it returns the host name we're expecting to receive.

**Mike**: important concerns. I think some of them are addressed in the doc but there might be some that I haven't thought about that we can update based on these suggestions. Need an admin/enterprise ability to define sites in the the inTRAnet zone because large corps often have a bigger idea of what's internal than just the official "private" address space.

...: there's a lot of complexity here, and I discover more ever time I talk about it.

**koto**: How does this work with `data:` URLs?

**Mike**: I think the right thing is to make them inherit as we do with about:blank and so on for CSP and other similar features. We're trying to make data: difficult to navigate to. blob: urls are another similar set of problems. Anne, I think we've talked about reinstantiating the security context associated with blob urls when they were created?

**annevk**: In general with `blob:`, there's some work to be done with navigations. What's the scope of the blob URL store? Very opaque in the spec. 

**Mike**: someone at Google was asking for the ability to create a blob: with an opaque origin. Did we ever file a bug for that?

**koto**: I don't know about filing bugs, but that's the issue that was raised.

**dveditz**: Interested in the problem, probably not going to get to it anytime soon. Maybe loopback? Not on our priority list.

### OLD documents

**Mike**: [ReferrerPolicy](https://w3c.github.io/webappsec-referrer-policy/) there were questions about Mozilla implementing the CSS bit?

**ckerschb**: we fixed those

**Mike**: yay, let's ship it!

...: was being maintained by two folks at Google who either aren't at Google or aren't working on it. Any volunteers to get it over the line?

Mike: Next is [SecureContext](https://w3c.github.io/webappsec-secure-contexts/), not touched in a while. some Failures in Chrome, maybe around shared worker. I think the spec is correct with some bugs in Chrome. Also not being actively maintained.

...: [Mixed-content](https://w3c.github.io/webappsec-mixed-content/) is basically done, and folks are starting a [level-2 specification](https://w3c.github.io/webappsec-mixed-content/level2.html). In the current process we'd want to finish level 1 and start level 2. Wait for "Process2020" and just do an evergreen version?

**johnwilander**: we have already been talking about level 2 for a couple of years now

**Mike**: right, if we went with the new process we wouldn't have to call it "level1" and "level2", we'd just improve it. If the new process is going to take forever to get here we should just publish level 1 and get the IP protections on it. Sam, any idea about timelines?

**Sam**: [shrug]

**Mike**: I would suggest looking at these and see what we want to do with it. [Upgrade Insecure Requests](https://w3c.github.io/webappsec-upgrade-insecure-requests/) -- CR, probably could go to Rec right now. But with some of the proposed upgrade/mixed changes maybe this spec can be thrown out? Still valuable for things we're not yet upgrading (e.g. script) -- we don't have any plans to do upgrades for those.

**Annevk**: I wouldn't want to upgrade blockable content ever,

**Carlos**: We have no plans to upgrade active (blockable) content. The usage is really low and the usage of the shield upgrade is very very tiny. We've already won this battle. So then there wouldn't be a need for UIR in that case either.

**Mike**: featurestatus isn't working again, but I could tell you how much usage there is for UIR. I suspect it's gone down.

...: I will take an action to see how much use there is and whether it's adding value for chrome users. Then again all the browsers support it now so maybe we just leave it. Would be nice to remove stuff instead of adding it.

**ericlaw**: what about same-origin navigation requests? just use https?

**mike**: that's what I suggest

**ian**: looks like 0.3% of upgraded content?
* UpgradeInsecureRequestsUpgradedRequest: https://www.chromestatus.com/metrics/feature/timeline/popularity/741
* UpgradeInsecureRequestsEnabled: https://www.chromestatus.com/metrics/feature/timeline/popularity/740

**carlos**: but that includes stuff that the mixed-content upgrading will fix so that will go down.

**Mike**: We should add metrics that separate from blockable and optionally blockable, carlos can you do that?

**carlos**: Yes

**Mike**: those are the docs that haven't moved. In the new process that's fine, but in the current process we don't have IP protections.

...: other stuff not quite as done includes [Clear Site Data](https://w3c.github.io/webappsec-clear-site-data/) in chrome/firefox, Credential management, and Embedded Enforcement (only in Chrome). Service worker folks want to rely on Clear site data, but unfortunately in chrome it's really slow. Github was using it but turned it off, because people were having 20second delays as chrome cleared up all the caches.

...: document is not being maintained, which is not a good state.

**johnwilander**: we think in the case of partitioned storage a first party can change state for 3rd parties and this might be detectable

**mike**: file an issue so we can start that conversation. Anne, any idea how we can write spec language that describes the issue john is talking about?

**anne**: [someone] ......   use the top level origin for storage permission lookup when needed.

**mike**: https://github.com/whatwg/fetch/issues/904 

**anne**: we've raised issue for clear site data as well. the browsing context thing was not implementable. 

**mike**: some sites decided they didn't want to store user data so they sent Clear Site Data with every request and made Chrome unhappy.

**anne**: grouping is not entirely clear and maybe should shift around

**john**: Are credentials covered by clear site data?

**Mike**: Credentials -- cookies, yes, also the authentication cache

...: the spec is in statis, but got to a state where WebAuthn could use it. Everything else is only implemented in Chrome. We had agreed to split the doc in two, but I haven't done that.

**jeffH**: I'll do it. it got partially done, was checking to make sure the changes were palatable, they seem to be. need to go through and review, a number of issues, decide what's "good enough".

**Mike**: credential management dovetails a bit with the isLoggedIn state we talked about the first day, so we should talk about how those can work together.

...: last thing is Content Security Policy. CSP3 is old and not maintained right now. is anyone paying attention to it? unclear. Embedded Enforcement also seemed to be a good idea but no one else implemented it, and not clear if the internal people who wanted to use it ended up using it. I'll get back to y'all with usage data. I'd like that to either move forward or to kill it.

**anne**: we talked about splitting CSP in two. Would embedded enforcement apply to that?

**mike**: I think there's potential there, and I'm surprised the people I thought would use it have not.

...: finally, should we obsolete the UISecurity spec in favor of the InterSection Observer spec (and v2) where it looks like all the important aspects have migrated. I'm happy to see that work going forward, but also seems like it makes UISecurity obsolete. Any objections?

[none]

### Working Group Scope

**mike**: wonderful. like to look back at the conversations over the last couple of days. Is this group talking about the right things? Anne, you were interested in including more privacy work?

**anne**: there's a trend to treat privacy violations with the same severity as security violations. Seems like there's overlap, might make sense.

**mike**: I think I agree. attended a bunch of the PING meetings this week. they're thinking of splitting in two groups: one doing horizontal reviews, and a community group to propose new specifications. WASWG might be a good home to adopt those specifications that don't end up at WHATWG. I suspect many of their ideas will touch HTML and Fetch and would live over there, but we could offer a home for other ideas.

**johnwilander**: will have to check with the lawyers, but for things that have to be done in a "working" group it seems reasonable. there's overlap in our discussions and concerns. for example, private click measurement could be one.

**ericlaw**: I think we would be involved whereever it lived. Seems like webappsec is about giving capabilities to websites to do secure things, but in the privacy space it seems like the website itself is the attacker. But mixed-content is about protecting the user. maybe it's fine.  Some things here seem to be moving very slowly and maybe adding more stuff isn't the right idea.

**sam**: there's a trend for some WG to be scoped to a single spec, and WASWG is not. also seem to be a very busy chair.

**Mike**: I suspect many of the same people would be in both and then you'd have even more time conflicts at TPAC :-) . 

**Tara**: I think it speaks to yhour point that if there is going to be a relationship with a WG the people in this group have been involved already and that would be helpful.

**Mike**: we don't have to have only 2 chairs, 3 is also a number

**brad**: this group seems like the natural place for things like this. Hallway conversations I've had this week have asked "is this privacy or security", and things like partitoned cache are both.

## AOB
---

**Mike**: anything else before we adjourn?

**Artur**: We're giving devlopers more and more tools, great. Interesting to see if we can push that to developers without their opt-in. We'll have broad implementation of security features next yearish. How can we shift the world so that they're on by default?

...: The more capabilities we build, the more powerful the features become, the easier it should be to convince developers that the protections we offer on the web solve real problems and should be enabled all the time.

...: Maybe we can do something like HSTS preload lists for some security features. Enable for some TLDs, etc. Default origin policy config.

**annevk**: I've thought about this a lot as well. We're adding lots of headers. 11 or 12 policy headers. Always talk of adding more. For large teams this is managable. For a startup, it isn't. Would be nice to make that simpler. Hard problem. Can't have a single boolean that expands to all these headers, hard to add new policies, etc.

**yuri**: Building a new browser called Puma Browser. Working with Coil to bring web monetization to life. Gift bag has a 1 year subscription to Coil, lets you support creators directly. Want fewer ads, less tracking. We can experiment and launch things quickly. Happy to help.
