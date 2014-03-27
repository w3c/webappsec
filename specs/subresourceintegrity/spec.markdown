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
only a single origin. Authors pull scripts, images, fonts, etc. from a
wide variety of services and content delivery networks, and must trust
that the delivered representation is, in fact, what they expected to
load. If an attacker can trick a user into downloading content from
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
elements with a `integrity` attribute that contains a cryptographic hash of
the representation of the resource the author expects to load. For instance,
an author may wish to load jQuery from a shared server rather than hosting it
on their own origin. Specifying that the _expected_ SHA-256 hash of
`https://code.jquery.com/jquery-1.10.2.min.js`
is `C6CB9UYIS9UJeqinPHWTHVqh_E1uhG5Twh-Y5qFQmYg` means
that the user agent can verify that the data it loads from that URL matches
that expected hash before executing the JavaScript it contains. This
integrity verification significantly reduces the risk that an attacker can
substitute malicious content.

This example can be communicated to a user agent by adding the hash to a
`script` element, like so:

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"
            integrity="ni:///sha-256;C6CB9UYIS9UJeqinPHWTHVqh_E1uhG5Twh-Y5qFQmYg?ct=application/javascript">
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

2.  The verification mechanism should extend to all resource types that
    a page may fetch in the course of its execution and rendering. Active
    content (scripts, style, `iframe` contents, etc) are, of course,
    critical, but inactive content such as images and fonts will also be
    covered.

3.  The verification mechanism should have reporting functionality which
    would inform the author that an invalid resource was downloaded.
    Further it should be possible for an author to choose to run _only_
    the reporting functionality, allowing potentially corrupt resources
    to run on her site, but flagging violations for manual review.

4.  The metadata provided for verification may enable improvements to
    user agents' caching schemes: common resources such as JavaScript
    libraries can be downloaded once, and only once, even if multiple
    instances with distinct URLs are requested.

5.  (potentially) Relax mixed-content warnings for resources whose
    integrity is verified. If the integrity metadata for a resource
    is delivered over a secure channel, the user agent might choose to
    allow loading the resource over an insecure channel.

6.  (potentially) Allow resources to be downloaded from non-canonical
    sources (for instance, over an insecure channel) for performance,
    but fall back to a canonical source if the non-canonical source
    fails an integrity check. 

I'm not sure about #5 and #6. Get more detail from the WG about the
benefits that such a fallback system would enable. (mkwst)
{:.issue data-number="1"}
</section><!-- /Introduction::Goals -->

<section>
### Use Cases/Examples

<section>
#### Resource Integrity

*   An author wants to include JavaScript provided by a third-party
    analytics service on her site. She wants, however, to ensure that only
    the code she's carefully reviewed is executed. She can do so by generating
    [integrity metadata][] for the script she's planning on including, and
    adding it to the `script` element she includes on her page:

        <script src="https://analytics-r-us.com/v1.0/include.js"
                integrity="ni:///sha-256;SDfwewFAE...wefjijfE?ct=application/javascript"></script>
    {:.example.highlight}

*   An advertising network wishes to ensure that advertisements delivered via
    third-party servers matches the code which they reviewed in order to reduce
    the risk of accidental or malicious substitution of unreviewed content. By
    adding [integrity metadata][] to the `iframe` element wrapping the
    advertisement, they can ensure that the third-party server delivers only
    the agreed-upon content.
    
        <iframe src="https://awesome-ads.com/advertisement1.html"
                integrity="ni:///sha-256;kasfdsaffs...eoirW-e?ct=text/html"></iframe>
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
<section>
#### Downloads

*   A software distribution service wants to ensure that files are correctly
    downloaded. It can do so by adding [integrity metadata][] to the `a`
    elements which users click on to trigger a download:

        <a href="https://software-is-nice.com/awesome.exe"
           integrity="ni:///sha-256;fkfrewFRFEFHJR...wfjfrErw?ct=application/octet-stream"
           download>...</a>
    {:.example.highlight}
           
</section><!-- Introduction::UseCases::Downloads -->
<section>
#### Fallback

*   An author wishes to ensure that her site is functional for users behind a
    trusted proxy which unavoidably transcodes data for security, performance,
    or other reasons. She can do this by adding [integrity metadata][] and a
    [non-canonical source][noncanonical] to the `script` element:

        <script src="https://my-trusted-server.com/script.js"
                noncanonical-src="https://my-cdn.net/script.js"
                integrity="ni:///sha-256;asijfiqu4t12...woeji3W?ct=application/javascript"></script>
    {:.example.highlight}

</section><!-- /Introduction::Use Cases::Fallback -->
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

The term <dfn>digest</dfn> refers to the base64url-encoded result of
executing a cryptographic hash function on an arbitrary block of data.

A <dfn>secure channel</dfn> is any communication mechanism that the user
agent has defined as "secure" (typically limited to HTTP over Transport
Layer Security (TLS) [[!RFC2818]]).

An <dfn>insecure channel</dfn> is any communication mechanism other than
those the user agent has defined as "secure".

The term <dfn>origin</dfn> is defined in the Origin specification.
[[!RFC6454]]

The <dfn>MIME type</dfn> of a resource is a technical hint about the use
and format of that resource. [[!MIMETYPE]]

The <dfn>entity body</dfn>, <dfn>transfer encoding</dfn>, <dfn>content
encoding</dfn> and <dfn>message body</dfn> of a resource is defined by the
[HTTP 1.1 specification, section 7.2][entity]. [[!HTTP11]]

[entity]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec7.html

A <dfn>base64url encoding</dfn> is defined in
[RFC 4648, section 5][base64url]. In a nutshell, it replaces the characters
U+002B PLUS SIGN (`+`) and U+002F SOLIDUS (`/`) characters in normal base64
encoding with the U+002D HYPHEN-MINUS (`-`) and U+005F LOW LINE (`_`)
characters, respectively. [[!RFC4648]]

[base64url]: http://tools.ietf.org/html/rfc4648#section-5

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

* cryptographic hash function
* [digest][]
* the resource's MIME type

The hash function and digest MUST be provided in order to validate a
resource's integrity. The MIME type SHOULD be provided, as it mitigates the
risk of certain attack vectors (see [MIME Type confusion][] in
this document's Security Considerations section).

This metadata is generally encoded as a "named information" (`ni`) URI, as
defined in RFC6920. [[!RFC6920]]

For example, given a resource containing only the string "Hello, world!",
an author might choose [SHA-256][sha2] as a hash function.
`-MO_YqmqPm_BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8` is the base64url-encoded
digest that results. This can be encoded as an `ni` URI as follows:

    ni:///sha-256;-MO_YqmqPm_BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8
{:.example.highlight}

Or, if the author further wishes to specify the content type (`text/plain`):

    ni:///sha-256;-MO_YqmqPm_BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8?ct=text/plain
{:.example.highlight}

<div class="note">
Digests may be generated using any number of utilities. [OpenSSL][], for
example, is quite commonly available. The example in this section is the
result of the following command line:

    echo -n "Hello, world." | openssl dgst -sha256 -binary | openssl enc -base64 | sed -e 's/+/-/g' -e 's/\//_/g'

[openssl]: http://www.openssl.org/
</div>

[sha2]: #dfn-sha-2
[digest]: #dfn-digest
[integrity metadata]: #dfn-integrity-metadata
</section><!-- /Framework::Required metadata -->

<section>
### Cryptographic hash functions

Conformant user agents MUST support the [SHA-256][sha2] and [SHA-512][sha2]
cryptographic hash functions for use as part of a resource's
[integrity metadata][], and MAY support additional hash functions.

<section>
#### Agility

Multiple sets of [integrity metadata][] may be associated with a single
resource in order to provide agility in the face of future discoveries.
For example, the "Hello, world." resource described above may be described
either of the following `ni` URLs:

    ni:///sha-256;-MO_YqmqPm_BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8?ct=text/plain
    ni:///sha-512;rQw3wx1psxXzqB8TyM3nAQlK2RcluhsNwxmcqXE2YbgoDW735o8TPmIR4uWpoxUERddvFwjgRSGw7gNPCwuvJg==?ct=text/plain
{:.example.highlight}

Authors may choose to specify both, for example:

    <a href="hello_world.txt"
       integrity="
          ni:///sha-256;-MO_YqmqPm_BYZwlDkir51GTc9Pt9BvmLrXcRRma8u8?ct=text/plain
          ni:///sha-512;rQw3wx1psxXzqB8TyM3nAQlK2RcluhsNwxmcqXE2YbgoDW735o8TPmIR4uWpoxUERddvFwjgRSGw7gNPCwuvJg==?ct=text/plain
        "
        download>Hello, download!</a>

In this case, the user agent will choose the strongest hash function in the
list, and use that metadata to validate the resource (as described below in
the "[parse metadata][parse]" and "[get the strongest metadata from
set][get-the-strongest]" algorithms).

When a hash function is determined to be insecure, user agents MUST deprecate
and eventually remove support for integrity validation using that hash
function.

Validation using unsupported hash functions always fails (see the "[Does
resource match metadataList][match]" algorithm below). Authors are therefore
encouraged to use strong hash functions, and to begin migrating to stronger
hash functions as they become available.
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

1.  If <var>algorithm</var> is not a hash function recognized and supported
    by the user agent, return `null`.
2.  Let <var>result</var> be the result of applying <var>algorithm</var> to
    the content of the [entity body][] of <var>resource</var>, including any
    content coding that has been applied, but not including any
    transfer encoding applied to the message body.
3.  Let <var>encodedResult</var> be result of base64url-encoding
    <var>result</var>.
4.  Strip any trailing U+003D EQUALS SIGN (`=`) characters from
    <var>encodedResult</var>.
5.  Return <var>encodedResult</var>.

Step 2 is pulled from the `content-md5` definition in [[!HTTP11]]. It's
unclear that it's what we want. See  [bzbarsky's WG post on this topic][bz]
{:.issue data-number="2"}

[apply-algorithm]: #apply-algorithm-to-resource
</section><!-- Algorithms::apply -->
<section>
#### Is <var>resource</var> eligible for integrity validation
[eligible]: #is-resource-eligible-for-integrity-validation

In order to mitigate an attacker's ability to read data cross-origin by
brute-forcing values via integrity checks, resources are only eligible
for such checks if they are same-origin, publicly cachable, or are the
result of explicit access granted to the loading origin via CORS. [[!CORS]]

Certain HTTP headers can also change the way the resource behaves in
ways which integrity checking cannot account for. If the resource
contains these headers, it is ineligible for integrity validation:

*   `WWW-Authenticate` hides resources behind a login; such non-public
    resources are excluded from integrity checks.
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
    * `WWW-Authenticate`
    * `Refresh`
3.  If the [mode][fetch-mode] of <var>request</var> is `CORS`,
    return `true`.
4.  If the [origin][fetch-origin] of <var>request</var> is
    <var>resource</var>'s origin, return `true`.
5.  If <var>resource</var> is [cachable by a shared cache][], as defined
    in [[!HTTP11]], return `true`.
6.  Return `false`.

Step 2 returns `true` if the resource was a CORS-enabled request. If the
resource failed the CORS checks, it won't be available to us for integrity
checking because it won't have loaded successfully.
{:.note}

[fetch-mode]: http://fetch.spec.whatwg.org/#concept-request-mode
[fetch-origin]: http://fetch.spec.whatwg.org/#concept-request-origin
[cachable by a shared cache]: https://svn.tools.ietf.org/svn/wg/httpbis/draft-ietf-httpbis/latest/p6-cache.html#response.cacheability
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
    1.  If <var>token</var> is not a valid "named information" (`ni`) URI,
        skip the remaining steps, and proceed to the next token.
    2.  Let <var>algorithm</var> be the <var>alg</var> component of
        <var>token</var>.
    3.  If <var>algorithm</var> is a hash function recognized by the user
        agent, add <var>token</var> to <var>result</var>.
4.  Return <var>result</var>.

[split-on-spaces]: http://www.w3.org/TR/html5/infrastructure.html#split-a-string-on-spaces
</section><!-- Algorithms::parse -->
<section>
#### Get the strongest metadata from <var>set</var>.

1.  Let <var>strongest</var> be the empty string.
2.  For each <var>item</var> in <var>set</var>:
    1.  If <var>item</var> is not a valid "named information" (`ni`) URL,
        skip to the next <var>item</var>.
    2.  If <var>strongest</var> is the empty string, set <var>strongest</var>
        to <var>item</var>, skip to the next
        <var>item</var>.
    3.  Let <var>currentAlgorithm</var> be the <var>alg</var> component of
        <var>strongest</var>.
    4.  Let <var>newAlgorithm</var> be the <var>alg</var> component of
        <var>item</var>.
    5.  If the result of [`getPrioritizedHashFunction(currentAlgorithm, newAlgorithm)`][getPrioritizedHashFunction]
        is <var>newAlgorithm</var>, set <var>strongest</var> to
        <var>item</var>.
3.  Return <var>strongest</var>.

[getPrioritizedHashFunction]: #dfn-getprioritizedhashfunction-a-b
</section><!-- /Algorithms::get the strongest metadata -->
<section>
#### Does <var>resource</var> match <var>metadataList</var>?

1.  If <var>resource</var>'s URL's scheme is `about`, return `true`.
2.  If [<var>resource</var> is not eligible for integrity
    valiation][eligible], return `false`.
3.  Let <var>parsedMetadata</var> be the result of
    [parsing <var>metadataList</var>][parse].
4.  If <var>parsedMetadata</var> is `no metadata`, return `true`.
5.  Let <var>metadata</var> be the result of [getting the strongest
    metadata from <var>parsedMetadata</var>][get-the-strongest].
6.  If <var>metadata</var> is the empty string, return `false`.
7.  Let <var>algorithm</var> be the <var>alg</var> component of
    <var>metadata</var>.
8.  Let <var>expectedValue</var> be the <var>val</var> component of
    <var>metadata</var>.
9.  Let <var>expectedType</var> be the value of <var>metadata</var>'s `ct`
    query string parameter.
10. If <var>expectedType</var> is not the empty string, and is not a
    case-insensitive match for <var>resource</var>'s MIME type,
    return `false`.
11. Let <var>actualValue</var> be the result of [applying
    <var>algorithm</var> to <var>resource</var>][apply-algorithm].
12. If <var>actualValue</var> is `null`, return `false`.
13. If <var>actualValue</var> is a case-sensitive match for
    <var>expectedValue</var>, return `true`. Otherwise, return `false`.

If <var>expectedType</var> is the empty string in #10, it would
be reasonable for the user agent to warn the page's author about the
dangers of MIME type confusion attacks via its developer console.
{:.note}

User agents may allow users to modify the result of this algorithm via user
preferences, bookmarklets, third-party additions to the user agent, and other
such mechanisms. For example, redirects generated by an extension like
[HTTPSEverywhere](https://www.eff.org/https-everywhere) could load and execute
correctly, even if the HTTPS version of a resurce differs from the HTTP version.
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

1.  The following text should be added to [section 2.2][fetch-2-2]: "A
    [request][fetch-request] has an associated [integrity metadata][].
    Unless stated otherwise, a request's integrity metadata is the empty
    string."

2.  The following text should be added to [section 2.3][fetch-2-3]: "A
    [response][fetch-response] has an associated integrity state, which
    is one of `indeterminate`, `pending`, `corrupt`, and `intact`. Unless
    stated otherwise, it is `indeterminate`.

3.  Perform the following steps before executing both the "[basic fetch][]" and
    "[CORS fetch with preflight][]" algorithms:

    1.  If <var>request</var>'s integrity metadata is the empty string, set
        <var>response</var>'s integrity state to `indeterminate`. Otherwise:

        1.  Set <var>response</var>'s integrity state to `pending`.
        2.  Include a `Cache-Control` header whose value is "no-transform".
        3.  If <var>request</var>'s integrity metadata contains a content
            type:
            1.  Set <var>request</var>'s `Accept` header value to the value
                of <var>request</var>'s integrity metadata's content type.

4.  Add the following step before step #1 of the handling of 401 status
    codes for both "[basic fetch][]" and "[CORS fetch with preflight][]"
    algorithms:

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

[fetch-2-2]: http://fetch.spec.whatwg.org/#requests
[fetch-2-3]: http://fetch.spec.whatwg.org/#responses
[fetch-request]: http://fetch.spec.whatwg.org/#concept-request
[fetch-response]: http://fetch.spec.whatwg.org/#concept-response
[basic fetch]: http://fetch.spec.whatwg.org/#basic-fetch
[CORS fetch with preflight]: http://fetch.spec.whatwg.org/#cors-fetch-with-preflight
</section>

<section>
### Verification of HTML document subresources

A variety of HTML elements result in requests for resources that are to be
embedded into the document, or executed in its context. To support integrity
metadata for each of these, and new elements that are added in the future,
a new `integrity` attribute is added to the list of content attributes for
the `a`, `audio`, `embed`, `iframe`, `link`, `object`, `script`, `source`,
`track`, and `video` elements.

A corresponding `integrity` IDL attribute which [reflects][reflect] the
value each element's `integrity` content attribute is added to the
`HTMLAnchorElement`, `HTMLMediaElement`, `HTMLEmbedElement`,
`HTMLIframeElement`, `HTMLLinkElement`, `HTMLObjectElement`,
`HTMLScriptElement`, `HTMLSourceElement`, and `HTMLTrackElement`
interfaces.

<section>
#### The `integrity` attribute

The `integrity` attribute represents [integrity metadata][] for an element.
The value of the attribute MUST be either the empty string, or at least one
valid "named information" (`ni`) URI [[!RFC6920]], as described by the
following ABNF grammar:

    integrity-metatata = "" / 1*( *WSP NI-URL ) *WSP ]

The `NI-URL` rule is defined in [RFC6920, section 3, figure 4][niurl].

[niurl]: http://tools.ietf.org/html/rfc6920#section-3

The `integrity` IDL attribute must [reflect][] the `integrity` content attribute.

[reflect]: http://www.w3.org/TR/html5/infrastructure.html#reflect
</section><!-- /Framework::HTML::integrity -->

<section>
#### The `noncanonical-src` attribute (TODO)
[noncanonical]: #the-noncanonical-src-attribute-todo

Authors MAY opt-in to a fallback mechanism whereby user agents would initially
attempt to load resources from a non-canonical source. If that fetch fails an
integrity check, the user agent would [report a violation][], and retry the
fetch using a canonical URL.

The non-canonical URL is specified via a `noncanonical-src` attribute. For
example:

    <script src="https://example.com/script.js"
            noncanonical-src="https://cdn.example.com/script.js"
            integrity="ni:///sha-256;jsdfhiuwergn...vaaetgoifq?ct=application/javascript"></script>
{:.example.highlight}

The `noncanonicalSrc` IDL attribute MUST [reflect][] the `noncanonical-src`
content attribute.

The noncanonical resource MUST be fetched with its [omit credentials
mode][] set to `always`.

[omit credentials mode]: http://fetch.spec.whatwg.org/#concept-request-omit-credentials-mode

More detailed discussion of the use-case and behavior here is probably necessary
going forward. The goal is to have a fallback mechanism which would not be
integrity checked. Perhaps it would be hosted on the same server as the page
itself; you wouldn't get the benefits of your globally awesome CDN, but you'd
trust (at least) the source of the file. This would enable your application to
function correctly in environments that would be otherwise entirely broken
(Global MegaCorp with its draconian IT department, for example).
{:.issue data-number="5"}
</section><!-- /Framework::HTML::noncanonical-src -->

<section>
#### Element interface extensions

<section>
##### HTMLAnchorElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLAnchorElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLAnchorElement -->
<section>
##### HTMLEmbedElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLObjectElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLEmbedElement -->
<section>
##### HTMLIFrameElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLIFrameElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLIFrameElement -->
<section>
##### HTMLImageElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLImageElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLImageElement -->
<section>
##### HTMLLinkElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLLinkElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLLinkElement -->
<section>
##### HTMLMediaElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLMediaElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLMediaElement -->
<section>
##### HTMLObjectElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLObjectElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLObjectElement -->
<section>
##### HTMLScriptElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLScriptElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLScriptElement -->
<section>
##### HTMLTrackElement

attribute DOMString integrity
: The value of this element's `integrity` attribute
{:title="partial interface HTMLTrackElement"}
{:.idl}
</section><!-- /Framework::HTML::Interface extensions::HTMLTrackElement -->

</section><!-- /Framework::HTML::Interface extensions -->
<section>
#### Handling integrity violations

Documents may specify the behavior of a failed integrity check by delivering
a [Content Security Policy][csp] which contains an `integrity-policy`
directive, defined by the following ABNF grammar:

    directive-name  = "integrity-policy"
    directive-value = 1#failure-mode [ "require-for-all" ]
    failure-mode    = ( "block" / "report" / "fallback" )

A document's <dfn>integrity policy</dfn> is the value of the
`integrity-policy` directive, if explicitly provided as part of the
document's Content Security Policy, or `block` otherwise.

If the document's integrity policy contains `block`, the user agent MUST refuse
to render or execute resources that fail an integrity check, <em>and</em> MUST
[report a violation][].

If the document's integrity policy contains `report`, the user agent MAY render
or execute resources that fail an integrity check, <em>but</em> MUST
[report a violation][].

If the document's integrity policy contains `fallback`, the user agent MUST
refuse to render or execute resources that fail an integrity check, <em>and</em>
MUST [report a violation][]. The user agent MAY additionally choose to load
a fallback resource as specified for each relevant element. If the fallback
resource fails an integrity check, the user agent MUST refuse to render or
execute the resource, <em>and</em> MUST [report a(nother)
violation][report a violation]. (See [the `noncanonical-src`
attribute][noncanonical] for a strawman of how that might look).
{:.issue data-number="6"}

If the document's integrity policy contains `require-for-all`, the user agent
MUST treat the lack of [integrity metadata][] for an resource as automatic
failure, refuse to fetch the resource, and [report a violation][].
{:.issue data-number="7"}

[csp]: http://w3.org/TR/CSP11
[report a violation]: http://www.w3.org/TR/CSP11/#dfn-report-a-violation
[integrity policy]: #dfn-integrity-policy
</section>

<section>
##### Elements

<section>
###### The `a` element

If an `a` element has both `integrity` and `download` attributes, the user
agent has all the data it needs in order to verify the integrity of the
downloaded resource. This is the only type of download we can safely make
promises about, so it is the only type of download that we support. If
integrity metadata is added to any `a` element that does not explicitly
request that the resource it points to be downloaded, user agents MUST
treat the link as broken.

Before [following a hyperlink][], the user agent MUST run the following steps:

1.  If <var>subject</var> has an `integrity` attribute whose value is not the
    empty string, then:
    1.  The user agent MAY report an error to the user in a
        user-agent-specific manner.
    2.  Abort the [following a hyperlink][] algorithm.

Replace step 6 of the [downloads a hyperlink][] algorithm with the following:

6. If the `integrity` attribute of that element is not the empty string, and
   the element _does not_ have a `download` attribute, abort these steps.
7. Fetch <var>URL</var> with [integrity metadata][] set to the value of the
   `integrity` attribute of that element, and handle the resulting resource
   [as a download][].
{:start="6"}

[following a hyperlink]: http://www.w3.org/TR/html5/links.html#following-hyperlinks
[downloads a hyperlink]: http://www.w3.org/TR/html5/links.html#downloading-hyperlinks

When handling a resource [as a download][], perform the following step before
providing a user with a way to save the resource for later use:

*   If <var>response</var>'s integrity state is `corrupt` and the document's
    [integrity policy][] is `block`, the user agent MUST [report a violation][],
    <em>and</em> MUST abort the download.

<div class="note">
Note that this will cover _only_ downloads triggered explicitly by adding a
`download` attribute to an `a` element. Such a link might look like the following:

    <a href="https://example.com/file.zip"
       integrity="ni:///sha256;skjdsfkafinqfb...ihja_gqg?ct=application/octet-stream"
       download>Download!</a>
{:.example.highlight}
</div>

[as a download]: http://www.w3.org/TR/html5/links.html#as-a-download
</section><!-- /Framework::HTML::Elements::a -->

<section>
###### The `embed` element

When fetching an URL via step 2 of the [`embed` element setup steps][embedsetup]
algorithm:

1.  Set the [integrity metadata][] of the request to the value
    of the element's `integrity` attribute.

Before running the task queued by the networking task source once the URL has
been fetched, first perform the following steps:

1.  If the response's integrity state is `corrupt`:
    1.  If the document's [integrity policy][] is `block`:
        1.  Set the element's `type` attribute to the empty string.
        2.  Skip to step 4 of the algorithm.
    2.  [Report a violation][].

[embedsetup]: http://www.w3.org/TR/html5/embedded-content-0.html#update-the-image-data
</section><!-- /Framework::HTML::Elements::embed -->

<section>
###### The `iframe` element

When content is to be loaded into the [child browsing context][] created
by an `iframe`, perform fetches with the [integrity metadata][] set to the
value of the `iframe` element's `integrity` attribute. Moreover:

*   If the document's [integrity policy][] is `block`, then the user
    agent MUST delay rendering the content until the
    [fetching algorithm][]'s task to [process request end-of-file][]
    completes.
*   When the [process request end-of-file][] task completes:
    3.  If the request's integrity state is `corrupt`:
        1. If <var>resource</var> is [same origin][] with the document's
           browsing context owner `iframe` element's Document's origin, then
           [queue a task][] to [fire a simple event][] named `error` at the
           `iframe` element (this will not fire for cross-origin requests, to
           avoid leaking data about those resource's content).
        2. [Report a violation][].
        3. [Navigate][] the child browsing context to `about:blank`.

<div class="note">
Note that this will _only_ check the integrity of the `iframe`'s document source.
No subsequent verification for the document's subresources is perfomed.
If integrity checks for the document's subresources are desirable, the document
loaded into the `iframe` needs to include [integrity metadata][] for its subresources.
</div>

How does this effect things like the preload scanner? How much work is it
going to be for vendors to change the "display whatever we've got, ASAP!"
behavior that makes things fast for users? How much impact will there be
on user experience, especially for things like ads, where this kind of
validation has the most value?
{:.issue data-number="8"}

How do we deal with navigations in the child browsing context? Are they
simply disallowed? If so, does that make sense? It might for ads, but
what about other use-cases?
{:.issue data-number="9"}

[child browsing context]: http://www.w3.org/TR/html5/browsers.html#child-browsing-context
[navigate]: http://www.w3.org/TR/html5/browsers.html#navigate
[process request end-of-file]: http://fetch.spec.whatwg.org/#process-request-end-of-file
</section><!-- /Framework::HTML::iframe -->

<section>
###### The `img` element

When fetching an image via step 12 of the [update the image data][]
algorithm:

1.  Set the [integrity metadata][] of the request to the value
    of the element's `integrity` attribute.

Before jumping one of the entries from the list in step 14 of the
[update the image data][] algorithm, first perform the following
steps:

1.  If the response's integrity state is `corrupt`:
    1.  If the document's [integrity policy][] is `block`:
        1.  Abort the jump in progress.
        2.  Perform the steps in the entry labeled "Otherwise" under step 14.
    2.  [Report a violation][].

How do we want to deal with [the `srcset` attribute][srcset]?
{:.issue data-number="18"}

[srcset]: http://www.w3.org/html/wg/drafts/srcset/w3c-srcset/
[update the image data]: http://www.w3.org/TR/html5/embedded-content-0.html#update-the-image-data
</section><!-- /Framework::HTML::Elements::img -->

<section>
###### The `link` element

Whenever a user agent attempts to [obtain a resource][] pointed to by a
`link` element:

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
###### The `object` element

When fetching an image via step 4 of step 4 of the ["determine what the
`object` element represents" algorithm][objectalgo]:

1.  Set the [integrity metadata][] of the request to the value
    of the element's `integrity` attribute.

Before step 7 of the ["determine what the `object` element represents"
algorithm][objectalgo], first perform the following steps:

1.  If the response's integrity state is `corrupt`:
    1.  If the document's [integrity policy][] is `block`:
        1.  [Fire a simple event][] named `error` at the element.
        2.  Jump to the step labeled <i>fallback</i>.
    2.  [Report a violation][].

[objectalgo]: http://www.w3.org/TR/html5/embedded-content-0.html#update-the-image-data 
</section><!-- /Framework::HTML::Elements::object -->

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
            1.  If <var>resource</var> is [same origin][] with the `link`
                element's Document's origin, then [queue a task][] to
                [fire a simple event][] named `error` at the element, and
                abort these steps.
        2.  [Report a violation][].
{:start="6"}

[prepare]: http://www.w3.org/TR/html5/scripting-1.html#prepare-a-script
[fetching algorithm]: http://www.w3.org/TR/html5/infrastructure.html#fetch
[queue a task]: http://www.w3.org/TR/html5/webappapis.html#queue-a-task
[fire a simple event]: http://www.w3.org/TR/html5/webappapis.html#fire-a-simple-event
[entity body]: #dfn-entity-body
[bz]: http://lists.w3.org/Archives/Public/public-webappsec/2013Dec/0048.html
</section><!-- /Framework::HTML::Elements::script -->

<section>
###### The `track` element

When fetching the [track URL][] in step 10 of the [start the `track`
processing model][track-process] algorithm:

1.  Set the [integrity metadata][] of the request to the value
    of the element's `integrity` attribute.

Additionally, perform the following steps before performing the steps
specified for a successful `track` fetch:

1.  If the response's integrity state is `corrupt`:
    1.  If the document's [integrity policy][] is `block`:
        1.  Perform the steps specified for a failed `track` fetch.
        2.  Abort the steps specified for a successful `track` fetch.
    2.  [Report a violation][].

[track URL]: http://www.w3.org/TR/html5/embedded-content-0.html#track-url
[track-process]: http://www.w3.org/TR/html5/embedded-content-0.html#start-the-track-processing-model
</section><!-- /Framework::HTML::Elements::track -->
<section>
###### The `audio` element (TODO)

TODO: Write this section? Might want to delay media elements until we have a solution to streaming.
{:.issue data-number="10"}
</section><!-- /Framework::HTML::Elements::audio -->
<section>
###### The `source` element (TODO)

TODO: Write this section? Might want to delay media elements until we have a solution to streaming.
{:.issue data-number="11"}
</section><!-- /Framework::HTML::Elements::source -->
<section>
###### The `video` element (TODO)

TODO: Write this section? Might want to delay media elements until we have a solution to streaming.
{:.issue data-number="12"}
</section><!-- /Framework::HTML::Elements::video -->

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

<section>
### Verification of JS-loaded subresources

These sections are less fleshed out and debated than the HTML sections, where
the WG has concentrated most of its time thus far.
{:.issue data-number="14"}

<section>
#### Workers

To validate the integrity of scripts which are to be run as workers, a new
constructor is added for `Worker` and `SharedWorker` which accepts a second
argument containing integrity metadata. This information is used when
[running a worker][runworker] to perform validation, as outlined in the
following sections: [[!WEBWORKERS]]

[runworker]: http://dev.w3.org/html5/workers/#run-a-worker

<section>
#### Worker extension

attribute DOMString integrity
: The value of the Worker's `integrity` attribute. Defaults to the empty string.
{:title="[Constructor (DOMString scriptURL, DOMString integrityMetadata)] partial interface Worker : EventTarget"}
{:.idl}

When the `Worker(scriptURL, integrityMetadata)` constructor is invoked:

1. If `integrityMetadata` is not a valid "named information" (`ni`) URL,
   throw a `SyntaxError` exception and abort these steps.
2. Execute the `Worker(scriptURL)` constructor, and set the newly created
   `Worker` object's `integrity` attribute to `integrityMetadata`.
</section><!-- /Framework::JS::Workers::Worker -->
<section>
#### SharedWorker extension

attribute DOMString integrity
: The value of the SharedWorker's `integrity` attribute. Defaults to the empty string.
{:title="[Constructor (DOMString scriptURL, DOMString name, DOMString integrityMetadata)] partial interface Worker : EventTarget"}
{:.idl}

When the `SharedWorker(scriptURL, name, integrityMetadata)` constructor is
invoked:

1. If `integrityMetadata` is not a valid "named information" (`ni`) URL,
   throw a `SyntaxError` exception and abort these steps.
2. Execute the `SharedWorker(scriptURL, name)` constructor, and set the
   newly created `SharedWorker` object's `integrity` attribute to
   `integrityMetadata`.
</section><!-- /Framework::JS::Workers::SharedWorker -->

<section>
#### Validation

Add the following step directly after step 4 of the [run a worker][runworker]
algorithm:

5. If the script resource fetched in step 4 has an integrity status of
   `corrupt`, then for each `Worker` or `SharedWorker` object associated
   with <var>worker global scope</var>, [queue a task][] to [fire a
   simple event][] named `error` at that object. Abort these steps.
{:start="5"}
</section><!-- /Framework::JS::Workers::validation -->

</section><!-- /Framework::JS::Workers -->

<section>
#### XMLHttpRequest

To validate the integrity of resources loaded via `XMLHttpRequest`, a new
`integrity` attribute is added to the `XMLHttpRequest` object. If set, the
[integrity metadata][] in this attribute is used to validate the resource
before triggering the `load` event. [[!XMLHTTPREQUEST]]

<section>
##### The `integrity` attribute

The `integrity` attribute must return its value. Initially its value MUST
be the empty string.

Setting the `integrity` attribute MUST run these steps:

1. If the state is not `UNSENT` or `OPENED`, throw an `InvalidStateError`
   exception and abort these steps.
2. If the value provided is not a valid "named information" (`ni`) URL,
   throw a "SyntaxError` exception and abort these steps.
3. Set the `integrity` attribute's value to the value provided.

</section><!-- /Framework::JS::XHR::integrity -->

<section>
##### Progress events

Validation only takes place when the entire resource body has been
downloaded. Data processed before the resource has completely
loaded (or failed to load) is unvalidated, and potentially corrupt.
For that reason, if the document's [integrity policy][]
is `block`, progress events will not fire until the fetch has
completed, one way or another.

If the document's [integrity policy][] is not `block`, developers who
care about integrity validation SHOULD still ignore progress events
fired while the resource is downloading, and instead listen only for
the `load`, `abort`, and `error` events.

If the document's [integrity policy][] is `block`, then:

*   Before executing step 3.2 of the "process response" algorithm in
    step 13 of XMLHttpRequest's [`send(data)`][xhrsend] method:
    1. If the object's `integrity` attribute is not the empty string
       the user agent MUST abort the "process response" algorithm, and
       MUST NOT fire the `readystatechange` event.

*   Before executing step 2.2 of the "process response body" algorithm in
    step 13 of XMLHttpRequest's [`send(data)`][xhrsend] method:
    1. If the object's `integrity` attribute is not the empty string
       the user agent MUST abort the "process response body" algorithm,
       and MUST NOT fire the `readystatechange` event.

*   Before executing step 4 of the "process response body" algorithm in
    step 13 of XMLHttpRequest's [`send(data)`][xhrsend] method:
    1. If the object's `integrity` attribute is not the empty string
       the user agent MUST abort the "process response body" algorithm,
       and MUST NOT fire the `progress` event.

[xhrsend]: http://xhr.spec.whatwg.org/#dom-xmlhttprequest-send
</section><!-- /Framework::JS::XHR::integrity -->

<section>
##### Validation

Whenever the user agent would [switch an `XMLHttpRequest` object to the
`DONE` state][switch-done], then perform the following steps before
switching state:

1.  If the response's integrity state is `intact` or `indeterminate`,
    then abort these steps, and continue to
    [switch to the `DONE` state][switch-done].
2.  Otherwise, [report a violation][], and run the following steps
    if the document's [integrity policy][] is `block`:
    1. Set the [response entity body][] to `null`
    2. Run the [request error][] steps for exception
       [`NetworkError`][xhrnetworkerror] and event [`error`][xhrerror].
    3. Do not continue to [switch to the `DONE` state][switch-done].

[switch-done]: https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#switch-done
[response entity body]: https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#response-entity-body
[request error]: http://www.w3.org/TR/XMLHttpRequest/#request-error
[xhrnetworkerror]: http://dev.w3.org/2006/webapi/DOM4Core/#networkerror
[xhrerror]: http://www.w3.org/TR/XMLHttpRequest/#event-xhr-error
</section><!-- Framework::JS::XHR::validation -->

</section><!-- /Framework::JS::XHR -->


</section><!-- /Framework::JS -->
</section><!-- /Framework -->

<section>
### Caching (Optional)

The caching mechanism described in this section is OPTIONAL.

JavaScript libraries are a good example of resources that are often loaded
and reloaded from different locations as users browse the web:
`http://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js` is
exactly the same file as
`https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js`. Both
files are identifiable via the `ni` URL
`ni:///sha-256;iaFenEC8axSAnyNu6M0-0epCOTwfbKVceFXNd5s_ki4?ct=application/javascript`.

To reduce the performance impact of reloading the same data, user agents
MAY use [integrity metadata][] as a new index to a local cache, meaning that
a user who had already loaded a version of the file from `ajax.googleapis.com`
wouldn't have to touch the network to load the `cdnjs.cloudflare.com` version.
The user agent knows that the content is the same, and would be free to treat
the latter as a cache hit, regardless of the location mismatch.

<section>
#### Risks

This approach is good for performance, but can have security implications. See
the [origin confusion][] and [MIME type confusion][] sections below for some
details.

<section>
##### Origin confusion
[origin confusion]: #origin-confusion

User agents which set up a caching mechanism that uses only the integrity
metadata to identify a resource are vulnerable to attacks which bypass
same-origin restrictions unless they are very careful when choosing whether
or not to read data straight from the cache.

For instance:

* [Runtime script errors][onerror] are sanitized for resources that are
  [CORS-cross-origin][cors] to the page into which they are loaded. [[!HTML5]]

* XMLHttpRequest may only load data from same-origin resources, or from
  resources delivered with proper CORS headers. [[!XMLHTTPREQUEST]]

* Content Security Policy performs origin-based security checks. [[!CSP]]

More?
{:.issue data-number="15"}

<div class="note">
The simple cache-poisoning version of this attack can be mitigated by
requiring strong hash functions for cachable resources. More complex
variants are more difficult to mitigate. Consider the following:

1.  An attacker lures Alice to a page containing the following code:

        <script src="http://evil.com/evil.js" digest="ni://sha-256;123...789">
    {:.example.highlight}

2.  Alice's user agent loads `evil.js`, and stores it in her cache.

3.  Though `bank.com` is protected by a CSP which allows only script from
    `bank.com`, the attacker may still be able to exploit an XSS vulnerability
    in `bank.com` which allows the injection of:

        <script src="http://bank.com/awesome.js" digest="ni://sha-256;123...789">
    {:.example.highlight}

    Since the script appears to come from `bank.com`, CSP allows it, even though
    it doesn't actually exist on that server.
</div>

[onerror]: http://www.w3.org/TR/html5/webappapis.html#runtime-script-errors
[cors]: http://www.w3.org/TR/html5/infrastructure.html#cors-cross-origin
</section><!-- /Caching::Risks::Origin confusion -->

<section>
##### MIME type confusion
[MIME Type confusion]: #mime-type-confusion

User agents which set up a caching mechanism that uses only the integrity
metadata to identify a resource are vulnerable to attacks which create
resources that behave differently based on the context in which they are
loaded. [Gifar][] is the canonical example of such an attack.

Authors SHOULD mitigate this risk by specifying the expected content type
along with the digest, as specified in [RFC 6920, section 3.1][contenttype].
This means that the content type will be verified along with the digest when
determining whether a [resource matches certain integrity
metadata][match].

[Gifar]: http://en.wikipedia.org/wiki/Gifar
[contenttype]: http://tools.ietf.org/html/rfc6920#section-3.1
</section><!-- /Caching::Risks::MIME Type confusion -->
</section><!-- /Caching::Risks -->

<section>
#### Recommendations

To mitigate the risk of cross-origin data leakage or type-sniffing
exploitation, user agents that take this approach to caching MUST NOT
use [integrity metadata][] as a cache identifier unless the following
are all true:

*   The integrity metadata contains a content type.
*   The resource was delivered in response to an HTTP `GET` request (and not
    `POST`, `OPTIONS`, `TRACE`, etc.)
*   The resource was delivered with an `Access-Control-Allow-Origin` HTTP
    header with a value of `*` [[!CORS]]
*   The integrity metadata uses a hash function with very strong uniqueness
    characteristics: SHA-512 or better.
*   If a Content Security Policy is active in a context, the `script` or
    `link` element which triggered the resource's fetch has a [valid nonce][].

[valid nonce]: http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html

More ideas? Limiting to resources with wide-open CORS headers and strong
hash functions seems like a reasonable start...
{:.issue data-number="16"}
</section><!-- /Caching::Recommendations -->
</section><!-- /Caching -->

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

[cachecontrol]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
[notransform]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.5
[Modifications to Fetch]: #modifications-to-fetch
</section><!-- /Implementation -->

<section>
## Security Considerations

<section>
### Insecure channels remain insecure

[Integrity metadata][] delivered over an insecure channel provides no security
benefit. Attackers can alter the digest in-flight (or remove it entirely (or
do absolutely anything else to the document)), just as they could alter the
resource the hash is meant to validate. Authors who desire any sort of
security whatsoever SHOULD deliver resources containing digests over
secure channels.
</section><!-- /Security::Insecure channels -->

<section>
### Hash collision attacks

Digests are only as strong as the hash function used to generate them. User
agents SHOULD refuse to support known-weak hashing functions like MD5, and
SHOULD restrict supported hashing functions to those known to be
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
static resource: consider a document that looks like this:

    <html>{static content}<h1>Hello, $username!</h1>{static content}</html>
{:.example.highlight}

An attacker can precompute hashes for the page with a variety of
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

[Link Fingerprints]: http://www.gerv.net/security/link-fingerprints/
[Link Hashes]: http://wiki.whatwg.org/wiki/Link_Hashes
</section>
