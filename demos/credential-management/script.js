/*
 * First, try to log the user in automatically by calling `get()`, and passing
 * in the `suppressUI` option. If the user can be unambigiously signed in (e.g.
 * there is one and only one valid credential for the origin, and the user has
 * the auto-sign-in option set), then credentials will be provided.
 */
if (navigator.credentials) {
  console.log("Trying automatic sign-in.");
  navigator.credentials.get({
    password: true,
    suppressUI: true
  }).then(processResponse);
}

function toggleState() {
  console.log("Toggling UI state.");
  document.body.classList.toggle('signedin');
  document.body.classList.toggle('signedout');
}

function processResponse(c) {
  if (c) {
    console.log("Got credentials for %s!", c.id);

    // In a real site, we'd do something like the following to asynchronously
    // sign the user in:
    //
    //   var fd = c.toFormData();
    //   fetch("https://example.com/signinEndpoint/", { body: fd, method: "POST" })
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
 * Next, wire up the "Sign In" button to call `get()` without the `suppressUI`
 * option, and to fall back to a sign in form if the API is not available (or
 * if no credential is provided).
 */
document.querySelector('#signin').addEventListener('click', function () {
  console.log("Clicked 'sign in!'");
  if (navigator.credentials) {
    navigator.credentials.get({
      password: true
    }).then(function (c) {
      processResponse(c);
      if (!c)
        document.querySelector('dialog').showModal();
    });
  } else {
    document.querySelector('dialog').showModal();
  }
});

/*
 * Wire up the 'Sign Out' link to call `requireUserMediation()`
 */
document.querySelector('#signout').addEventListener('click', function () {
  console.log("Clicked 'sign out!'");
  if (navigator.credentials)
    navigator.credentials.requireUserMediation();
  document.body.classList.toggle('signedin');
  document.body.classList.toggle('signedout');

});

/*
 * Finally, we'll wire up the form button on the form to call `store()` upon
 * submission if the API is available.
 */
document.querySelector('form').addEventListener('submit', function (e) {
  console.log("Submitted a sign-in form.");
  e.preventDefault();

  if (navigator.credentials) {
    var c = new PasswordCredential({
      id: document.querySelector('#username').value,
      password: document.querySelector('#password').value,
      iconURL: getFace(document.querySelector('#username').value)
    });
    navigator.credentials.store(c);
  }

  toggleState();
  document.querySelector('var').textContent = document.querySelector('#username').value;
  document.querySelector('dialog').close();

  // Clear out the form's value, because we're not actually navigating... fake it.
  document.querySelector('#username').value = "";
  document.querySelector('#password').value = "";

  return false;
});

function getFace(string) {
  var hashString = function() {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  // Faces from uifaces.com. Thanks!
  var faces = [
    "https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg",
    "https://s3.amazonaws.com/uifaces/faces/twitter/sauro/128.jpg",
    "https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg",
    "https://s3.amazonaws.com/uifaces/faces/twitter/rem/128.jpg",
    "https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg",
    "https://s3.amazonaws.com/uifaces/faces/twitter/csswizardry/128.jpg",
  ];

  return faces[hashString(string) % faces.length];
}
