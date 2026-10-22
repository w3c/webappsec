# TPAC 2026 - Draft Agenda

## Monday, October 26th

Location: [Ground Floor - Munster Suite](https://media.claytonhotels.com/dalata-assets-2024/image/upload/f_auto,c_auto,w_3840,q_auto/v1712577344/Uploads/Clayton/Clayton_Conference_Hotel_Burlington_Ground_Floor_Plans_1_e272e77aa2.png)

| Time (GMT) | Topic |
|-----------:|:------|
|  9:00 -  9:15 | Showing up, saying hello, agenda bashing. |
|  9:15 -  9:45 | **Document Isolation Policy** (@annevk, @camillelamy, @arturjanc) |
|  9:45 - 10:00 | [**Extending Permissions Policy to Workers**](https://github.com/explainers-by-googlers/workers-permissions-policy) (@antosart) |
| 10:00 - 10:30 | **Permissions API & Permissions Policy** updates (@marcoscaceres, @annevk) |
| 10:30 - 11:00 | ☕🥐☕🍰☕ |
| 11:00 - 11:15 | **CSP**: [Sandbox directives in Web Workers (#279)](https://github.com/w3c/webappsec-csp/issues/279) (@azaika, @yoshisatoyanagisawa, @hiroshige-g) |
| 11:15 - 11:30 | **CSP**: [`speculation-rules-src` and the `Speculation-Rules` header (#808)](https://github.com/w3c/webappsec-csp/pull/808) (@vickiez) (_This needs to be in the afternoon._) |
| 11:30 - 12:00 | **CSP**: [Expanded `script-src` hashes (`script-src-v2`)](https://github.com/explainers-by-googlers/script-src-v2) (@arturjanc) |
| 12:00 - 12:30 | **W3C Advisory Board**: [Experimental Process (`w3c/process#1189`)](https://github.com/w3c/process/pull/1189) and [Group Culture](https://www.w3.org/guide/process/coc-incident-resolution-ombuds.html) (@torgo) |
| 12:30 - 13:45 | 🥗😋🍜 |
| 13:45 - 14:15 | [**Sealed form fields** (`sealed-fields` CSP directive + `<sealedinput>`)](https://github.com/madeit-build/koschei/blob/main/docs/specs/explainer.md) ([WICG #307](https://github.com/WICG/proposals/issues/307)) (@decleezy) |
| 14:15 - 15:00 | **Web Crypto**: [Streaming hashing](https://github.com/w3c/webcrypto/pull/390), [Modern algorithms](https://wicg.github.io/webcrypto-modern-algos/) ([status](https://github.com/WICG/webcrypto-modern-algos/issues/25), Hybrid KEMs, ["well-supported"](https://w3c.github.io/charter-drafts/2026/charter-wg-webappsec-2026.html) criteria), and [`crypto.randomUUIDv7()`](https://github.com/w3c/webcrypto/issues/561) ([PR](https://github.com/w3c/webcrypto/pull/562)) (@twiss, @hubertchao) |
| 15:00 - 15:30 | ☕🍰☕🥐☕ |
| 15:30 - 16:00 | [**Local Network Access**](https://github.com/WICG/local-network-access) (@MayyaSunil, @hubertchao, @christhompson) |
| 16:00 - 16:30 | [**Device Bound Session Credentials (DBSC)**](https://github.com/w3c/webappsec-dbsc): Updates and extensions (cookie-less mode, JS API, per-endpoint deferral opt-out) (@arnar) |
| 16:30 - 16:45 | _Leaving some slack for overflow / topics folks want to add._ |
| 16:45 - 17:00 | 😴 |
| 17:00 - 18:00 | [_Breakout sessions_](https://www.w3.org/2026/10/TPAC/breakouts.html) |


## Tuesday, October 27th

Location: [Ground Floor - Munster Suite](https://media.claytonhotels.com/dalata-assets-2024/image/upload/f_auto,c_auto,w_3840,q_auto/v1712577344/Uploads/Clayton/Clayton_Conference_Hotel_Burlington_Ground_Floor_Plans_1_e272e77aa2.png)

| Time (GMT) | Topic |
|-----------:|:------|
| 10:30 - 11:00 | **Streaming SRI** (@yoavweiss) |
| 11:00 - 11:15 | **A "CORS all the fetches" `Document-Policy`** (@yoavweiss) |
| 11:15 - 11:45 | **Agentic Security (Part I)**: General-purpose AI agents running JS with the user's logged-in authority (@johannhof) |
| 11:45 - 12:00 | **Agentic Security (Part II)**: [Content Trust Markers](https://github.com/explainers-by-googlers/content-trust-markers) (@DCtheTall) |
| 12:00 - 13:15 | 🥗😋🍜 |
| 13:15 - 13:45 | **Agentic Security (Part III)**: Shared threat model for the web (for security agents) (@miketaylr, @recvfrom) |
| 13:45 - 14:15 | [**Connection Allowlists**](https://github.com/WICG/connection-allowlists): Current status and "embedded enforcement" (iframe attribute) (@noamr, @mikewest) |
| 14:15 - 15:00 | **Trusted Types & Sanitizer**: `createParserOptions` ([w3c/webappsec#710](https://github.com/w3c/webappsec/issues/710#issuecomment-5641356255)) and [`trusted-or-sanitized` explainer](https://github.com/mozilla/explainers/blob/main/trusted-or-sanitized-html.md) (@noamr, @mozfreddyb) |
| 15:00 - 15:30 | 😴 |
| 15:30 - 16:30 | [_Breakout sessions_](https://www.w3.org/2026/10/TPAC/breakouts.html) |


## Interesting Breakouts to Highlight

_A random selection of security-related things @mikewest noticed; others are surely interesting as well! [The entire list](https://www.w3.org/calendar/tpac2026/breakout-sessions/grid/?tz=Europe%2FDublin) is worth skimming through._

### Monday (17:00 - 18:00)

* [Bringing Private Access Control Tokens to the Web](https://github.com/w3c/tpac2026-breakouts/issues/29)
* [End-to-end Encrypted Messaging with ActivityPub](https://github.com/w3c/tpac2026-breakouts/issues/52)

### Tuesday (15:30 - 16:30)

* [Agentic Web: declarative and imperative solutions](https://github.com/w3c/tpac2026-breakouts/issues/24)
* [Security by Design: From Threat Modeling to Security Considerations](https://github.com/w3c/tpac2026-breakouts/issues/66)

### Wednesday

#### 09:00 - 10:00

* [Extending WebMCP: Tool Granularity, Composition, and Agentic Steps](https://github.com/w3c/tpac2026-breakouts/issues/36)
* [Mitigating Shoulder Surfing via Progressively Enhanced Hardware-based Rendering](https://github.com/w3c/tpac2026-breakouts/issues/47)
* [Originator Profile -- 2026 Progress Update](https://github.com/w3c/tpac2026-breakouts/issues/60)

#### 10:30 - 11:30

* [Agentic Web: permissions, actions, and alignment](https://github.com/w3c/tpac2026-breakouts/issues/25)
* [Security and privacy considerations for peripherals](https://github.com/w3c/tpac2026-breakouts/issues/59)
* [Prohibit HTTP Link header preload from subresources](https://github.com/w3c/tpac2026-breakouts/issues/73)

#### 11:45 - 12:45

* [Agent Security](https://github.com/w3c/tpac2026-breakouts/issues/5)
* [Storage capabilities for session resumption](https://github.com/w3c/tpac2026-breakouts/issues/46)

#### 14:00 - 15:00

* [Private Groups in ActivityPub](https://github.com/w3c/tpac2026-breakouts/issues/53)
* [Integrating WebMCP into WebExtensions](https://github.com/w3c/tpac2026-breakouts/issues/84)

#### 15:15 - 16:15

* [Email Verification API](https://github.com/w3c/tpac2026-breakouts/issues/8)

#### 16:30 - 17:30
* [Accessibility and Privacy](https://github.com/w3c/tpac2026-breakouts/issues/50)
* [When Browsers Act for You: User Consent, Consequential Actions, and Agent Neutrality](https://github.com/w3c/tpac2026-breakouts/issues/71)

### Thursday (17:00 - 18:00)

* [The future of agentic web experiences](https://github.com/w3c/tpac2026-breakouts/issues/31)

### Friday (08:30 - 09:30)

* [What can go wrong with the new KSK and what W3C communities can do to minimize the risks](https://github.com/w3c/tpac2026-breakouts/issues/83)
* [Visibility Security Model and CSS Styling Restrictions for Elements](https://github.com/w3c/tpac2026-breakouts/issues/92)


## Time Zone Overlap Calculator

| Location | | | | | | | | | | |
|-:|-|-|-|-|-|-|-|-|-|-|
| Dublin (GMT)      | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
| Japan (JST / GMT+9)       | **17** | **18** | **19** | _20_ | _21_ | _22_ | _23_ | _00_ | _01_ | _02_ | _03_ | 
| New York (EST / GMT-4)   | _04_ | _05_ | _06_ | _07_ | **08** | **09** | **10** | **11** | **12** | **13** | **14** |
| California (PST / GMT-7) | _01_ | _02_ | _03_ | _04_ | _05_ | _06_ | _07_ | **08** | **09** | **10** | **11** |

_Note: Ireland shifts from IST to GMT on Sunday, Oct. 25th. Other countries, like the USA, don't shift their clocks until November, which means the time zone offset is a bit atypical during TPAC week._

### Logistics

*   **Minutes**: <https://pad.w3.org/p/WebAppSec_2026-10-TPAC> (Use your W3C credentials)
*   [Add these events](https://www.w3.org/groups/wg/webappsec/calendar#export) to your calendar
*   **`#webappsec`** on [W3C's slack instance](https://w3ccommunity.slack.com/)
    * <https://www.w3.org/slack-w3ccommunity-invite> if you haven't already joined.
*   **Zoom**:
    * Details at <https://auth.w3.org/?url=https://www.w3.org/groups/wg/webappsec/calendar>
