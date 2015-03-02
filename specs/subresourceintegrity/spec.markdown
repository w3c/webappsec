<section id="abstract">
This specification defines a mechanism by which user agents may verify that
a fetched resource has been delivered without unexpected manipulation.
</section>

<section id="sotd">
A list of changes to this document may be found at
<https://github.com/w3c/webappsec>.
</section>

<section class="informative">
## Introduction

Sites and applications on the web are rarely composed of resources from
only a single origin. For example, authors pull scripts and styles from a
wide variety of services and content delivery networks, and must trust
that the delivered representation is, in fact, what they expected to
load. If an attacker can trvick a user into downloading content from
a hostile server (via DNS poisoning, or other such means), the author has
no recourse. Likewise, an attacker who can replace the file on the CDN server
has the ability to inject arbitrary content.

Delivering resources over a secure channel mitigates some of this risk: with
TLS, [HSTS][], and [pinned public keys][], a user agent can be fairly certain
that it is indeed speaking with the server it believes it's talking to. These
mechanisms, however, authenticate _only_ the server, _not_ the content. An
attacker (or admin!) with access to the server can manipulate content with
impunity. Ideally, authors would not only be able to pin the keys of a
server, but also pin the _content_, ensuring that an exact representation of
a resource, and _only_ that representation, loads and executes.

This document specifies such a validation scheme, extending several HTML
elements with an `integrity` attribute that contains a cryptographic hash of
the representation of the resource the author expects to load. For instance,
an author may wish to load jQuery from a shared server rather than hosting it
on their own origin. Specifying that the _expected_ SHA-256 hash of
`https://code.jquery.com/jquery-1.10.2.min.js`
is `C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg=` means
that the user agent can verify that the data it loads from that URL matches
that expected hash before executing the JavaScript it contains. This
integrity verification significantly reduces the risk that an attacker can
substitute malicious content.

This example can be communicated to a user agent by adding the hash to a
`script` element, like so:

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"
            integrity="type:application/javascript
                       sha256-C6CB9UYIS9UJeqinPHWTHVqh/E1uhG5Twh+Y5qFQmYg=">

{:.example.highlight}

Scripts, of course, are not the only resource type which would benefit
from integrity validation. The scheme specified here applies to all HTML
elements which trigger fetches, as well as to fetches triggered from CSS
and JavaScript.

Moreover, integrity metadata may also be useful for purposes other than
validation. User agents may decide to use the integrity metadata as an
identifier in a local cache, for instance, meaning that common resources
(for example, JavaScript libraries) could be cached and retrieved once,
regardless of the URL from which they are loaded.

[HSTS]: http://tools.ietf.org/html/rfc6797
[pinned public keys]: http://tools.ietf.org/html/draft-ietf-websec-key-pinning

<section>
### Goals

1.  Compromise of the third-party service should not automatically mean
    compromise of every site which includes its scripts. Content authors
    will have a mechanism by which they can specify expectations for
    content they load, meaning for example that they could load a
    _specific_ script, and not _any_ script that happens to have a
    particular URL.

2.  The verification mechanism should have reporting functionality which
    would inform the author that an invalid resource was downloaded.
    Further it should be possible for an author to choose to run _only_
    the reporting functionality, allowing potentially corrupt resources
    to run on her site, but flagging violations for manual review.

3.  The metadata provided for verification may enable improvements to
    user agents' caching schemes: common resources such as JavaScript
    libraries can be downloaded once, and only once, even if multiple
    instances with distinct URLs are requested.

</section><!-- /Introduction::Goals -->

<section>
### Use Cases/Examples

<section>
#### Resource Integrity

*   An author wishes to use a content delivery network to improve performance
    for her globally-distributed users. She wishes to ensure, however, that
    the CDN's servers deliver _only_ the code she expects them to deliver. She
    can mitigate the risk that CDN compromise (or unexpectedly malicious
    behavior) would change her code in unfortunate ways by adding
    [integrity metadata][] to the `link` element included on her page:

        <link rel="stylesheet" href="https://site53.cdn.net/style.css"
              integrity="type:text/css sha256-SDfwewFAE...wefjijfE">
    {:.example.highlight}

*   An author wants to include JavaScript provided by a third-party
    analytics service on her site. She wants, however, to ensure that only
    the code she's carefully reviewed is executed. She can do so by generating
    [integrity metadata][] for the script she's planning on including, and
    adding it to the `script` element she includes on her page:

        <script src="https://analytics-r-us.com/v1.0/include.js"
                integrity="type:application/javascript
                           sha256-SDfwewFAE...wefjijfE"></script>
    {:.example.highlight}

*   A user agent wishes to ensure that pieces of its UI which are rendered via
    HTML (for example, Chrome's New Tab Page) aren't manipulated before display.
    [Integrity metadata][] mitigates the risk that altered JavaScript will run
    in these page's high-privilege context.

*   The author of a mash-up wants to make sure her creation remains in a working
    state. Adding [integrity metadata][] to external subresources defines an
    expected revision of the included files. The author can then use the reporting
    functionality to be notified of changes to the included resources.

</section><!-- Introduction::UseCases::Integrity -->
</section><!-- /Introduction::Use Cases -->
</section><!-- /Introduction -->

<section id="conformance">
Conformance requirements phrased as algorithms or specific steps can be
implemented in any manner, so long as the end result is equivalent. In
particular, the algorithms defined in this specification are intended to
be easy to understand and are not intended to be performant. Implementers
are encouraged to optimize.

<section>
### Key Concepts and Terminology

This section defines several terms used throughout the document.

The term <dfn>digest</dfn> refers to the base64-encoded result of
executing a cryptographic hash function on an arbitrary block of data.

A <dfn>secure channel</dfn> is any communication mechanism that the user
agent has defined as "secure" (typically limited to HTTP over Transport
Layer Security (TLS) [[!RFC2818]]).

An <dfn>insecure channel</dfn> is any communication mechanism other than
those the user agent has defined as "secure".

Clarification needed whether we want to talk about (in)secure channels or (un)authenticated origins. This is Github issue 71 (freddyb). {:.issue data-number="71"}

The term <dfn>origin</dfn> is defined in the Origin specification.
[[!RFC6454]]

The <dfn>MIME type</dfn> of a resource is a technical hint about the use
and format of that resource. [[!MIMETYPE]]

The <dfn>message body</dfn> and the <dfn>transfer encoding</dfn> of a resource
are defined by [RFC7230, section 3][messagebody]. [[!RFC7230]] 

[messagebody]: http://tools.ietf.org/html/rfc7230#section-3

The <dfn>representation data</dfn> and <dfn>content encoding</dfn> of a resource
are defined by [RFC7231, section 3][representationdata]. [[!RFC7231]]

[representationdata]: http://tools.ietf.org/html/rfc7231#section-3

A <dfn>base64 encoding</dfn> is defined in [RFC 4648, section 4][base64].
[[!RFC4648]]

[base64]: http://tools.ietf.org/html/rfc4648#section-4

The Augmented Backus-Naur Form (ABNF) notation used in this document is
specified in RFC 5234. [[!ABNF]]

The <dfn>SHA-256</dfn>, <dfn>SHA-384</dfn>, and <dfn>SHA-512</dfn> are part
of the <dfn>SHA-2</dfn> set of cryptographic hash functions defined by the
NIST in ["Descriptions of SHA-256, SHA-384, and SHA-512"][sha].

[abnf-b1]: http://tools.ietf.org/html/rfc5234#appendix-B.1
[sha]: http://csrc.nist.gov/groups/STM/cavp/documents/shs/sha256-384-512.pdf
</section>
</section>

<section>
## Framework

The integrity verification mechanism specified here boils down to the
process of generating a sufficiently strong cryptographic digest for a
resource, and transmitting that digest to a user agent so that it may be
used when fetching the resource.

<section>
### Integrity metadata

To verify the integrity of a resource, a user agent requires <dfn>integrity
metadata</dfn>, which consists of the following pieces of information:

* cryptographic hash function ("alg")
* [digest][] ("val")
* the resource's [MIME type][] ("type")

The hash function and digest MUST be provided in order to validate a
resource's integrity. The MIME type SHOULD be provided, as it mitigates the
risk of certain attack vectors.

This metadata MUST be encoded in the same format as the `hash-source`
in [section 4.2 of the Content Security Policy Level 2 specification][csp2-section42].

For example, given a resource containing only the string "Hello, world.",
an author might choose [SHA-256][sha2] as a hash function.
`+MO/YqmqPm/BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8=` is the base64-encoded
digest that results. This can be encoded as follows:

    sha256-+MO/YqmqPm/BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8=
{:.example.highlight}

Or, if the author further wishes to specify the Content Type (`text/plain`):

    type:text/plain sha256-+MO/YqmqPm/BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8=
{:.example.highlight}

<div class="note">
Digests may be generated using any number of utilities. [OpenSSL][], for
example, is quite commonly available. The example in this section is the
result of the following command line:

    echo -n "Hello, world." | openssl dgst -sha256 -binary | openssl enc -base64 -A

[csp2-section42]: http://www.w3.org/TR/CSP11/#source-list-syntax
[openssl]: http://www.openssl.org/
</div>

[sha2]: #dfn-sha-2
[digest]: #dfn-digest
[MIME type]: #dfn-mime-type
[integrity metadata]: #dfn-integrity-metadata
</section><!-- /Framework::Required metadata -->

<section>
### Cryptographic hash functions

Conformant user agents MUST support the [SHA-256][sha2], [SHA-384][sha2]
and [SHA-512][sha2] cryptographic hash functions for use as part of a
resource's [integrity metadata][], and MAY support additional hash functions.

<section>
#### Agility

Multiple sets of [integrity metadata][] may be associated with a single
resource in order to provide agility in the face of future discoveries.
For example, the "Hello, world." resource described above may be described
either of the following `ni` URLs:

    sha256-+MO/YqmqPm/BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8=
    sha512-rQw3wx1psxXzqB8TyM3nAQlK2RcluhsNwxmcqXE2YbgoDW735o8TPmIR4uWpoxUERddvFwjgRSGw7gNPCwuvJg==
{:.example.highlight}

Authors may choose to specify both, for example:

    <script src="hello_world.js"
       integrity="type:application/javascript
          sha256-+MO/YqmqPm/BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8=
          sha512-rQw3wx1psxXzqB8TyM3nAQlK2RcluhsNwxmcqXE2YbgoDW735o8TPmIR4uWpoxUERddvFwjgRSGw7gNPCwuvJg==
        "></script>

In this case, the user agent will choose the strongest hash function in the
list, and use that metadata to validate the resource (as described below in
the "[parse metadata][parse]" and "[get the strongest metadata from
set][get-the-strongest]" algorithms).

When a hash function is determined to be insecure, user agents MUST deprecate
and eventually remove support for integrity validation using that hash
function.

To allow authors to switch to stronger hash functions without being held back by older
user agents, validation using unsupported hash functions acts like no integrity value 
was provided (see the "[Does resource match metadataList][match]" algorithm below). 
Authors  are encouraged to use strong hash functions, and to begin migrating to 
stronger hash functions as they become available.
</section><!-- /Framework::Cryptographic hash functions::Agility -->

<section>
#### Priority

User agents MUST provide a mechanism of determining the relative priority of
two hash functions. That is, <dfn>getPrioritizedHashFunction(a, b)</dfn> MUST
return the hash function the user agent considers the most collision-resistant.
For example, `getPrioritizedHashFunction('SHA-256', 'SHA-512')` would return
`SHA-512`.

If both algorithms are equally strong, the user agent SHOULD ensure that there
is a consistent ordering.
</section><!-- /Framework::Cryptographic hash functions::Priority -->

</section><!-- /Framework::Cryptographic hash functions -->

<section>
### Resource verification algorithms

<section>
#### Apply <var>algorithm</var> to <var>resource</var>

1.  Let <var>result</var> be the result of [applying <var>algorithm</var>][apply-algorithm]
    to the [representation data][representationdata] without any content-codings
    applied, except when the user agent intends to consumes the content with
    content-encodings applied (e.g., saving a gzip’d file to disk). In the
    latter case, let <var>result</var> be the result of applying
    <var>algorithm</var> to the [representation data][representationdata].
2.  Let <var>encodedResult</var> be result of base64-encoding
    <var>result</var>.
3.  Return <var>encodedResult</var>.

[apply-algorithm]: #apply-algorithm-to-resource
</section><!-- Algorithms::apply -->
<section>
#### Is <var>resource</var> eligible for integrity validation
[eligible]: #is-resource-eligible-for-integrity-validation

In order to mitigate an attacker's ability to read data cross-origin by
brute-forcing values via integrity checks, resources are only eligible
for such checks if they are same-origin, publicly cachable, or are the
result of explicit access granted to the loading origin via CORS. [[!CORS]]

As noted in [RFC6454, section 4](uri-origin), some user agents use
globally unique identifiers for each file URI. This means that
resources accessed over a `file` scheme URL are unlikely to be
eligible for integrity checks.
{:.note}

[uri-origin]: http://tools.ietf.org/html/rfc6454#section-4

Certain HTTP headers can also change the way the resource behaves in
ways which integrity checking cannot account for. If the resource
contains these headers, it is ineligible for integrity validation:

*   `Authorization` or `WWW-Authenticate` hide resources behind a login;
    such non-public resources are excluded from integrity checks.
*   `Refresh` can cause IFrame contents to transparently redirect to an
    unintended target, bypassing the integrity check.

Consider the impact of other headers: `Content-Length`, `Content-Range`,
etc. Is there danger there?
{:.issue data-number="3"}
  
The following algorithm details these restrictions:

1.  Let <var>request</var> be the request that fetched
    <var>resource</var>.
2.  If <var>resource</var> contains any of the following HTTP headers,
    return `false`:
    * `Authorization`
    * `WWW-Authenticate`
    * `Refresh`
3.  If the [mode][fetch-mode] of <var>request</var> is `CORS`,
    return `true`.
4.  If the [origin][fetch-origin] of <var>request</var> is
    <var>resource</var>'s origin, return `true`.
5.  If <var>resource</var> is [cachable by a shared cache][], as defined
    in [[!RFC7234]], return `true`.
6.  Return `false`.

Step 2 returns `true` if the resource was a CORS-enabled request. If the
resource failed the CORS checks, it won't be available to us for integrity
checking because it won't have loaded successfully.
{:.note}

[fetch-mode]: http://fetch.spec.whatwg.org/#concept-request-mode
[fetch-origin]: http://fetch.spec.whatwg.org/#concept-request-origin
[cachable by a shared cache]: http://tools.ietf.org/html/rfc7234#section-3
</section><!-- Algorithms::eligible -->
<section>
#### Parse <var>metadata</var>.

This algorithm accepts a string, and returns either `no metadata`, or a set of
valid "named information" (`ni`) URLs whose hash functions are understood by
the user agent.

1.  If <var>metadata</var> is the empty string, return `no metadata`.
2.  Let <var>result</var> be the empty set.
3.  For each <var>token</var> returned by [splitting <var>metadata</var> on
    spaces][split-on-spaces]:
    1.  If <var>token</var> is not a valid metadata, skip the remaining
        steps, and proceed to the next token.
    2.  Let <var>algorithm</var> be the <var>alg</var> component of
        <var>token</var>.
    3.  If <var>algorithm</var> is a hash function recognized by the user
        agent, add <var>token</var> to <var>result</var>.
4.  Return `no metadata` if <var>result</var> is empty, otherwise return
    <var>result</var>.

[split-on-spaces]: http://www.w3.org/TR/html5/infrastructure.html#split-a-string-on-spaces
</section><!-- Algorithms::parse -->
<section>
#### Get the strongest metadata from <var>set</var>.

1.  Let <var>strongest</var> be the empty string.
2.  For each <var>item</var> in <var>set</var>:
    1.  If <var>strongest</var> is the empty string, set <var>strongest</var>
        to <var>item</var>, skip to the next
        <var>item</var>.
    2.  Let <var>currentAlgorithm</var> be the <var>alg</var> component of
        <var>strongest</var>.
    3.  Let <var>newAlgorithm</var> be the <var>alg</var> component of
        <var>item</var>.
    4.  If the result of [`getPrioritizedHashFunction(currentAlgorithm, newAlgorithm)`][getPrioritizedHashFunction]
        is <var>newAlgorithm</var>, set <var>strongest</var> to
        <var>item</var>.
3.  Return <var>strongest</var>.

[getPrioritizedHashFunction]: #dfn-getprioritizedhashfunction-a-b
</section><!-- /Algorithms::get the strongest metadata -->
<section>
#### Does <var>resource</var> match <var>metadataList</var>?

1.  If <var>resource</var>'s URL's scheme is `about`, return `true`.
2.  If [<var>resource</var> is not eligible for integrity
    validation][eligible], return `false`.
3.  Let <var>parsedMetadata</var> be the result of
    [parsing <var>metadataList</var>][parse].
4.  If <var>parsedMetadata</var> is `no metadata`, return `true`.
5.  Let <var>metadata</var> be the result of [getting the strongest
    metadata from <var>parsedMetadata</var>][get-the-strongest].
6.  Let <var>algorithm</var> be the <var>alg</var> component of
    <var>metadata</var>.
7.  Let <var>expectedValue</var> be the <var>val</var> component of
    <var>metadata</var>.
8.  Let <var>expectedType</var> be the <var>type</var> component of
    <var>metadata</var>.
9.  If <var>expectedType</var> is not the empty string, and is not a
    case-insensitive match for <var>resource</var>'s [MIME type][],
    return `false`.
10. Let <var>actualValue</var> be the result of [applying
    <var>algorithm</var> to <var>resource</var>][apply-algorithm].
11. If <var>actualValue</var> is a case-sensitive match for
    <var>expectedValue</var>, return `true`. Otherwise, return `false`.

If <var>expectedType</var> is the empty string in #10, it would
be reasonable for the user agent to warn the page's author about the
dangers of MIME type confusion attacks via its developer console.
{:.note}

User agents may allow users to modify the result of this algorithm via user
preferences, bookmarklets, third-party additions to the user agent, and other
such mechanisms. For example, redirects generated by an extension like
[HTTPSEverywhere](https://www.eff.org/https-everywhere) could load and execute
correctly, even if the HTTPS version of a resource differs from the HTTP version.
{:.note}

[parse]: #parse-metadata.x
[get-the-strongest]: #get-the-strongest-metadata-from-set.x
[match]: #does-resource-match-metadatalist
</section><!-- Algorithms::Match -->
</section><!-- Algorithms -->

<section>
### Modifications to Fetch

The Fetch specification should contain the following modifications in order
to enable the rest of this specification's work [[!FETCH]]:

1.  The following text should be added to [section 2.1.4][fetch-requests]: "A
    [request][fetch-request] has an associated [integrity metadata][].
    Unless stated otherwise, a request's integrity metadata is the empty
    string."

2.  The following text should be added to [section 2.1.5][fetch-responses]: "A
    [response][fetch-response] has an associated integrity state, which
    is one of `indeterminate`, `pending`, `corrupt`, and `intact`. Unless
    stated otherwise, it is `indeterminate`.

3.  Perform the following steps before executing both the "[basic fetch][]" and
    "[CORS fetch with preflight][]" algorithms:

    1.  If <var>request</var>'s integrity metadata is the empty string, set
        <var>response</var>'s integrity state to `indeterminate`. Otherwise:

        1.  Set <var>response</var>'s integrity state to `pending`.
        2.  Include a `Cache-Control` header whose value is "no-transform".
        3.  If <var>request</var>'s integrity metadata contains a Content Type:
            1.  Set <var>request</var>'s `Accept` header value to the value
                of <var>request</var>'s integrity metadata's Content Type.

4.  Add the following step before step #1 of the handling of 401 status
    codes in the [HTTP fetch][] algorithm:

    1.  If <var>request</var>'s integrity state is `pending`, set
        <var>response</var>'s integrity state to `corrupt` and return
        <var>response</var>.

5.  Before firing the [process request end-of-file][] event for any
    <var>request</var>:

    1.  If the <var>request</var>'s integrity metadata is the empty string, set
        the <var>response</var>'s integrity state to `indeterminate` and
        skip directly to firing the event.

    2.  If <var>response</var> [matches][match] the request's integrity
        metadata, set the <var>response</var>'s integrity state to `intact`
        and skip directly to firing the event.

    3.  Set the <var>response</var>'s integrity state to `corrupt`
        and skip directly to firing the event.

[fetch-requests]: http://fetch.spec.whatwg.org/#requests
[fetch-responses]: http://fetch.spec.whatwg.org/#responses
[fetch-request]: http://fetch.spec.whatwg.org/#concept-request
[fetch-response]: http://fetch.spec.whatwg.org/#concept-response
[basic fetch]: http://fetch.spec.whatwg.org/#basic-fetch
[HTTP fetch]: https://fetch.spec.whatwg.org/#http-fetch
[CORS fetch with preflight]: http://fetch.spec.whatwg.org/#cors-fetch-with-preflight
[process request end-of-file]: https://fetch.spec.whatwg.org/#process-request-end-of-file
</section>

<section>
### Verification of HTML document subresources

A variety of HTML elements result in requests for resources that are to be
embedded into the document, or executed in its context. To support integrity
metadata for each of these, and new elements that are added in the future,
a new `integrity` attribute is added to the list of content attributes for
the `link` and `script` elements.

A corresponding `integrity` IDL attribute which [reflects][reflect] the
value each element's `integrity` content attribute is added to the
`HTMLLinkElement` and `HTMLScriptElement` interfaces.

A future revision of this specification is likely to include SRI support
for all possible subresources, i.e., `a`, `audio`, `embed`, `iframe`, `img`,
`link`, `object`, `script`, `source`, -`track`, and `video` elements.
{:.note}

</section>

<section>
#### The `integrity` attribute

The `integrity` attribute represents [integrity metadata][] for an element.
The value of the attribute MUST be either the empty string, or at least one
valid metadata as described by the following ABNF grammar:

    integrity-metadata = *WSP [ option-expression *( 1*WSP option-expression ) *WSP ] hash-expression *( 1*WSP hash-expression ) *WSP / *WSP
    option-expression  =  option-name ":" [ option-value ]
    option-name        = ALPHA / DIGIT / "-"
    option-value       = ALPHA / DIGIT / "-" / "+" / "." / "/"
    hash-algo          = <hash-algo production from [Content Security Policy Level 2, section 4.2]>
    base64-value       = <base64-value production from [Content Security Policy Level 2, section 4.2]>
    hash-expression    = hash-algo "-" base64-value

At the moment, the only option-name that is defined is `type` and its
value must be a valid [MIME type][].

The `integrity` IDL attribute must [reflect][] the `integrity` content attribute.

[reflect]: http://www.w3.org/TR/html5/infrastructure.html#reflect
</section><!-- /Framework::HTML::integrity -->

<section>
#### Element interface extensions

<section>
##### HTMLLinkElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLLinkElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLLinkElement -->
<section>
##### HTMLScriptElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLScriptElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLScriptElement -->
</section><!-- /Framework::HTML::Interface extensions -->
<section>
#### Handling integrity violations

Documents may specify the behavior of a failed integrity check by delivering
a [Content Security Policy][csp] which contains an `integrity-policy`
directive, defined by the following ABNF grammar:

    directive-name  = "integrity-policy"
    directive-value = 1#failure-mode [ "require-for-all" ]
    failure-mode    = ( "block" / "report" )

A document's <dfn>integrity policy</dfn> is the value of the
`integrity-policy` directive, if explicitly provided as part of the
document's Content Security Policy, or `block` otherwise.

If the document's integrity policy contains `block`, the user agent MUST refuse
to render or execute resources that fail an integrity check, <em>and</em> MUST
[report a violation][].

If the document's integrity policy contains `report`, the user agent MAY render
or execute resources that fail an integrity check, <em>but</em> MUST
[report a violation][].

If the document's integrity policy contains `require-for-all`, the user agent
MUST treat the lack of [integrity metadata][] for an resource as automatic
failure, refuse to fetch the resource, and [report a violation][].
{:.issue data-number="7"}

[csp]: http://w3.org/TR/CSP2
[report a violation]: http://www.w3.org/TR/CSP2/#report-a-violation
[integrity policy]: #dfn-integrity-policy
</section>

<section>
##### Elements

<section>
###### The `link` element for stylesheets

Whenever a user agent attempts to [obtain a resource][] pointed to by a
`link` element that has a `rel` attribute with the value of `stylesheet`:

1.  Set the [integrity metadata][] of the request to the value
    of the element's `integrity` attribute.

Additionally, perform the following steps before firing a `load` event at
the element:

1.  If the response's integrity state is `corrupt`:
    1.  If the document's [integrity policy][] is `block`:
        1.  Abort the `load` event, and treat the resource as having failed
            to load.
        2.  If <var>resource</var> is [same origin][] with the origin of
            the `link` element's Document, then [queue a task][] to
            [fire a simple event][] named `error` at the `link` element.
    2.  [Report a violation][].

[obtain a resource]: http://www.w3.org/TR/html5/document-metadata.html#concept-link-obtain
[same origin]: http://tools.ietf.org/html/rfc6454#section-5
</section><!-- /Framework::HTML::link -->

<section>
###### The `script` element

When executing step 5 of step 14 of HTML5's
["prepare a script" algorithm][prepare]:

1.  Set the [integrity metadata][] of the request to the value
    of the element's `integrity` attribute.

Insert the following steps after step 5 of step 14 of HTML5's
["prepare a script" algorithm][prepare]:

8.  Once the [fetching algorithm][] has completed:
    2.  If the response's integrity state is `corrupt`:
        1.  If the document's [integrity policy][] is `block`:
            1.  If <var>resource</var> is [same origin][] with the `script`
                element's Document's origin, then [queue a task][] to
                [fire a simple event][] named `error` at the element, and
                abort these steps.
        2.  [Report a violation][].
{:start="6"}

[prepare]: http://www.w3.org/TR/html5/scripting-1.html#prepare-a-script
[fetching algorithm]: http://www.w3.org/TR/html5/infrastructure.html#fetch
[queue a task]: http://www.w3.org/TR/html5/webappapis.html#queue-a-task
[fire a simple event]: http://www.w3.org/TR/html5/webappapis.html#fire-a-simple-event
[bz]: http://lists.w3.org/Archives/Public/public-webappsec/2013Dec/0048.html
</section><!-- /Framework::HTML::Elements::script -->

</section><!-- /Framework::HTML::Elements -->

</section><!-- /Framework::HTML -->

<section>
### Verification of CSS-loaded subresources

Tab and Anne are poking at adding `fetch()` to some spec somewhere
which would allow CSS files to specify various arguments to the fetch
algorithm while requesting resources. Detail on the proposal is at
<http://lists.w3.org/Archives/Public/public-webappsec/2014Jan/0129.html>.
Once that is specified, we can proceed defining an `integrity` argument
that would allow integrity checks in CSS.
{:.issue data-number="13"}

</section><!-- /Framework::CSS -->

</section><!-- /Framework -->

<section>
## Proxies

Optimizing proxies and other intermediate servers which modify the
content of fetched resources MUST ensure that the digest associated
with those resources stays in sync with the new content. One option
is to ensure that the [integrity metadata][] associated with
resources is updated along with the resource itself. Another
would be simply to deliver only the canonical version of resources
for which a page author has requested integrity verification. To
support this latter option, user agents MUST send a
[`Cache-Control`][cachecontrol] header with a value of
[`no-transform`][notransform] when requesting a resource with
associated integrity metadata (see item 3 in the "[Modifications to
Fetch][]" section).

Think about how integrity checks would effect `vary` headers
in general.
{:.issue data-number="17"}

[cachecontrol]: http://tools.ietf.org/html/rfc7234#section-5.2
[notransform]: http://tools.ietf.org/html/rfc7234#section-5.2.1.6
[Modifications to Fetch]: #modifications-to-fetch
</section><!-- /Implementation -->

<section>
## Security Considerations

<section>
### Insecure channels remain insecure

[Integrity metadata][] delivered over an insecure channel only protects an
origin against a compromise of the server where an external resources is
hosted. Network attackers can alter the digest in-flight (or remove it
entirely (or do absolutely anything else to the document)), just as they
could alter the resource the hash is meant to validate. Authors SHOULD
deliver integrity metadata over secure channels. See also [securing the web][].

[Securing the Web]: https://w3ctag.github.io/web-https/
</section><!-- /Security::Insecure channels -->

<section>
### Hash collision attacks

Digests are only as strong as the hash function used to generate them. User
agents SHOULD refuse to support known-weak hashing functions like MD5 or SHA-1,
and SHOULD restrict supported hashing functions to those known to be
collision-resistant. At the time of writing, SHA-256 is a good baseline.
Moreover, user agents SHOULD reevaluate their supported hashing functions
on a regular basis, and deprecate support for those functions shown to be
insecure.
</section><!-- /Security::Hash collision -->

<section>
### Cross-origin data leakage

Attackers can determine whether some cross-origin resource has certain
content by attempting to load it with a known digest, and watching for
load failure. If the load fails, the attacker can surmise that the
resource didn't match the hash, and thereby gain some insight into its
contents. This might reveal, for example, whether or not a user is
logged into a particular service.

Moreover, attackers can brute-force specific values in an otherwise
static resource: consider a JSON response that looks like this:

    {'status': 'authenticated', 'username': 'Stephan Falken'}
{:.example.highlight}

An attacker can precompute hashes for the response with a variety of
common usernames, and specify those hashes while repeatedly attempting
to load the document. By examining the reported violations, the attacker
can obtain a user's username.

User agents SHOULD mitigate the risk by refusing to fire `error` events
on elements which loaded cross-origin resources, but some side-channels
will likely be difficult to avoid (image's `naturalHeight` and
`naturalWidth` for instance).
</section><!-- /Security::cross-origin -->

</section><!-- /Security -->

<section>
## Acknowledgements

None of this is new. Much of the content here is inspired heavily by Gervase
Markham's [Link Fingerprints][] concept, as well as WHATWG's [Link Hashes][].

A special thanks to Mike West of Google, Inc. for his invaluable contributions
to the initial version of this spec.

[Link Fingerprints]: http://www.gerv.net/security/link-fingerprints/
[Link Hashes]: http://wiki.whatwg.org/wiki/Link_Hashes
</section>
