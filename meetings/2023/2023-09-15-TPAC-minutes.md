  ## Web Application Security WG

This doc: https://bit.ly/webappsec-tpac-2023

TPAC, Day 2: [Friday, September 15th: 12:30 UTC](https://www.timeanddate.com/worldclock/fixedtime.html?iso=20230915T1230)

*[Minutes from day 1](https://github.com/w3c/webappsec/blob/main/meetings/2023/2023-09-14-TPAC-minutes.md)*

### Attendees  

* Aaron Selya (Google Chrome)
* Andy Paicu (Google Chrome)
* Antonio Sartori (Google Chrome)
* Ari Chivukula (Google Chrome)
* Artur Janc (Google Security)
* Austin Sullivan (Google Chrome)
* Ayu
* Balazs Engedy (Google Chrome)
* Bartosz Niemczura (Meta)
* Brianna Goldstein (Google Chrome)
* Camille Lamy (Google Chrome)
* Chris Fredrickson (Google Chrome)
* Chris Thompson (Google Chrome)
* Christine Runnegar
* Dan Appelquist (TAG, Snyk, guest)
* Dan Veditz (Mozilla)
* Daniel Huigens (Proton)
* Edward Qiu (Meta)
* Eric Portis
* Freddy Braun (Mozilla)
* Ian Clelland (Google Chrome)
* Jan-Ivar Bruaroey (Mozilla)
* Joe DeBlasio (Google Chrome)
* John Wilander (Apple WebKit)
* Jonathan Hao (Google Chrome)
* Jun Kokatsu (Google)
* Kaustubha Govind (Google Chrome) - only for PEPC session
* Kyra Seevers (Google Chrome)
* Lucas Haraped (Google Chrome)
* Marian Harbach (Google Chrome)
* Matthew Finkel (Apple)
* Marcos Caceres (Apple)
* Melissa
* Mike Taylor (Google Chrome)
* Nick Doty (Center for Democracy & Technology)
* Pascoe (Apple)
* Ralph Swick
* Reilly Grant (Google Chrome)
* Serena Chen
* Thomas Steiner (Google Chrome)
* Tom Van Goethem (Google Chrome)
* Vincent Scheib (Google Chrome)
* Yifan Luo (Google Chrome)
* _You?_ (please keep sorted -- someone may have added a placeholder for you already)


### Agenda

* 14:40 [Source Code Transparency](https://github.com/w3c/webappsec/issues/627#issuecomment-1673637611) proposal (Daniel Huigens)
* 15:10 **Cross-Origin Isolation**
  * (~20m) Current status, deployment challenges. (Camille Lamy)
  * ~15:30 **5m break**
  * (~30m) [COOP: Restrict Properties](https://github.com/hemeryar/coi-with-popups)
  * (~20m) `<iframe credentialless>`, defaults?
* 16:30 **☕ Break 🍪**
* 17:00 **Permissions**
  * (~30m) [Page Embedded Permission Control](https://github.com/andypaicu/PEPC/blob/main/explainer.md) proposal (Andy Paicu, Balazs Engedy)
  * (~10m) Permission API: [`.query()`'s behavior](https://github.com/w3c/permissions/issues/414) (Jan-Ivar Bruaroey, Balazs Engedy)
  * ~17:40 **5m break**
  * (~10m) [Permissions Registry](https://w3c.github.io/permissions-registry/) (Marcos Cáceres, Mike Taylor)
  * (~10m) Permissions Policy improvements (Jun Kokatsu)
  * (~15m) Future work: best practices, purpose/context (Mike West)
* 18:15 Rechartering. Wrap up. Next steps.

### Minutes 

#### Source Code Transparency ([sketch](https://github.com/w3c/webappsec/issues/627#issuecomment-1673637611))

Daniel: [link to slides](https://docs.google.com/presentation/d/151Z02A7bye7L3yIiWI_GFckKZM4DykHpPxg3Cdac70Q/). Idea around "source code transparency".

...: Goal is to facilitate web apps that don't trust the server. Client-side encryption/E2EE don't want to trust the server with data. Client-side encryption before it hits the server, server can't gain access. If the server can just change the code to not encrypt the data, that's bad.

..: Apps that don't send data to the server. Purely client-side processing. These apps make promises about data flows, but difficult to verify that, as no way to know that different users aren't getting different code.

...: A few projects that have explored this space:

...: Web Extension that verifies source code. Meta+Cloudflare have collaborated on a solution like this for WhatsApp: https://blog.cloudflare.com/cloudflare-verifies-code-whatsapp-web-serves-users/, https://engineering.fb.com/2022/03/10/security/code-verify/

...: Service Worker could check the source code as it comes from the server. Trust on first use; only works after the worker is installed. Even after that, the server can update the service worker, etc. Not really what service workers are meant for, etc.

...: Binary Transparency. Proposal from Mozilla to publish the hash of Firefox to CT logs, allows verification.

...: Subresource Integrity is related. But we want "Main Resource Integrity" too.

...: Core idea of Source Code Transparecy would be to publish the source code (or a hash) to a transparency log, and then to verify that the code delivered from the server is actually in the transparency log. Verifies that everyone gets the same code, and allows auditors to check the code with reproducable builds, software bill of materials, CSP, SRI, etc. Authors and distributors can uses these tools today, auditors could start doing the same if we had SCT.

...: Could piggy-back on Certificate Transparency, could request a certificate for `[hash].some.domain.example`. Or create a new log.

...: Closest thing to a concrete proposal: create a new x509 cert extension that says "Resource `/x.html` should have hash `YYY`."

...: Putting this in a cert means it's automatically added to CT. Browsers can then verify the resources.

...: Challenges: every page the user might land on should be checked. Need to deal with error responses.

...: Alternative: proposal in WICG for Isolated Web Apps. Signed web bundles of an app, could publish the hash of the bundle. This seems simpler. Could serve from a store or from a regular domain.

...: New distribution method simplifies things, but means we can't easily secure existing web apps without them telling users to install the app a different way, not what users are used to.

Chris: Discussion prompt: tension between wanting drive-by web experiences that are secure under this model, and I wonder how we could get that without installation. IWAs have a very clear mapping between what you're running, and is updated in a concrete atomic step. One version of a bundle to another. Would be nice to keep some aspects of that in this distribution model.

Daniel: Should be possible with the first model. Additional complexity, but should be possible. Advantage of having it in a cert: security even on first use.

Bartosz: Meta is interested in this. Browser extension, CodeVerify. Interest in using it for more services. Wanted to pitch some ideas to vendors.

...: Tradeoffs: relying on CT would be nice, as logs exist. Wouldn't need to convince a lot of other independent parties to run the logs. But hard to create separate cert for each hash - need to work out details.

Daniel: If we could have one cert per version of an app, that might be better?

Bartosz: Depends on what we mean by "version". Some components change rapidly.

Reilly: Hi. I wrote the IWA proposal. Fascinated by the idea of having an x509 extension as a place to put the integrity indicator. That's been a challenge in designing a system that's secure by default. Perhaps an opportunity to combine this with the web bundles story. Extension could say that "Actually, stop trying to load this resource over HTTP, the web bundle for this origin is over here, and here's its hash." Might be interesting to explore. No moment of installation, but more dynamic.

Daniel: Is there an advantage to pointing to the bundle in the cert over putting a hash in the certificate and responding to the request with the bundle?

Reilly: Bundle is important. Not just a version of the resource, but the whole app. Avoids skew between resources. Let's talk more.

John: We raised privacy issues when bundles were proposed. Concerns around personalized bundles. If the bundle is loaded from a server that gets credentials, then a personalized bundle can be created on the fly with tracking IDs, ads, etc. If there's a centralized hash somewhere, that's a potential way to make sure everyone gets the same bundle.

Joe: I like brainstorming around x509 and CT. But, if we're going to substantially increase the volume of certificate issuance, that will have an impact on the CT ecosystem. Right now it's hard to convince folks to run logs. Very expensive. This might risk the ecosystem.


Mike: It seems to me that there's something in a domain name that we ought to be able to use to make some promises about the content on the site. In the context of signature based SRI, you could imagine something similar hash.domain - we could have a format for a subdomain that would instruct the browser to make some guarantees about the content of the site. We could guarantee that the resources match that hash, and if it contains SRI (and we apply SRI to iframes), you could have a chain of proof. That is distinct from what you're talking about, but feels that it goes in the same direction. Would be interesting to explore. For subresources, it might be useful to say everything on this domain is signed by this private key, here's the hash of that key. It might allow us to avoid some of the questions about bundling. If there was a name associated with the domain, you would still get some of the benefits of transparency. Because you have to mint a key. Different in kind... I would like to explore something in that space.

Daniel: Interesting. I think there's still a challenge if you're a user that wants to open some web app: you type `mail.com` into your browser, how do you know that the thing the domain links to is the correct hash/key. Map from name to hash would be needed.

Mike: I think you need to deal with rollback in either case. 

Jun: Why can't we just add a manifest? Tells you you're loading a service worker: hash inside the manifest, have some guarantee about the right thing being loaded. Another alternative to IWA. Users navigate to the website, browsers fetch the manifest, need hash of the manifest, the rest of the hashes can be in the manifest, including the service worker. Could consider adding this to manifests.

Matt: In the Zoom chat, Nick mentioned that the IETF is working on [consistency checks around Privacy Pass](https://ietf-wg-privacypass.github.io/draft-ietf-privacypass-key-consistency/draft-ietf-privacypass-key-consistency.html). Want to ensure that the key used for signing is the same for most users. Relevant here, but for most web apps it'll require authentication. Consistency check will not work if you have to provide cookies.

Chris: Related topic around piggybacking on CT. In CT we get a guarantee that we'll eventually have visibility into every cert used. App distribution: not getting _protection_ unless we're building something on top. We get eventual consistency and eventually transparency. But not realtime.

Daniel: Good point. Detection might be the best we can do for web distribution model. Unless we also prevent apps from updating whenever they want, as you anyway might want to wait for an auditor to ensure that the new version of the app is the same as the published source, or doesn't contain new vulnerabilities, or etc. But maybe CT is not the best fit for this thing. Perhaps we'd rather have a merkle tree that behaves like a MAC of this web app and this version has this hash rather than just a list of certificates.

Chris: Also interesting to think about properties we'd want that are different from CT. Might be happy with different tradeoffs around SCTs, precerts, etc.

John: To flesh out the issue we filed: these bundles are served by galleries or stores somehow. Vendor of app could ask the store to include tracking IDs, etc into bundles. 

#### Cross-Origin Isolation

Camille: [link to slides](https://docs.google.com/presentation/d/1WEH9-2WPWuAV4IXrSfdnzpN_qWKctyhhLNiN0zbjC0s/edit?usp=sharing). Cross-origin isolation, or "How to get SharedArrayBuffer safely."

...: All three major browser engines are shipping COOP and COEP. Chrome's moved beyond the initial values, adding `COEP:credentialless`. Firefox has an OT of that in 104, might ship soon. Chrome's also shipped `<iframe credentialless>`. Running an origin trial for `COOP: restrict-properties`.

...: We hear a lot about deployment challenges. Three themes:

...: Subresource! `COEP: require-corp` requires all subresources to serve a `Cross-Origin-Resource-Policy` header. `COEP: credentialless` seems like a reasonable way of addressing this. Good feedback from developers.

...: Frames! Third-party frames need to ship COEP. Hard. `<iframe credentialless>` helps. But there's some concern around the ability of scripts to create credentialless frames. Will talk about it later today.

...: Popups! COOP breaks some core use cases (payments, OAuth). We think `restrict-properties` will help. Will talk about later today.

...: Sandboxed frames are a specific challenge. If a sandboxed frame opens a popup without `allow-popup-to-escape-sandbox`, and that page navigates to a COOP-protected page, then we show an error page. This isn't ideal. For `COOP:RP`, it might make sense to simply inherit the sandbox flags. For other COOP values it's less clear. If no browsing context group switch is needed, we should probably inherit the flags. If a switch is necessary, perhaps we shouldn't inherit flags? Or maybe we should? Error page is clearly wrong. Can discuss as an issue on HTML spec.
...: 

Mike: we've talked about different mechanisms that have evolved COOP and (?)... at the expense of some amount of complexity in terms of specification and implementation. Curious about feedback from other vendors you've received, or in the room. How much complexity can we accept and to what degree can we balance against deployment opporunities. Also curious about folks using this in the wild. There is a tension here. 


Bartosz: Usage. `COOP: allow-popups` was easier to deploy. `restrict-properties` looks good as well. Haven't been able to roll out `COEP: require-corp` at scale, but we do think `COEP: credentialess` should be deployable. Which of these flags enable cross-origin isolation? `COOP: restrict-properties` should. Need to consider payment and OAuth flows. Might be scenarios in which we need to allow popups, but `restrict-properties` wouldn't allow access to properties we might need. Reporting would help!

Camille: This is exactly why we're running an origin trial right now. Would love for folks to use the mechanism and help us decide which properties are particularly necessary.

Bartosz: Cool, I'll give feedback. Is there reporting?

Camille: The reporting API should trigger if you access anything other than `postMessage()` and `close()`.

Artur: Clear value to `COOP: restrict-properties`. We're going to deploy this at scale, totally worth it. For `COEP`, the question boils down to how useful cross-origin isolation is for the platform. Our assumption is that it'll let us build APIs into the platform that we otherwise couldn't. Comes at the cost of enabling these protections that help ensure APIs don't leak other sites' data. Not sure it's a real answer to the question, but if we see more APIs that need COI, then it would justify the additional complexity, as improves the platform overall.

Dan: Leveling up for one second: from the TAG perspective, when things come our way in this space, the design review process is challenging. We have to get into the mindset of the problem space, many terms of art, trying to soak in some of that domain knowledge. It would help us to review these next time to have something to point to that discusses the problem in terms of "Users who are doing X will be protected from Y." Need to understand the user need, not obvious to members of the TAG. Would appreciate more pointers and explanation/explainers that come at it from the perspective of user need. Who's protected from which threats?

Jun: Post-Spectre deployment doc, published as part of W3C to provide insight to developers: https://www.w3.org/TR/post-spectre-webdev/

Bartosz: Also [xsleaks.dev](https://xsleaks.dev/). Overview of protections at Meta: https://web.facebook.com/whitehat/bugbounty-education/1182948339062075?helpref=hc_fnav

Dan: We get a review request for an incremental change for something in this space. Hard to understand what additional security is layered on top.

Camille: Issue there is that the changes we've done to COI don't provide additional security. Same amount of security, but increasing what the website can do. Initial model constrained the model quite a bit, hard for websites to use with other things they want to do. These are all about expanding the scope of things websites can do.

Dan: User need that makes use of that capability that's going to be exposed would be helpful. TAG has a deficit of expertise in this space. Help us help you.

Jun: `restrict-properties`. In Chrome we can provide COI with `restrict-properties` because `postMessage()` is IPC. Can other browsers do that?

Camille: Will talk about that right after the break.

##### COOP: RP ([explainer](https://github.com/hemeryar/coi-with-popups))

Camille: `COOP: restrict-properties`. As I mentioned earlier, one of the feedback we've gotten from devs is that you can't have COI and communication with a cross-origin popup. This is problematic for payments and oauth flows. We had this idea of COOP: RP, which would allow limited communication, but still allow the page to be in a different process from opener and popup, even when browser does not have Site Isolation. ...there might be use cases where popup might want COI for itself. This version can be used outside of site isolation just as a security policy. It should just work most of the time.

...: What do we mean by limited communication? We put metrics on cross-origin window proxy access. We decided we would restrict to postMessage and close, because most used. We might add opener if during the Origin Trial they give us that feedback. Probably the rest isn't that useful, based on usage. This is why having the Origin Trial is important to help us validate the reasonable set of properties to set on the window proxy.

...: The second part is Isolation. The constraints we gave ourself are this should only work with Page Isolation. A page should be able to put itself in its own process. Does not require Site Isolation or Out of process iframes. On Chrome on Android we don't have Site Isolation. Other browsers also told us this was a model they could support. We need to ensure that frames on a page w/ a different COOP value do not share same agent cluster. If you are in a different agent cluster you don't have DOM or scripting access to each other. To do that, we are introducing a new concept that says even though it's a different BCG it can still have limited communication with eachother.

...: Without COOP, everything in the BCG, I have 2 different agent clusters for main document and iframes and popup. The challenge is if I don't have Site Isolation, everything that's in the same page needs to be in the same process. This doesn't work with threat model with Site Isolation. With COOP same-origin we solve the problem. Since it's different agent cluster, it's safe to put in own process. But, now they can't communicate with each other. Instead, we suggest a COOP group. There's a default one, and one when you have... (?). We say if you're still in the same COOP group, you can still use window proxy, but you have limited sets of properties.

...: We considered alternatives. Instead of a super group, we could add more keys/nonce to the agent cluster. So when you set the policy, everyone gets the nonce to agent cluster key. Nobody outside of your page will ever share an agent cluster with you and we're free to put you in a different process. Ideally, once we have COOP: rp, we would like that to be the default of the web. Having isolation might be more problematic for compatibility. When a page tries to talk to cross-origin page, we have a problem (vs same-site). 

...: There is a thorny issue which is the case of the initial empty document. In regular COOP right now, if you embed a cross-origin iframe and it tries to open a popup, it creates a new page with initial empty document. The popup is not opened with rel=noopener, we have constraints that don't allow us to create new initial empty document in different process.

...: Initial empty document without Site Isolation. Cross-origin iframe opens a popup, no choice but put into same process. This popup is about:blank, origin of b.com because it inherits from creator. Needs to inherit COOP properties. The thing is, if it navigates to b.com, which also has COOP: rp and COEP, we're not going to do BCG switch we want to. That's what we have right now and it's wrong. We want to be in different process. So, I decided to add the COOP origin set from a.com, so if we navigate then the origin does not match and we can use the right process. This also helps us by saying we will not enable APIs given by COI if your top-level origin does not match origin that set the COOP. 

...: We're going to move this to the WICG soon and propose a spec. But we need to agree on a name, so I can put it in the repo and we don't need to rename. Right now it's COOP: restrict-properties. We can change it. I think using popups can be confusing with COOP. 

Jun: if the same-origin site creates popup to same-origin page with COOP: rp, do they actually have restricted properties?

Camille: Yes, because they don't have COOP. If I go back to idea of COOP super group. You have default BCG, for people not using COOP: rp. Then a BCG for pages that are using COOP: rp and are keyed on top-level origin. And another one of those who are using COOP: rp plus COEP and are keyed on the top-level origin. When we navigate, we look at what you have. If you're setting COOP: rp or COEP you find which of the BCG we find (??) which... and if not we put you in the default group.

Mike Taylor: Does anyone in here not like the name?

[crickets]

Ian: Cross-origin-popup-policy? COPP?

Camille: No.

Ian: the list of properties on the window proxy object, things we think are useful? Or know for sure that are necessary.

Camille: We started from postMessage and close. We don't know about opener, so we'll see from Origin Trial. Doing window.opener.opener would be weird.

Kyra: the table was metrics, right?

Camille: Yes, these are public metrics on chromestatus. You can find them CrossOriginWindowProxyAccess$FOO.

##### `<iframe credentialless>`

Camille: `<iframe credentialless>` is our attempt at helping sites to deploy COEP and safe to include in crossOriginIsolated context, even if document inside credentialless iframe doesn't have COEP. This removes dependency on 3P to deploy COEP. You can still have session cookies, and (empty) Storage API, so fewer compat issues. But people told us it doesn't work for me due to ad scripts which create ad frames on my site unless they update to add `credentialless`. We'd like for the websites to have a way around that. 

...: Which is why I'm suggesting some kind of default. The idea is to have your COEP to set credentialless iframe default. Then we extend credentialless iframe attribute to have true/false/default valuees. When navigating, if the default is set, check if the URL matches the policy in the ancestory policy.

...: Might be a need for finer controls. Maybe for specific origins. We could extend very basic proposal. I was wondering about xsleaks. But this does not give more info than CSP frame-ancestor or (?).

...: Then we have a recommendation for easy COI. Set COOP: rp on your top-level pages. Set `COEP: credentialless; credentialless-iframe-default cross-site` on 1P documents. Then it should work.

Daniel: Might it make sense to make the name more similar to fetch credentials naming (e.g. credentials=omit/include/default).

Camille: That's something to consider. I am not set on any kind of names.

Mike: the caveat is that we've shipped it.

Mike: can you talk more about what might change once 3P cookies are deprecated?

Camille: if we just said, OK, completely deprecated. Yes, we should be having a discussion about whether you should not be able to embed those iframes. However, when you have things like storageAccessAPI etc that are bringing cookies back, that doesn't completely square with spectre threat model here. We have to look at details of the proposal. 

Artur: Second what Camille said. It's complex with stuff like CHIPS. It makes sense to me for the control to live at this level. Regardless of whether if the cookie that might or might not be there. It's complicated, but this is good.

Camille: I find this is pretty easy to implement once you have COOP: rp. But long term, something we can look at.

Mike: coming back to the question of compatibility, this is shipping now in Chrome. We see some usage. I think you said Firefox is implementing?

Camille: No, they're looking at `COEP: credentialless`.

Mike: Any feedback?

Camille: Anyone on the call who can comment?

[crickets]

#### Permissions

##### Page Embedded Permission Control ([explainer](https://github.com/andypaicu/PEPC/blob/main/explainer.md))

Andy: Andy from Chrome permissions, want to introduce an idea that we think will be useful for the permissions flow on the web.

...: Permission prompts. We know them, we love them. Site wants to do something that requires a sensitive capability, the user agent will ask the user, the user will make a decision. Or not. That works for many common use cases. But opportunities for improvement.

...: 1. Let's say the user is on a news site, reading something, and then a permission prompt shows up. User doesn't know what to do with that request. No way to balance risk/reward.

...: 2. On the same site, user might click somewhere on the page, and site requests notifications, using that gesture. Unrelated to user's flow. Interruption.

...: 3. User agents pervent sites from helping users change their mind. Suppress further prompts after a denial. User needs to dig through settings pages. Some sites provide instructions to users, but difficult for every site out there to give instructions for every user agent.

...: 4. Sometimes users will simply miss the prompt because they're focused on something else. Worse on larger monitors. Example of a map with a location widget in one corner, far away from the permission prompt tied to the address bar.

...: Successful UX pattern in the wild: site will provide some information, and an affirmative button the user can choose to click or not. When the user clicks, a prompt will appear. We'd like to bring this kind of UX directly into the platform, under the user agent's control. Allows for better user experience, will be easier all around.

...: "Use precise location" button to grant geolocation permission, for instance.

Nick: Frustration that in practice you don't have to click on the button, prompts just appear. (Tested it again today and the bad practice continues, for me, in multiple browsers.)

Andy: Recent improvement on search side. Not unexpected that it was previously annoying.

Andy: Proposing a new element: `<permission>`. User-agent controlled, provides a strong signal that the user is interested in using the relevant permission.

...: This addresses each of the concerns we discussed previously in one way or another. Actively decided to click on a button that talks about the permission. Engaged in a task related to the permission, strong enough signal that reprompting won't be an issue. The user agent knows where the user is looking, offering an opportunity to reposition the prompt.

...: Sites would get a free, good user experience that they don't have to invest UX design time in.

...: What would this look like? We think relatively minimal: content of the element is controlled by the UA, not the developer. Developer can configure some things, background color, icon style, etc.

...: Use permissions API to listen for changes in the permission status. Has the benefit of catching both PEPC interactions, and other sources: user might go to settings, for instance.

...: Can pull the browser's prompt into the page, right where the user is already paying attention.

...: Security: Various restrictions on the button's UI to ensure the user clearly understands, and won't be surprised if a prompt related to the button shows up.

...: Feedback welcome! https://github.com/andypaicu/PEPC/blob/main/explainer.md

John: My impression of the biggest problem in this space is that sites want to be able to prompt users forever until they get what they want. Highly incentivized to get notifications to increase engagement. So they show a pre-prompt. They can show that forever, and only then show native prompt once the user expresses interest. Is that addressed here? Or just thinking of sites that are better behaved?

Andy: This doesn't address that kind of malicious site. They can include PEPC rather than a pre-prompt button. It helps developers that are more judicious with their usage of the APIs.

John: Malicious sites like Slack. Every page it asks about notifications.

Andy: Permission prompt, or preprompt?

John: Preprompt. That's the problem. Infinite tries.

Andy: I see the problem. Not sure this helps. Could consider tying notifications API to be only requested through PEPC.

Marian: comment on prevalance. Our telemetry shows ~2/3 of prompts from camera/microphone/notifications not being preceeded by a gesture.

Thomas: As an inverse of John's argument: Google on Safari: no permanent way to grant geolocation access. Also requires infinite prompts.

Camille: Question about multi-language settings. Browser is English, viewing page in French. Which language is PEPC?

Andy: Excellent question. Currently this is somewhat open. Right now considering the site choosing the language, but UA intervening to override if it thinks the user doesn't understand the language. Has downsides, but a good question, worth thinking about.

Marcos: As a followup: need a fallback model: `<html lang="jp"><permission><button>geo`. People want this thing regardless, so they may just use `<button>`. What does this solve better than `<button>`. Tied to Chrome browser UI. Web Apps installed via Safari: settings via the OS. Go to the site settings page or system settings. Seems broken in iOS/macOS.

...: In some ways we're going back to `permission.request()`, which we rejected as a community. `<permission>` should be the only way to request a capability, which isn't the case. As long as you can still do eveything with `<button>`, we're in a weird place.

Andy: UI is up to UA. If it makes sense to redirect to settings page, UA could do so. Examples are Chrome, sure.

...: `<button>`: Can't prompt in cases where permission has been denied in the past. Site can't just use the JS API to recover.

Marcos: would there be a companion API to this element? "Show site settings" with a filter that would allow to say "Show settings for geolocation"?

Andy: An API that allows popping up site settings. Could do that. Up to UA. Don't _need_ prompts if UA wants to pop up settings. But not site's decision, should be the browser's.

Marcos: At the moment, sites ask users to go find site settings. Difficult. That's a fundamental flaw across all browswers. At the end of the day, users just want to change a thing.

Marian: I agree! But sites shouldn't be able to do that at any moment.

Marcos: Sure, button involved. PEPC could be that button. But arbitrary limitation. Spoofable.

Marian: Spoofing doesn't get you anything.

Jan-Ivar: The prompt isn't annoying the site is annoying. Regarding camera.microphone in Meet: why can't I join without giving those permissions? Safari and Firefox default to one-time because some users: camera/microphone might be special. Only one way to open a ??? for instance. These are user settings: premise that the application should be able to intervene like this is going down a bad path. These are browser UX challenges. Sites are acting out of fear: browsers agressively block. We see it with camera/microphone, not with screen sharing. Could bake these buttons directly into the browser, avoid prompts alltogether. Just serinty 

Andy: I don't have a great grasp on the whole design architecture of the web, but the permissions API assumes that sites want to be involved directly. Doesn't seem like a stretch. Ephemeral permissions work in some cases, don't work in others. Seems difficult for notifications, for instance. Calendar tells me about meetings. Granting permission everytime is a bad experience. Works for some cases, not perfect solution for everything.

Nick: Remember this from permissions workshop. I think it's encouraging. Paves a cowpath. Documents something we want sites to do. We want sites to provide context in the part of the UI where the user understands what's going on. This is also user-initiated. Like drag-and-drop, we have a good signal what the user's trying to do. Should keep working through issues: spoofability, not as concerned, but I get why we need to think it through. Useful to help sites help users initiate requests.

Jan-Ivar: No way to request permissions through permissions API. So not a departure from that. Camera/microphone doesn't require activation. That's my fault. We do require it for screen capture. But not a good idea to revisit `request()`. Goal was to have permission happen at the point of access.

Mike: Where should people provide feedback, given the interest?

Andy: Feedback on the WICG proposal issue or on the repo. [https://github.com/WICG/proposals/issues/113](#TODO)

##### Permission API: `query()` results.

https://github.com/w3c/permissions/issues/414

Jan-Ivar: Many browsers default to one-time permissions for camera/microphone, as users don't always want camera/microphone. Granting one-time permissions means that I want sites to prompt every time. Existing permissions API doesn't account for this level of trust: the user generally likes the site, but doesn't want it to have the permission all the time. If we return `prompt`, as currently defined, it appears like you haven't gotten a preference from the user yet. `granted` is also wrong, as the permission isn't granted. So sites need to prime the user every time, as they think they need to "prompt". It would be ideal if that wasn't the case. Slippery slope towards permission escallation. Users pressured into granting over the long-term. Our plan is to return `granted` if the user has previously granted a permission. This means that developers will balk: "You said `granted`, but I still get a prompt." It's hard to be permablocked in Firefox, we don't think prompts are bad. Some sites might have good reason to learn the difference between "actual granted" and "always ask". Perhaps the `query()` API should reveal that difference. Would like the default to be "prompt", "blocked", "always ask", and "granted".

Balazs: What problem are we solving here? Reading through the GH issue, we're talking about in-content priming dialogs in cases where one-time decisions are the default?

Jan-Ivar: We're solving this problem, sending `granted`. But we realize that some sites feel that Firefox is in the wrong, returning `granted` when there's going to be a prompt.

Balazs: So issue is that `prompt` is a good proxy for "user has not been prompted" because of browsers like Chrome persisting the decisions? But not good proxy when one-time is in use.

Jan-Ivar: Right. We're solving that by returning `granted`. If we addded anoter value, we'd use that.

Austin: seems like a better version of this idea? https://github.com/w3c/permissions/issues/250 It would be nice to know if you had permission the previous time so you can customize experience. of course you can store a bit, but it would be nice if it told you.

Ian: Back compat. "If sites are using `== granted`, behavior might be different." Enum is encoding multiple bits of information. Could we just expose these things more directly?

Jan-Ivar: When the user answers the prompt, the value will be `granted`. If we introduced a new value, we'd ship see "always-ask" Site can test "did I get granted" or "not equal to prompt". Not worried either eway, worst case is status quo.

Marian: From research, it sounds like "always ask" is a common stance. "Asked before" might be more appropriate. User made a non-permanent decision before, might be asked again.

Marcos: "Asked before" feels like a privacy leak if persistent. Come back to the site, cleared browsing data. So why doesn't the site simply record that. "granted" feels right. The prompting is related to the permission API, but not inherently tied to each other. UA can still show UI. If PaymentRequest required permission, could still show a prompt. 

Jan-Ivar: Happy even if this doest go through. But would like other browsers to consi. Right now, get `granted` in Firefox. But Chrome is shipping one time, it would be nice if we could align on this.

Marcos: Feels fine to lie in certain circumstances, like Privacy Browsing.

...: If we do bring "always ask", it might lock us into this model. Might lie all the time.

Jan-Ivar: All the permission API values are fingerprinting vectors. We plan to mitigate that by clearing permissions along with local storage for "always ask".


##### [Registry](https://w3c.github.io/permissions-registry/)

Marcos: We thought it was a good idea to move the permission registry out of the spec. But implementer feedback says we were wrong. So we're not going to do this. Also annoying process issue.

Next steps: [update the doc](https://github.com/w3c/permissions-registry/issues/22) and the other doc.

##### Permissions Policy

[link to slides goes here](#TODO)

Jun: Strict CSP. Yay. But, permissions policy defaults to `*`. `<iframe allow="camera">` delegated by default. We think this is a problem, rolled out strict CSP but still have this gap.

...: Delegation. ~5 years ago, Chrome began asking based on the top-level rather than the frame. This is bad for sites protected by strict CSP. `google.com` does voice search, has `microphone`, maps has `geolocation`. If XSS: we can prevent script execution, but don't prohibit frames. Which means permissions can be requested on Google's behalf or delegated down.

...: News site with strict CSP. Might not have user data at all. But FedCM can request sign in on behalf of top origin. Can inject an iframe, say "I want to use FedCM." Won't even be a prompt, it'll be something saying that the user wants to log in, but email goes to the frame.

...: Bigger issue with permissions policy's default of `*`. Would be better to say "I only want to use this on my site." `frame-src` is another mitigation. can list each frame that's embedded. But doesn't mean all those frames should have a permission. Doesn't clearly solve the problem.

...: Suggestions: can we make permission policy `'self'` by default. Only top-level origin can request permission. Need to specifically override it via a header. Can start with small usage: WebUSB, etc. Similar to securecontext.

...: Or we could use `SecureContext=Injection`: ties in with this concept.

...: Or we could add nonces in permission policy for frames.

Marcos: Let me tell you about the time we tried to do this with gamepad. We broke an important website. Tremendously difficult due to usage. Tracking scripts are bad. Hard to change, but worthy goal. Did it with Web Share. Painful.

Ian: two places where defaults are set. Default value for `allow` is `'self'`. Default value for the header is `*`. So everyone would need to specify everything. Might be better way.

Matt: Updating all the APIs that specify policies, and updating them all to a different default.

Jun: Browser default. Yes, each API goes to `'self'` by default. Would do it API by API. Incremental deprecation.

Mike: Where should we talk about this?

Jun: Issue in Permission Policy repo [link goes here](#TODO)

##### Reporting

[link to slides goes here](#TODO)

Ian: report-only mode for permissions policy. Syntax example. PR #529. Give feedback.

##### Future Work?

* "Best practice" NOTE? ([1](https://web.dev/push-notifications-permissions-ux/), [2](https://developer.chrome.com/docs/lighthouse/best-practices/geolocation-on-start/), [3](https://developer.chrome.com/blog/one-time-permissions/#best-practices))
  PING has also worked on some of this: https://github.com/w3cping/adding-permissions
* Asking for less? Allow sites to say "I only need the permission this time". Not sure how, but let's talk about it.
* https://github.com/mikewest/purposeful-permissions, please take a look

#### Rechartering

Nick: In the current scope is "write recommendations on the web security model"

plh: Living specs or REC.

Mike: Living spec.

We should drop the external organization: update 5.2 accordingly. Also: we need to liase with the HTTP WG in IETF if we're going to pay attention to cookies.

**New work?**
* `.well-known` URL for passkeys (Tim)
* WebCrypto curve25519 (Daniel)
* Cookie NOTE (Artur and Johann)
* `Request-OTR` (Shivan)
* ~Registry~. (RIP)
* Permissions best practice NOTE.

**Incubations to pay attention to?**
* WebCrypto curves, algorithms, and streaming.
* PEPC (Andy and Balazs)
* Securer Contexts
* Permission API additions?
* e2e email?
* "Unique" Origin
* Source Code Transparency
* Cookie Layering

**Anything else?**

* Fetch metadata still to be incorporated directly into Fetch
