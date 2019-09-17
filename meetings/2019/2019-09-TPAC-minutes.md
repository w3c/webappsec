  WebAppSec @ TPAC 2019
=====================

## Exciting metadata

* **Location**: We're in [Sumire - 3F](https://www.w3.org/2019/09/TPAC/schedule.html#map), starting at 9:00. See you there!
* **WebEx**: [here](https://www.w3.org/2019/09/webappsec-tpac.html)
* Attendees:
  * Artur Janc (Google)
  * Balazs Engedy (Google, observing)
  * Ben Kelly (Google)
  * Brad Lassey (Google)
  * Carlos Ibarra Lopez (Google)
  * Christine Runnegar (PING, co-chair, observing)
  * Christoph Kerschbaumer (Mozilla)
  * Dan Veditz (Mozilla)
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
  * Melanie Richards (Microsoft)
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
  * Steve Becker (Microsoft)
  * Steven Soneff (Google)
  * Takeru Yamada (ACCESS, observing)
  * Tara Whalen (Google, PING co-chair, observing)
  * Tom Lowenthal (Brave)
  * W. James MacLean (Google, observing)
  * Wendy Seltzer (W3C)
  * Thomas Steiner (Google, observing) 
  * Jeffrey Yasskin (Google)
  * Tsuyoshi Horo (Google observing)
  * Deian Stefan (UCSD, remote)
  * Michael Smith (UCSD, remote)
  * Yutaka Hirano (Google, observing)
  * Dominic Cooney (Facebook)

## Agenda:

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

...: 

mkwst: anything that makes the process eaiser is good for us. Would be valuable to be more closely aligned with Living Standard. Not clear to me what changes. 

plh: SWWG doesn't care about recs. they want to be able to update docs. SO they like this, stay in CR forever.  Some other groups want to get to Rec. Lets them get to rec and continue to iterate. 

mkwst: historically, we haven't been that interested in getting to Rec, as demonstrated by our recent specs. Patent commitments are useful, but Rec not so much.

wseltzer: if your lawyers are interested, send them to PSIG

mkwst: patent commitments earlier are good. I'd be happy if EDs got commmitments. CR seems fine so long as we can continue updating. 

plh: if you want to trigger a snapshot and commitments, you need to show you've done wide review

mkwst: understand that would be the case at whatever level you want commitments.  Who evaluates whethe rthe review is wide enough?

plh: Director. If the horizontal groups sign off, that makes it easier.

mkwst: personal perspective, this seems like a good direction

jeffh: +1


### ☕☕☕

Back at 11:00.

### Injection Attacks

#### Trusted Types



## Queue

* add your name here

























