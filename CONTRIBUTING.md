# Web Application Security Working Group

## Editing Process

### Test driven

ALL normative spec changes are generally expected to have a corresponding pull request in [web-platforms-tests][WPT], either in the form of new tests or modifications to existing tests, or must include the rationale for why test updates are not required for the proposed update.

Typically, both pull requests (spec updates and tests) will be merged at the same time. If a pull
request for the specification is approved but the other needs more work, add the '[needs tests](https://w3c.github.io/spec-labels.html)'
label or, in web-platform-tests, the '[status:needs-spec-decision](https://github.com/w3c/web-platform-tests/issues?utf8=%E2%9C%93&q=label%3Astatus%3Aneeds-spec-decision%20)' label. Note that a test change that
contradicts the specification should not be merged before the corresponding specification change.

If testing is not practical due to [web-platforms-tests][WPT] limitations, please explain why and if appropriate [file an issue](https://github.com/w3c/web-platform-tests/issues/new) with the '[type:untestable](https://github.com/w3c/web-platform-tests/issues?utf8=%E2%9C%93&q=label%3Atype%3Auntestable%20)' label to follow up later.

See also the [web-platform-tests documentation][WPT-intro].

## Patent Policy and Licensing

Contributions to this repository are intended to become part of Recommendation-track documents 
governed by the [W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy/) and
[Document License](https://www.w3.org/Consortium/Legal/copyright-documents). To contribute, you must 
either participate in the relevant W3C Working Group or make a non-member patent licensing
 commitment.

If you are not the sole contributor to a contribution (pull request), please identify all 
contributors in the pull request's body or in subsequent comments.

 To add a contributor (other than yourself, that's automatic), mark them one per line as follows:

 ```
 +@github_username
 ```

 If you added a contributor by mistake, you can remove them in a comment with:

 ```
 -@github_username
 ```

 If you are making a pull request on behalf of someone else but you had no part in designing the 
 feature, you can remove yourself with the above syntax.
