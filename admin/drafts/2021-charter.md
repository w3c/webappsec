# WebAppSec Charter 2021 DRAFT

## Mission

The **mission** of the [Web Application Security Working Group](http://www.w3.org/2011/webappsec/) is to develop mechanisms and best practices which improve the security of Web Applications.

## Scope

Modern web applications are composed of many parts and technologies, creating a complex tapestry of resource and data flows between origins. This complexity, as well as the historically coarse-grained nature of the security boundaries and principals defined for such applications, they can be very difficult to secure. At the same time, securing these applications is ever more critical, as the web becomes more and more critical to users' lives.

This group focuses on the client-side of the problem, designing mechanisms user agents can provide to web developers which mitigate the risk of common web attacks, and reduce the surface area that applications expose to attackers. Areas of scope for this working group include:

## Vulnerability Mitigation

Sufficiently complex applications involve handling input from untrusted sources in ways that can lead to unexpected code execution, data manipulation, or exfiltration. This WG will design mechanisms which reduce the scope, exploitability and impact of common vulnerabilities and vulnerability classes in web applications (e.g. cross-site scripting, clickjacking, and so on).

### Attack Surface Reduction

The WG will design mechanisms which prevent certain categories of threat by reducing the privilege of a given context. This effort will result in tools developers can opt-into which:

* Allows applications to restrict or forbid potentially dangerous features which they do not intend to use
* Governs information and content flows into and out of an application
* Allows applications to isolate themselves from other origins
* Reduces the privilege of potentially untrusted content and allow it to be interacted with more safely
* Ensures that application content modification may be detected and prevented
* Replaces or augment error-prone APIs in the browser with safer alternatives (e.g. sanitization, strict contextual autoescaping, validation and encoding requirements, and so on)
* Enforce requirements on content which loads in a given context (e.g. transport security, embedder/embedee constraints, CORS, etc)

To the extent possible, these restrictions may also be imposed by default to uniformly reduce risk at scale, or may be positioned as prerequisites to some capability or set of capabilities applications may wish to exercise.

### Manageability

Given the ad-hoc nature in which many important security features of the Web have evolved, providing uniformly secure experiences to users is difficult for developers. The WG will document and create uniform experiences for several undefined areas of major utility, including:

* Providing hinting and direct support for credential managers, whether integrated into the user-agent or 3rd-party, to assist users in managing the complexities of secure passwords
* Application awareness of features which may require explicit user permission to enable.

### The Web Security Model

The WG may be called on to advise other WGs or the TAG on the fundamental security model of the Web Platform. In doing so, the WG may produce Recommendations for addressing legacy issues with the model (e.g. deprecations and removals), as well as improvements to the baseline it sets (e.g. mitigating cross-origin data leaks or side-channel attacks).

In addition to developing Recommendation Track documents in support of these goals, the Web Application Security Working Group may provide review of specifications from other Working Groups, in particular as these specifications touch on chartered deliverables of this group (in particular CSP), or the Web security model, and may also develop non-normative documents in support of Web security, such as developer and user guides for its normative specifications.

## Success Criteria

To advance to Proposed Recommendation, each specification is expected to have two independent implementations of each feature described in the specification.

Each specification should contain a section detailing all known security and privacy implications for implementers, Web authors, and end users.

For specifications of technologies that directly impact user experience, each specification should contain a section on accessibility that describes the benefits and impacts, including ways specification features can be used to address them, and recommendations for maximising accessibility in implementations.

## Deliverables

* CSP3 (FPWD; Editor’s draft last update Nov 2020)
* Content Security Policy: Embedded Enforcement (Editor’s draft, last update Oct 2018)
* Mixed Content (Level 1 CR 2106; Level 2 Editor’s draft, last update Nov 2020)
* Upgrade Insecure Requests (CR in 2015; last update 2016)
* Secure Contexts (CR 2016; last update Feb 2020)
* Clear Site Data (Editor’s draft; last update Nov 2017)
* Referrer Policy (CR 2017; last update July 2020)
* Credential Management API (Editor’s draft, last update Oct 2019)
* Subresource Integrity Level 2 (Level 1 REC 2016; Level 2 Editor’s draft, last update Jan 2020)
* Suborigins (Last update May 2017)
* Origin-Wide Policy (Still in WICG)
* Permissions API (Editor’s draft, last update July 2020)
* Permissions Policy (Editor’s draft, last update Dec 2020)

## Dependencies and Liasons

### W3C Groups

* [Web Platform WG](https://www.w3.org/WebPlatform/WG/): The WG may coordinate with Web Platform WG around API design. The [HTML](https://www.w3.org/TR/html5/) specification defines many of the security policies that apply in the current browser environment, and Subresource Integrity defines new attributes that may be applied to HTML tags.
* [Privacy Interest Group](https://www.w3.org/Privacy/): The WG may ask the Privacy Interest Group to review some of its specifications for privacy considerations.
* [Web Security Interest Group](https://www.w3.org/Security/wiki/IG): The WG may ask the Web Security Interest Group review some of its specifications for security considerations.
* [Technical Architecture Group (TAG)](https://www.w3.org/2001/tag/): The WG will liaise with the Technical Architecture Group to review some of its specifications.
* [Accessible Platform Architectures Working Group](https://www.w3.org/WAI/APA): The WG will liaise with APA to review some of its specifications for potential accessibility issues.
* [Web Authentication Working Group](https://www.w3.org/Webauthn/): The WG will liaise with the Web Authentication WG on Credential Management.
* [Device and Sensors Working Group](https://www.w3.org/2009/dap/): The WG may work with the Device and Sensors WG on the security of their client-side APIs.

### Outside Groups

* [Web Hypertext Application Technology Working Group (WHATWG)](https://whatwg.org/): Specifications such as CSP provide inputs into the algorithms defined by, e.g. the Fetch specification and portions of CSP and Mixed Content may be defined in terms of Fetch. WebAppSec will work with WHATWG Fetch to ensure that CSP's normative dependencies on Fetch satisfy the W3C [normative references policy](https://www.w3.org/2013/09/normative-references).

## Participation

To be successful, the Web Application Security Working Group is expected to have 10 active participants for its duration. Effective participation to Web Application Security Working Group is expected to consume one day per week for chairs and editors. The Web Application Security Working Group will allocate also the necessary resources for building Test Suites for each specification.

## Communication

This group conducts general discussion on the public mailing list public-webappsec@w3.org ([archive](http://lists.w3.org/Archives/Public/public-webappsec/)).

Discussion on issues related to specific deliverables is primarily conducted through the use of GitHub issues. The WG's main GitHub repository is at <https://github.com/w3c/webappsec>, which links to individual repositories for each deliverable.

Information about the group (deliverables, participants, face-to-face meetings, teleconferences, etc.) is available from the [Web Application Security Working Group home page](http://www.w3.org/2011/webappsec/).

## Decision Policy

As explained in the Process Document ([section 3.3](https://www.w3.org/Consortium/Process/policies#Consensus)), this group will seek to make decisions when there is consensus. When the Chair puts a question and observes dissent, after due consideration of different opinions, the Chairs should put a question out for voting within the group (allowing for remote asynchronous participation -- using, for example, email and/or web-based survey techniques) and record a decision, along with any objections. The matter should then be considered resolved unless and until new information becomes available.

Any resolution first taken in a face-to-face meeting or teleconference [i.e., that does not follow a 7 day call for consensus on the mailing list] is to be considered provisional until confirmed by an asynchronous call for consensus. If no objections are raised on the mailing list within that time, the resolution will be considered to have consensus as a resolution of the Working Group.

## Patent Policy

This Working Group operates under the [W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy/) (Version of 5 February 2004 updated 1 August 2017). To promote the widest adoption of Web standards, W3C seeks to issue Recommendations that can be implemented, according to this policy, on a Royalty-Free basis. For more information about disclosure obligations for this group, please see the [W3C Patent Policy Implementation](https://www.w3.org/2004/01/pp-impl/).

## Licensing

This Working Group will use the [W3C Software and Document license](https://www.w3.org/Consortium/Legal/copyright-software) for all deliverables.

## About This Charter

This charter for the Web Application Security Working Group has been created according to [section 5.2](https://www.w3.org/Consortium/Process/groups#GAGeneral) of the [Process Document](https://www.w3.org/Consortium/Process). In the event of a conflict between this document or the provisions of any charter and the W3C Process, the W3C Process shall take precedence.
