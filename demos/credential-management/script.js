/*
 * First, try to log the user in automatically by calling `get()`, and passing
 * in the `suppressUI` option. If the user can be unambigiously signed in (e.g.
 * there is one and only one valid credential for the origin, and the user has
 * the auto-sign-in option set), then credentials will be provided.
 */
if (navigator.credentials) {
  console.log("Trying automatic sign-in.");

  var getData = {
    password: true,
    federated: {
      providers: ['https://accounts.federation.com/', 'https://accounts.industrious.com/' ]
    },
    mediation: (window.location.search !== "?fullauto") ? "optional" : "silent"
  };

  navigator.credentials.get(getData).then(processResponse);

  if (window.location.protocol !== "https:") {
    var section = document.createElement('section');
    section.innerHTML = "<p><code>navigator.credentials</code> is available, but will only work in a secure context. Try <a href='https://w3c.github.io/webappsec/demos/credential-management/'>visiting this page over HTTPS</a>!</p>";
    section.classList.toggle('warning');
    document.body.appendChild(section);
  }
} else {
  var section = document.createElement('section');
  section.innerHTML = "<p><code>navigator.credentials</code> is not available! Have you enabled the feature in your browser? (Visit <code>chrome://flags/#enable-credential-manager-api</code> in Chrome, for example.)</p>";
  section.classList.toggle('warning');
  document.body.appendChild(section);
}

function toggleState() {
  console.log("Toggling UI state.");
  document.body.classList.toggle('signedin');
  document.body.classList.toggle('signedout');

  document.querySelector('#signin').textContent = document.body.classList.contains('signedin') ? "Sign out!" : "Sign in!";
}

function processResponse(c) {
  if (c) {
    console.log("Got credentials for %s!", c.id);

    // In a real site, we'd do something like the following to asynchronously
    // sign the user in:
    //
    //   fetch("https://example.com/signinEndpoint/", { credentials: c, method: "POST" })
    //       .then(function (response) {
    //         if ([check that the response is a valid signin event])
    //           updateUI();
    //       });
    //
    // Here, we'll just update the UI:
    toggleState();
    document.querySelector('var').textContent = c.id;
  }
}

/*
 * Next, wire up the "Sign In" button to call `get()` without the `unmediated`
 * option, and to fall back to a sign in form if the API is not available (or
 * if no credential is provided).
 */
document.querySelector('#signin').addEventListener('click', function () {
  if (document.body.classList.contains('signedin')) {
    console.log("Clicked #signin while signed in! Signing out!");

    if (navigator.credentials)
      navigator.credentials.preventSilentAccess();
    toggleState();
    return;
  }

  console.log("Clicked 'sign in!'");
  if (navigator.credentials) {
    navigator.credentials.get({
      password: true,
      federated: {
        providers: ['https://accounts.federation.com/', 'https://accounts.industrious.com/' ]
      }
    }).then(function (c) {
      processResponse(c);
      if (!c) {
        document.querySelector('#fed1').addEventListener('click', handleFederation);
        document.querySelector('#fed2').addEventListener('click', handleFederation);
        document.querySelector('dialog').showModal();
      }
    });
  } else {
    document.querySelector('form button').addEventListener('click', handleFederation);
    document.querySelector('dialog').showModal();
  }
});

/*
 * Wire up the 'Sign Out' link to call `preventSilentAccess()`
 */
document.querySelector('#signout').addEventListener('click', function () {
  console.log("Clicked 'sign out!'");
  if (navigator.credentials)
    navigator.credentials.preventSilentAccess();
  toggleState();
});

/*
 * Wire up the 'sign in via' button.
 */
function handleFederation(e) {
  console.log("Signed in via a federation!");
  e.preventDefault();

  if (navigator.credentials) {
    var data = e.target.id == "fed1" ? {
      id: 'fred@federated.com',
      name: 'Funky Fred',
      provider: 'https://accounts.federation.com/',
      iconURL: getFace('fred@federated.com')
    } : {
      id: 'ichabald@industrious.com',
      provider: 'https://accounts.industrious.com/',
      iconURL: getFace('ichabald@industrious.com')
    };

    var c = new FederatedCredential(data);
    navigator.credentials.store(c).then(function (a) { console.log(a); }).catch(function (e) { console.log(e); });
  }

  // Sign the user in asynchronously using the relevant SDK for the chosen federation.

  toggleState();
  document.querySelector('var').textContent = e.target.id == "fed1" ? 'fred@federated.com' : 'ichabald@industrious.com';
  document.querySelector('dialog').close();

  return false;
}

/*
 * Finally, we'll wire up the submit button on the form to call `store()` upon
 * submission if the API is available.
 */
document.querySelector('form').addEventListener('submit', function (e) {
  console.log("Submitted a sign-in form.");
  e.preventDefault();

  if (navigator.credentials) {
    var c = new PasswordCredential({
      id: document.querySelector('#username').value,
      password: document.querySelector('#password').value,
      name: document.querySelector('#friendly').value ? document.querySelector('#friendly').value : undefined,
      iconURL: getFace(document.querySelector('#username').value)
    });

    navigator.credentials.store(c).then(function (a) { console.log(a); }).catch(function (e) { console.log(e); });
  }

  // Sign the user in asynchronously using the data in the form. This will either look like
  // the code in `processResponse()` above (if the credentials API is available), or
  // something like the following if it's not:
  //
  // fetch("https://example.com/signinEndpoint/",
  //       { body: new FormData(document.querySelector('form')), method: "POST" });
  //  
  // Note that we call `e.preventDefault()` at the top of this event handler to prevent
  // the actual form submission while we do the asynchronous request.

  toggleState();
  document.querySelector('var').textContent = document.querySelector('#username').value;
  document.querySelector('dialog').close();

  // Clear out the form's value, because we're not actually navigating... fake it.
  document.querySelector('#username').value = "";
  document.querySelector('#password').value = "";

  return false;
});

function getFace(string) {
  return "https://robohash.org/" + string + "?set=set3";
}
