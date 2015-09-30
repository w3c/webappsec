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
load. If an attacker can trick a user into downloading content from
a hostile server (via DNS poisoning, or other such means), the author has
no recourse. Likewise, an attacker who can replace the file on the CDN server
has the ability to inject arbitrary content.

Delivering resources over a secure channel mitigates some of this risk: with
TLS, [HSTS][], and [pinned public keys][], a user agent can be fairly certain
that it is indeed speaking with the server it believes it's talking to. These
mechanisms, however, authenticate _only_ the server, _not_ the content. An
attacker (or administrator) with access to the server can manipulate content with
impunity. Ideally, authors would not only be able to pin the keys of a
server, but also pin the _content_, ensuring that an exact representation of
a resource, and _only_ that representation, loads and executes.

This document specifies such a validation scheme, extending two HTML elements
with an `integrity` attribute that contains a cryptographic hash
of the representation of the resource the author expects to load. For instance,
an author may wish to load some framework from a shared server rather than hosting it
on their own origin. Specifying that the _expected_ SHA-384 hash of
`https://example.com/example-framework.js`
is `Li9vy3DqF8tnTXuiaAJuML3ky+er10rcgNR/VqsVpcw+ThHmYcwiB1pbOxEbzJr7` means
that the user agent can verify that the data it loads from that URL matches
that expected hash before executing the JavaScript it contains. This
integrity verification significantly reduces the risk that an attacker can
substitute malicious content.

This example can be communicated to a user agent by adding the hash to a
`script` element, like so:

    <script src="https://example.com/example-framework.js"
            integrity="sha384-Li9vy3DqF8tnTXuiaAJuML3ky+er10rcgNR/VqsVpcw+ThHmYcwiB1pbOxEbzJr7"
            crossorigin="anonymous"></script>

{:.example}

Scripts, of course, are not the only response type which would benefit
from integrity validation. The scheme specified here also applies to `link`
and future versions of the specification are likely to expand this coverage.

[HSTS]: https://tools.ietf.org/html/rfc6797
[pinned public keys]: https://tools.ietf.org/html/rfc7469

<section>
### Goals

1.  Compromise of a third-party service should not automatically mean
    compromise of every site which includes its scripts. Content authors
    will have a mechanism by which they can specify expectations for
    content they load, meaning for example that they could load a
    _specific_ script, and not _any_ script that happens to have a
    particular URL.

2.  The verification mechanism should have error-reporting functionality which
    would inform the author that an invalid response was received.

</section><!-- /Introduction::Goals -->

<section>
### Use Cases/Examples

<section>
#### Resource Integrity

*   An author wishes to use a content delivery network to improve performance
    for globally-distributed users. It is important, however, to ensure that
    the CDN's servers deliver _only_ the code the author expects them to
    deliver. To mitigate the risk that a CDN compromise (or unexpectedly malicious
    behavior) would change that site in unfortunate ways, the following
    [integrity metadata][] is added to the `link` element included on the page:

        <link rel="stylesheet" href="https://site53.example.net/style.css"
              integrity="sha384-+/M6kredJcxdsqkczBUjMLvqyHb1K/JThDXWsBVxMEeZHEaMKEOEct339VItX1zB"
              crossorigin="anonymous">
    {:.example}

*   An author wants to include JavaScript provided by a third-party
    analytics service. To ensure that only the code that has been carefully
    reviewed is executed, the author generates [integrity metadata][] for
    the script, and adds it to the `script` element:

        <script src="https://analytics-r-us.example.com/v1.0/include.js"
                integrity="sha384-MBO5IDfYaE6c6Aao94oZrIOiC6CGiSN2n4QUbHNPhzk5Xhm0djZLQqTpL0HzTUxk"
                crossorigin="anonymous"></script>
    {:.example}

*   A user agent wishes to ensure that JavaScript code running in high-privilege HTML 
    contexts (for example, a browser's New Tab page) aren't manipulated before display.
    [Integrity metadata][] mitigates the risk that altered JavaScript will run
    in these pages' high-privilege contexts.
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

The term <dfn>origin</dfn> is defined in the Origin specification.
[[!RFC6454]]

The terms <dfn>secure document</dfn> and
<dfn>secure context</dfn> are defined in section 2 of the [Secure
Contexts][securecontext] specification. An example of a secure document is a
document loaded over HTTPS. A counterexample is a document loaded over HTTP.

[securecontext]: http://www.w3.org/TR/powerful-features/
[secure context]: #dfn-secure-context
[secure document]: #dfn-secure-document

A <dfn>potentially secure origin</dfn> is defined in [section 2 of the Mixed
Content][mixedcontent] specification. An example of a potentially secure origin
is an origin whose scheme component is <code>HTTPS</code>.

[potentially secure origin]: #dfn-potentially-secure-origin
[mixedcontent]: https://www.w3.org/TR/mixed-content/#potentially-secure-origin

The <dfn>message body</dfn> and the <dfn>transfer encoding</dfn> of a resource
are defined by [RFC7230, section 3][messagebody]. [[!RFC7230]] 

[messagebody]: https://tools.ietf.org/html/rfc7230#section-3

The <dfn>representation data</dfn> and <dfn>content encoding</dfn> of a resource
are defined by [RFC7231, section 3][representationdata]. [[!RFC7231]]

[representationdata]: https://tools.ietf.org/html/rfc7231#section-3

A <dfn>base64 encoding</dfn> is defined in [RFC 4648, section 4][base64].
[[!RFC4648]]

[base64]: https://tools.ietf.org/html/rfc4648#section-4

The <dfn>SHA-256</dfn>, <dfn>SHA-384</dfn>, and <dfn>SHA-512</dfn> are part
of the <dfn>SHA-2</dfn> set of cryptographic hash functions defined by the
NIST in ["FIPS PUB 180-4: Secure Hash Standard (SHS)"][shs].

[shs]: http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
</section>

<section>
### Grammatical Concepts

The Augmented Backus-Naur Form (ABNF) notation used in this document is
specified in RFC5234. [[!ABNF]]

The following core rules are included by reference, as defined in
[Appendix B.1][abnf-b1] of [[!ABNF]]: <code><dfn>WSP</dfn></code> (white space)
and <code><dfn>VCHAR</dfn></code> (printing characters).

[abnf-b1]: https://tools.ietf.org/html/rfc5234#appendix-B.1
</section>

</section>

<section>
## Framework

The integrity verification mechanism specified here boils down to the
process of generating a sufficiently strong cryptographic digest for a
resource, and transmitting that digest to a user agent so that it may be
used to verify the response.

<section>
### Integrity metadata

To verify the integrity of a response, a user agent requires <dfn>integrity
metadata</dfn> as part of the [request][]. This metadata consists of the following
pieces of information:

* cryptographic hash function ("alg")
* [digest][] ("val")
* options ("opt")

The hash function and digest MUST be provided in order to validate a
response's integrity.

<div class="note">
At the moment, no options are defined. However, future versions of
the spec may define options, such as MIME types [[!MIMETYPE]].
</div>

This metadata MUST be encoded in the same format as the `hash-source` (without the single quotes)
in [section 4.2 of the Content Security Policy Level 2 specification][csp2-section42].

For example, given a script resource containing only the string \"alert(\'Hello, world.\');\",
an author might choose [SHA-384][sha2] as a hash function.
`H8BRh8j48O9oYatfu5AZzq6A9RINhZO5H16dQZngK7T62em8MUt1FLm52t+eX6xO` is the base64-encoded
digest that results. This can be encoded as follows:

    sha384-H8BRh8j48O9oYatfu5AZzq6A9RINhZO5H16dQZngK7T62em8MUt1FLm52t+eX6xO
{:.example}

<div class="note">
Digests may be generated using any number of utilities. [OpenSSL][], for
example, is quite commonly available. The example in this section is the
result of the following command line:

    echo -n "alert('Hello, world.');" | openssl dgst -sha384 -binary | openssl enc -base64 -A

[request]: https://fetch.spec.whatwg.org/#concept-request-integrity-metadata
[csp2-section42]: http://www.w3.org/TR/CSP2/#source-list-syntax
[openssl]: https://www.openssl.org/
</div>

[sha2]: #dfn-sha-2
[digest]: #dfn-digest
[integrity metadata]: #dfn-integrity-metadata
</section><!-- /Framework::Required metadata -->

<section>
### Cryptographic hash functions

Conformant user agents MUST support the [SHA-256][sha2], [SHA-384][sha2]
and [SHA-512][sha2] cryptographic hash functions for use as part of a
request's [integrity metadata][], and MAY support additional hash functions.

<section>
#### Agility

Multiple sets of [integrity metadata][] may be associated with a single
resource in order to provide agility in the face of future cryptographic discoveries.
For example, the resource described in the previous section may be described
by either of the following hash expressions:

    sha384-dOTZf16X8p34q2/kYyEFm0jh89uTjikhnzjeLeF0FHsEaYKb1A1cv+Lyv4Hk8vHd
    sha512-Q2bFTOhEALkN8hOms2FKTDLy7eugP2zFZ1T8LCvX42Fp3WoNr3bjZSAHeOsHrbV1Fu9/A0EzCinRE7Af1ofPrw==

Authors may choose to specify both, for example:

    <script src="hello_world.js"
       integrity="sha384-dOTZf16X8p34q2/kYyEFm0jh89uTjikhnzjeLeF0FHsEaYKb1A1cv+Lyv4Hk8vHd
                  sha512-Q2bFTOhEALkN8hOms2FKTDLy7eugP2zFZ1T8LCvX42Fp3WoNr3bjZSAHeOsHrbV1Fu9/A0EzCinRE7Af1ofPrw=="
       crossorigin="anonymous"></script>

In this case, the user agent will choose the strongest hash function in the
list, and use that metadata to validate the response (as described below in
the "[parse metadata][parse]" and "[get the strongest metadata from
set][get-the-strongest]" algorithms).

When a hash function is determined to be insecure, user agents SHOULD deprecate
and eventually remove support for integrity validation using that hash
function. User agents MAY check the validity of responses using a digest based on
a deprecated function.

To allow authors to switch to stronger hash functions without being held back by older
user agents, validation using unsupported hash functions acts like no integrity value 
was provided (see the "[Does response match metadataList][match]" algorithm below). 
Authors  are encouraged to use strong hash functions, and to begin migrating to 
stronger hash functions as they become available.
</section><!-- /Framework::Cryptographic hash functions::Agility -->

<section>
#### Priority

User agents must provide a mechanism for determining the relative priority of two
hash functions and return the empty string if the priority is equal. That is, if
a user agent implemented a function like <dfn>getPrioritizedHashFunction(a,
b)</dfn> it would return the hash function the user agent considers the most
collision-resistant.  For example, `getPrioritizedHashFunction('sha256',
'sha512')` would return `'sha512'` and `getPrioritizedHashFunction('sha256',
'sha256')` would return the empty string.

<div class="note">
The <dfn>getPrioritizedHashFunction</dfn> is an internal 
implementation detail. It is not an API that implementors 
provide to web applications. It is used in this document 
only to simplify the algorithm description.
</div>

</section><!-- /Framework::Cryptographic hash functions::Priority -->

</section><!-- /Framework::Cryptographic hash functions -->

<section>
### Response verification algorithms

<section>
#### Apply <var>algorithm</var> to <var>response</var>
{: #apply-algorithm-to-response}
[apply-algorithm]: #apply-algorithm-to-response

1.  Let <var>result</var> be the result of [applying <var>algorithm</var>][apply-algorithm]
    to the [representation data][representationdata] without any content-codings
    applied, except when the user agent intends to consume the content with
    content-encodings applied. In the latter case, let <var>result</var> be
    the result of applying <var>algorithm</var> to the [representation data][representationdata].
2.  Let <var>encodedResult</var> be result of base64-encoding
    <var>result</var>.
3.  Return <var>encodedResult</var>.
</section><!-- Algorithms::apply -->
<section>
#### Is <var>response</var> eligible for integrity validation
{: #is-response-eligible-for-integrity-validation}
[eligible]: #is-response-eligible-for-integrity-validation

In order to mitigate an attacker's ability to read data cross-origin by
brute-forcing values via integrity checks, responses are only eligible for such
checks if they are same-origin or are the result of explicit access granted to
the loading origin via CORS. [[!CORS]]

As noted in [RFC6454, section 4][uri-origin], some user agents use
globally unique identifiers for each file URI. This means that
resources accessed over a `file` scheme URL are unlikely to be
eligible for integrity checks.
{:.note}

One should note that being a [secure document][] (e.g., a document delivered
over HTTPS) is not necessary for the use of integrity validation. Because
resource integrity is only an application level security tool, and it does not
change the security state of the user agent, a [secure document] is
unnecessary. However, if integrity is used in something other than a [secure document][]
(e.g., a document delivered over HTTP), authors should be aware that the integrity
provides <em>no security guarantees at all</em>. For this reason, authors should
only deliver integrity metadata on a [potentially secure origin][].  See
[Non-secure contexts remain non-secure][] for more discussion.

{:.note}

[uri-origin]: https://tools.ietf.org/html/rfc6454#section-4
[Non-secure contexts remain non-secure]: #non-secure-contexts-remain-non-secure

The following algorithm details these restrictions:

1.  Let <var>request</var> be the request that fetched
    <var>resource</var>.
2.  If the [response type][] is `opaque`, return `false`.
3.  If the [mode][fetch-mode] of <var>request</var> is `CORS`,
    return `true`.
4.  If the [origin][fetch-origin] of <var>request</var> is
    <var>resource</var>'s origin, return `true`.
5.  Return `false`.

Step 3 returns `true` if the fetch was a CORS-enabled request. If the
fetch failed the CORS checks, it won't be available to us for integrity
checking because it won't have loaded successfully.
{:.note}

Since the [response type][] for data URLs will always be "opaque" for
`script` and `link` elements, such URLs are never eligible for integrity
checks. Blob URLs on the other hand are usually considered same-origin and
therefore are eligible for integrity checks.
{:.note}

[fetch-mode]: https://fetch.spec.whatwg.org/#concept-request-mode
[fetch-origin]: https://fetch.spec.whatwg.org/#concept-request-origin
[response type]: https://fetch.spec.whatwg.org/#concept-response-type
</section><!-- Algorithms::eligible -->
<section>
#### Parse <var>metadata</var>.
{: #parse-metadata}
[parse]: #parse-metadata

This algorithm accepts a string, and returns either `no metadata`, or a set of
valid hash expressions whose hash functions are understood by
the user agent.

1.  Let <var>result</var> be the empty set.
2.  Let <var>empty</var> be equal to `true`.
3.  For each <var>token</var> returned by [splitting <var>metadata</var> on
    spaces][split-on-spaces]:
    1.  Set <var>empty</var> to `false`.
    2.  If <var>token</var> is not a valid metadata, skip the remaining
        steps, and proceed to the next token.
    3.  Parse <var>token</var> per the grammar in [integrity metadata][]
    4.  Let <var>algorithm</var> be the <var>alg</var> component of
        <var>token</var>.
    5.  If <var>algorithm</var> is a hash function recognized by the user
        agent, add the parsed <var>token</var> to <var>result</var>.
4.  Return `no metadata` if <var>empty</var> is `true`, otherwise return
    <var>result</var>.

[split-on-spaces]: http://www.w3.org/TR/html5/infrastructure.html#split-a-string-on-spaces
</section><!-- Algorithms::parse -->
<section>
#### Get the strongest metadata from <var>set</var>.
{: #get-the-strongest-metadata-from-set}
[get-the-strongest]: #get-the-strongest-metadata-from-set

1.  Let <var>result</var> be the empty set and <var>strongest</var> be the empty
    string.
2.  For each <var>item</var> in <var>set</var>:
    1.  If <var>result</var> is the empty set, add <var>item</var> to
        <var>result</var> and set <var>strongest</var> to <var>item</var>, skip
        to the next <var>item</var>.
    2.  Let <var>currentAlgorithm</var> be the <var>alg</var> component of
        <var>strongest</var>.
    3.  Let <var>newAlgorithm</var> be the <var>alg</var> component of
        <var>item</var>.
    4.  If the result of [`getPrioritizedHashFunction(currentAlgorithm, newAlgorithm)`][getPrioritizedHashFunction]
        is the empty string, add <var>item</var> to <var>result</var>. If the
        result is <var>newAlgorithm</var>, set <var>strongest</var> to
        <var>item</var>, set <var>result</var> to the empty set, and add
        <var>item</var> to <var>result</var>.
3.  Return <var>result</var>.

[getPrioritizedHashFunction]: #dfn-getprioritizedhashfunction-a-b
</section><!-- /Algorithms::get the strongest metadata -->
<section>
#### Does <var>response</var> match <var>metadataList</var>?
{: #does-response-match-metadatalist}
[match]: #does-response-match-metadatalist

1.  Let <var>parsedMetadata</var> be the result of
    [parsing <var>metadataList</var>][parse].
2.  If <var>parsedMetadata</var> is `no metadata`, return `true`.
3.  If [<var>response</var> is not eligible for integrity
    validation][eligible], return `false`.
4.  If <var>parsedMetadata</var> is the empty set, return `true`.
5.  Let <var>metadata</var> be the result of [getting the strongest
    metadata from <var>parsedMetadata</var>][get-the-strongest].
6.  For each <var>item</var> in <var>metadata</var>:
    1.  Let <var>algorithm</var> be the <var>alg</var> component of
        <var>item</var>.
    2.  Let <var>expectedValue</var> be the <var>val</var> component of
        <var>item</var>.
    3.  Let <var>actualValue</var> be the result of [applying
        <var>algorithm</var> to <var>response</var>][apply-algorithm].
    4.  If <var>actualValue</var> is a case-sensitive match for
        <var>expectedValue</var>, return `true`.
7.  Return `false`.

This algorithm allows the user agent to accept multiple, valid strong hash
functions. For example, a developer might write a `script` element such as:

    <script src="https://example.com/example-framework.js"
            integrity="sha384-Li9vy3DqF8tnTXuiaAJuML3ky+er10rcgNR/VqsVpcw+ThHmYcwiB1pbOxEbzJr7
                       sha384-+/M6kredJcxdsqkczBUjMLvqyHb1K/JThDXWsBVxMEeZHEaMKEOEct339VItX1zB"
            crossorigin="anonymous"></script>

which would allow the user agent to accept two different content payloads, one
of which matches the first SHA384 hash value and the other matches the second
SHA384 hash value.

{:.example}

User agents may allow users to modify the result of this algorithm via user
preferences, bookmarklets, third-party additions to the user agent, and other
such mechanisms. For example, redirects generated by an extension like
[HTTPS Everywhere](https://www.eff.org/https-everywhere) could load and execute
correctly, even if the HTTPS version of a resource differs from the HTTP
version.
{:.note}

This algorithm returns `false` if the response is not [eligible] for integrity
validation since Subresource Integrity requires CORS, and it is a logical error
to attempt to use it without CORS. Additionally, user agents SHOULD report a
warning message to the developer console to explain this failure.
{:.note}
</section><!-- Algorithms::Match -->
</section><!-- Algorithms -->

<section>
### Verification of HTML document subresources

A variety of HTML elements result in requests for resources that are to be
embedded into the document, or executed in its context. To support integrity
metadata for some of these elements, a new `integrity` attribute is added to
the list of content attributes for the `link` and `script` elements.

A corresponding `integrity` IDL attribute which [reflects][reflect] the
value each element's `integrity` content attribute is added to the
`HTMLLinkElement` and `HTMLScriptElement` interfaces.

A future revision of this specification is likely to include integrity support
for all possible subresources, i.e., `a`, `audio`, `embed`, `iframe`, `img`,
`link`, `object`, `script`, `source`, `track`, and `video` elements.
{:.note}

</section>

<section>
#### The `integrity` attribute
{: #the-integrity-attribute}

The `integrity` attribute represents [integrity metadata][] for an element.
The value of the attribute MUST be either the empty string, or at least one
valid metadata as described by the following ABNF grammar:

    integrity-metadata = *WSP hash-with-options *( 1*WSP hash-with-options ) *WSP / *WSP
    hash-with-options  = hash-expression *("?" option-expression)
    option-expression  = *VCHAR
    hash-algo          = <hash-algo production from [Content Security Policy Level 2, section 4.2]>
    base64-value       = <base64-value production from [Content Security Policy Level 2, section 4.2]>
    hash-expression    = hash-algo "-" base64-value

The `integrity` IDL attribute must [reflect][] the `integrity` content attribute.

`option-expression`s are associated on a per `hash-expression` basis and are
applied only to the `hash-expression` that immediately precedes it.

In order for user agents to remain fully forwards compatible with future
options, the user agent MUST ignore all unrecognized  `option-expression`s.

Note that while the `option-expression` has been reserved in the syntax, no
options have been defined. It is likely that a future version of the spec will
define a more specific syntax for options, so it is defined here as broadly
as possible.
{:.note}

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

The user agent will refuse to render or execute responses that fail an integrity
check, instead returning a network error as defined in Fetch [[!FETCH]].

On a failed integrity check, an <code>error</code> event is thrown. Developers
wishing to provide a canonical fallback resource (e.g., a resource not served
from a CDN, perhaps from a secondary, trusted, but slower source) can catch this
<code>error</code> event and provide an appropriate handler to replace the
failed resource with a different one.
{:.note}

</section>

<section>
##### Elements

<section>
###### The `link` element for stylesheets
{: #the-link-element-for-stylesheets}

Whenever a user agent attempts to [obtain a resource][] pointed to by a
`link` element that has a `rel` attribute with the keyword of `stylesheet`,
modify step 4 to read:

Do a potentially CORS-enabled fetch of the resulting absolute URL, with the
mode being the current state of the element's crossorigin content attribute,
the origin being the origin of the link element's Document, the default origin
behaviour set to taint, and the [integrity metadata][] of the request to the
value of the element's `integrity` attribute.

{:start="4"}

[obtain a resource]: http://www.w3.org/TR/html5/document-metadata.html#concept-link-obtain
</section><!-- /Framework::HTML::link -->

<section>
###### The `script` element
{: #the-script-element}

Replace step 14.1 of HTML5's ["prepare a script" algorithm][prepare] with:

1.  Let <var>src</var> be the value of the element's `src` attribute and
    the request's associated [integrity metadata][] be the value of the element's
    `integrity` attribute.

{:start="6"}

[prepare]: http://www.w3.org/TR/html5/scripting-1.html#prepare-a-script
[fetching algorithm]: http://www.w3.org/TR/html5/infrastructure.html#potentially-cors-enabled-fetch
[fire a simple event]: http://www.w3.org/TR/html5/webappapis.html#fire-a-simple-event
[queue a task]: http://www.w3.org/TR/html5/webappapis.html#queue-a-task
</section><!-- /Framework::HTML::Elements::script -->

</section><!-- /Framework::HTML::Elements -->

</section><!-- /Framework -->

<section>
## Proxies

Optimizing proxies and other intermediate servers which modify the
responses MUST ensure that the digest associated
with those responses stays in sync with the new content. One option
is to ensure that the [integrity metadata][] associated with
resources is updated. Another
would be simply to deliver only the canonical version of resources
for which a page author has requested integrity verification.

To help inform intermediate servers, those serving the resources SHOULD
send along with the resource a [`Cache-Control`][cachecontrol] header
with a value of [`no-transform`][notransform].

[cachecontrol]: https://tools.ietf.org/html/rfc7234#section-5.2
[notransform]: https://tools.ietf.org/html/rfc7234#section-5.2.1.6

</section><!-- /Implementation -->

<section>
## Security Considerations

<section>
### Non-secure contexts remain non-secure

[Integrity metadata][] delivered by a context that is not a [secure context],
such as an HTTP page, only protects an origin against a compromise of the
server where an external resources is hosted. Network attackers can alter the
digest in-flight (or remove it entirely, or do absolutely anything else to the
document), just as they could alter the response the hash is meant to validate.
Thus, authors SHOULD deliver integrity metadata only to a [secure
document][]. See also [securing the web][].

Similarly, since integrity checks do not provide any privacy guarantees,
[Integrity metadata][] MUST NOT affect the return values of the Mixed Content
algorithms as defined in [section 5 of the Mixed
Content][mixedcontent-algorithms]
specification.

[Securing the Web]: http://www.w3.org/2001/tag/doc/web-https
[mixedcontent-algorithms]: http://www.w3.org/TR/mixed-content/#algorithms
</section><!-- /Security::Non-secure contexts remain non-secure -->

<section>
### Hash collision attacks

Digests are only as strong as the hash function used to generate them. User
agents SHOULD refuse to support known-weak hashing functions like MD5 or SHA-1,
and SHOULD restrict supported hashing functions to those known to be
collision-resistant. At the time of writing, SHA-384 is a good baseline.
Moreover, user agents SHOULD re-evaluate their supported hash functions
on a regular basis, and deprecate support for those functions shown to be
insecure.
</section><!-- /Security::Hash collision -->

<section>
### Cross-origin data leakage

This specification requires the [CORS settings attribute][] to be present on
integrity-protected cross-origin requests. If that requirement were omitted,
attackers could violate the [same-origin policy][] and determine whether
a cross-origin resource has certain content.

Attackers would attempt to load the resource with a known digest, and
watch for load failures. If the load fails, the attacker could surmise
that the response didn't match the hash and thereby gain some insight into
its contents. This might reveal, for example, whether or not a user is
logged into a particular service.

Moreover, attackers could brute-force specific values in an otherwise
static resource. Consider a JSON response that looks like this:

    {'status': 'authenticated', 'username': 'admin'}
{:.example}

An attacker could precompute hashes for the response with a variety of
common usernames, and specify those hashes while repeatedly attempting
to load the document. A successful load would confirm that the attacker
has correctly guessed the username.

[CORS settings attribute]: http://www.w3.org/TR/html5/infrastructure.html#cors-settings-attributes
[same-origin policy]: http://www.w3.org/Security/wiki/Same_Origin_Policy
</section><!-- /Security::cross-origin -->

</section><!-- /Security -->

<section>
## Acknowledgements

Much of the content here is inspired heavily by Gervase
Markham's [Link Fingerprints][] concept, as well as WHATWG's [Link Hashes][].

A special thanks to Mike West of Google, Inc. for his invaluable contributions
to the initial version of this spec. Additonally, Brad Hill, Anne van Kesteren,
Jonathan Kingston, Mark Nottingham, Dan Veditz, Eduardo Vela, Tanvi Vyas, and
Michal Zalewski provided invaluable feedback.


[Link Fingerprints]: http://www.gerv.net/security/link-fingerprints/
[Link Hashes]: https://wiki.whatwg.org/wiki/Link_Hashes
</section>
