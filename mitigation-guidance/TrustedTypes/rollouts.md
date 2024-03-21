# Refactoring your application to make it Trusted Types compatible

Deploying Trusted Types usually requires refactoring your frontend code to make it use special trusted types rather than strings when interacting with the DOM. Oftentimes it makes sense to tackle these refactorings before enabling a report-only policy. You can use static analysis tooling like [eslint-plugin-no-unsanitized](https://github.com/mozilla/eslint-plugin-no-unsanitized) or [tsec](https://github.com/google/tsec) to find locations in your code that need to be refactored. 

## Assigning text to HTML sinks

Sometimes, plaintext is assigned to HTML sinks in order to be displayed. This can be changed to use safer alternatives:

**Violation examples:**
```
elem.innerHTML = "Hi " + name;
elem.innerHTML = "&nbsp;";
elem.innerHTML = "";
scriptElem.innerHTML = "";
```

**Trusted Types compatible code:**
```
elem.textContent = “Hi “ + name;
elem.textContent = “\u00A0”; // Unicode form of &nbsp;
elem.innerHTML = trustedTypes.emptyHTML;
scriptElem.innerHTML = trustedTypes.emptyScript;
```

## Assigning HTML string to HTML sinks

Due to Trusted Types’ runtime type checks, assigning an HTML string requires explicit type conversion to TrustedHTML. There are a few possible ways to do this:

### Template element 
You can use the `<template>` element to render HTML for later use in JS.

**Violation examples:**
```
elem.innerHTML = '<div><p>' + pText + '</p> </div>';
```

**Trusted Types compatible code:**

HTML file: 
```
<template id="foo-template">
  <div>
    <p></p>
  </div>
</template> 
```

JS file: 
```
elem.innerHTML = trustedTypes.emptyHTML;
const temp = document.querySelector('#foo-template').cloneNode(true).content; 
temp.querySelector('p').textContent = pText;
elem.appendChild(temp);
```

### DOM APIs

Alternatively, you can use DOM APIs to manually build the HTML:

**Violation examples:**
```
elem.innerHTML += '<p>' + pText + '</p>';
```

**Trusted Types compatible code:**
```
const p = document.createElement('p');
p.textContent = pText;
elem.appendChild(p);
```

### HTML Sanitizer with Trusted Types support

Some HTML Sanitizer libraries support Trusted Types, such as DOMPurify.

**Violation examples:**
```
elem.innerHTML = untrusted_html;
```

**Trusted Types compatible code:**
```
elem.innerHTML = DOMPurify.sanitize(untrusted_html, {RETURN_TRUSTED_TYPE: true});
```

### Creating a Trusted Types policy to return a static string 

If you have a large chunk of static HTML, you can create a single use Trusted Types policy to create that static HTML. 

**Violation examples:**
```
elem.innerHTML = "<div>my large html</div>";
``` 

**Trusted Types compatible code:**
```
const htmlString =  "<div>my large html</div>";

// Note: window.trustedTypes is only defined on browsers that support trusted types. 
// Get the polyfill here: https://github.com/w3c/webappsec-trusted-types#polyfill
const staticHtmlPolicy = trustedTypes.createPolicy(
    'foo-static', {createHTML: () => htmlString});

// Unfortunately, a string argument to createHTML is required.
// https://github.com/w3c/webappsec-trusted-types/issues/278
elem.innerHTML = staticHtmlPolicy.createHTML('');
```

### Trusted Types’ fromLiteral (to be implemented)

In the future, it will be possible to assign a static HTML string to an element. By using tagged template literals, browsers can verify the staticness of a string (as opposed to normal strings which have no way of verifying staticness), and therefore this is safe.

**Violation examples:**
```
elem.innerHTML = ”<h1>Hello World!</h1>”;
```

**Trusted Types compatible code**
```
elem.innerHTML = TrustedHTML.fromLiteral`<h1>Hello World!</h1>`;
```

### Sanitizer API (to be implemented)

In the future, you can sanitize and assign an untrusted HTML string to an element.

**Violation examples:**
```
elem.innerHTML = untrusted_html;
```

**Trusted Types compatible code:**
```
elem.setHTML(untrusted_html);
```

## Assigning url as ScriptURL

Sometimes, you want to append other scripts to the document. This requires assigning a TrustedScriptURL to a script element’s src attribute. This can be done by defined a policy that validates source URLs. 

**Violation examples:**
```
const script = document.createEelement(‘script’);
script.src = url;
document.body.appendChild(script);
```

**Trusted Types compatible code:**
```
// Note: window.trustedTypes is only defined on browsers that support trusted types. 
// Get the polyfill here: https://github.com/w3c/webappsec-trusted-types#polyfill
const scriptPolicy = trustedTypes.createPolicy(‘url-pattern’, {
  createScriptURL: url => {
    const examplePattern = new URLPattern({
      baseURL: 'https://www.example.com/', 
      pathname: '/static/js/*.js'
    });
    if (examplePattern.test(url))
      return url;
  }
});
 
const script = document.createEelement(‘script’);
script.src = scriptPolicy.createScriptURL(url);
document.body.appendChild(script);
```

# Deploying a report-only Trusted Types policy 

After you have refactored the majority of your application to be trusted types compatible, it is time to deploy a report-only policy. A report-only policy will allow you to gather real-world data on whether your application is compatible with Trusted Types. To deploy a report-only policy, set the response header:

```
content-security-policy-report-only: require-trusted-types-for 'script'; report-uri /cspreport
```

/cspreport will receive JSON POST requests from the browser saying where a violation occurred. For example, if your application assigns a string to `elem.innerHTML`, then the browser will send a POST request containing:

```
{
"csp-report": {
    "document-uri": "https://example.com",
    "violated-directive": "require-trusted-types-for",
    "disposition": "report",
    "blocked-uri": "trusted-types-sink",
    "line-number": 12,
    "column-number": 34,
    "source-file": "https://example.com/script.js",
    "script-sample": "Element innerHTML <img src=x"
}
}
```

From this report, you can search your application for the source of the violation and use the above refactoring strategies to make it compatible with Trusted Types. 

# Enforcing Trusted Types

In theory, once your application is Trusted Types compatible, no more reports should be sent to /cspreport, and then you can turn on enforcement by setting the response header:

```
content-security-policy: require-trusted-types-for 'script'
```

# Common Difficulties

## Noisy Reports

Oftentimes, Trusted Types reports are noisy and you will receive reports that do not correspond to a violation in your code. For example, a browser extension could inject additional JS that violates Trusted Types. There are a number of strategies that can be used to filter out this noise:

1. Manual inspection. If your application is small enough, you can often manually inspect the reports to determine if they could have come from your application. 

2. Filtering out reports where the `source-file` points to a `chrome-extension://*` URL. If you know that there are no Chrome extensions that are supported by your application, this can filter out a lot of reports. 

3. Using JS source maps to map back the line/column numbers and source file to the unminified JS. This can help determine which violations definitely come from your application. 

4. Tagging reports that come from your team. If you know that your team doesn't use any browser extensions that could trigger noisy reports, this can give a solid baseline of what reports are not noise. 

5. Counting the number of violations. For example, if a violation only occurs for 0.01% of page loads, it is probably noise. 

## Cross-browser compatibility 

Not all browsers support trusted types. See [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for) for up-to-date information on which browsers support trusted types. For browsers that don't support Trusted Types you can either use a [polyfill](https://github.com/w3c/webappsec-trusted-types#polyfill) or you can feature-detect based on the presence of `window.trustedTypes`:

```
if (window.trustedTypes) {
    // Trusted types supported! Use trustedTypes.createPolicy to create policies!
} else {
    // Trusted types not supported, just assign strings to DOM sinks directly 
}
```

## Library Compatibility

Trusted Types requires **all** the code in your application, whether it was written by you or imported through a common framework/library/package, to be compliant in order to enforce without breakages.

Sometimes, while evaluating the violation reports in your application, you will find that the violation does not originate from your code but rather within imported third-party code. For these cases, the recommended course of action is

1. Search the Github issues of the project to see whether Trusted Types compatibility was added in a more recent release. In this case, you will just have to bump the version of the library to a more recent version.

2. If no issue is found, please file an issue.

3. If you feel confident in refactoring, please go ahead and submit a pull request.

