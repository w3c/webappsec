//
// Step 1: Load accountchooser.
//
if (!window.accountchooser) {
  var s = document.createElement('script');
  s.src = "https://www.accountchooser.com/client.js";
  document.head.appendChild(s);
}

(function () {
  //
  // Step 3: Wrap accountchooser in promises.
  //
  function MonkeyPatchTheConsoleLogBitsOutOfAccountChooser() {
    accountchooser.util.log = function () {};
  }

  function failedSecurityChecks_() {
    if (window.top != window)
        return true;
  // TODO: Disabling for testing.
  //    if (window.location.protocol != "https:")
  //      return true;
    return false;
  }

  function getProvidersFromOptions_(options) {
    if (!options || !options.federations)
      return [];

    var toReturn = [];
    for (var i = 0; i < options.federations.length; i++) {
      var url = new URL(options.federations[i]);
      // TODO: Can we do better than hacky special-casing?
      toReturn[toReturn.length] = (url.hostname == "accounts.google.com") ? "google.com" : url.hostname;
    }
    return toReturn;
  }

  function getFederationFromProvider_(provider) {
    if (provider == "google.com")
      return "https://accounts.google.com";
    return "https://" + provider;
  }

  navigator.credentials = {
    //
    // navigator.credentials.request()
    //
    request: function (options) {
      return new Promise(function (resolve, reject) {
        if (failedSecurityChecks_())
          reject(new DOMError("SecurityError", "The credential manager API is only available on secure, top-level origins."));

        // AccountChooser can't support zero-click credentials:
        if (options && options.zeroClickOnly)
          resolve();

        var api = accountchooser.Api.init({
          popupMode: true,
          providers: getProvidersFromOptions_(options),
          callbacks: {
            "empty": function (result) { resolve(); },
            "select": function (result) {
              if (result.account) {
                console.dir(result.account);
                var c = result.account.providerId ?
                    new FederatedCredential(result.account.email, getFederationFromProvider_(result.account.providerId), result.account.displayName, result.account.photoURL) :
                    new LocalCredential(result.account.email, "", result.account.displayName, result.account.photoURL);
                resolve(c);
              } else {
                resolve();
              }
            },
            "store": function () { reject(new DOMError("InvalidStateError")); },
            "update": function () { reject(new DOMError("InvalidStateError")); },
          }
        });

        MonkeyPatchTheConsoleLogBitsOutOfAccountChooser();
        api.select();
      });
    },
    //
    // navigator.credentials.notifySignedIn()
    //
    notifySignedIn: function (c) {
      return new Promise(function (resolve, reject) {
        if (failedSecurityChecks_())
          reject(new DOMError("SecurityError", "The credential manager API is only available on secure, top-level origins."));

        var api = accountchooser.Api.init({
          popupMode: true,
          callbacks: {
            "empty": function () { resolve(); },
            "select": function () { reject(new DOMError("InvalidStateError")); },
            "store": function () { resolve(); },
            "update": function () { resolve(); },
          }
        });

        var host;
        if (c instanceof FederatedCredential) {
          var f = new URL(c.federation);
          host = f.hostname;
        }

        MonkeyPatchTheConsoleLogBitsOutOfAccountChooser();
        api.store([{
          email: c.id,
          displayName: c.name,
          photoUrl: c.avatarURL,
          providerId: host
        }]);
      });
    },
    //
    // navigator.credentials.notifyFailedSignIn()
    //
    // This is a no-op: AccountChooser doesn't allow deletion via the API.
    //
    notifyFailedSignIn: function () {
      return new Promise(function (resolve, reject) {
        resolve();
      });
    },
    //
    // navigator.credentials.notifySignedOut()
    //
    // This is a no-op: AccountChooser doesn't allow zero-click via the API.
    //
    notifySignedOut: function () {
      return new Promise(function (resolve, reject) {
        resolve();
      });
    }
  };

})();

//
// Step 4: Define some types globally.
//
var Credential = function () {};

var LocalCredential = function (id, password, name, avatarURL) {
  this.id = id;
  this.password = password;
  this.name = name;
  this.avatarURL = avatarURL;
};
var FederatedCredential = function (id, federation, name, avatarURL) {
  this.id = id;
  this.federation = federation;
  this.name = name;
  this.avatarURL = avatarURL;
};
LocalCredential.prototype = new Credential();
FederatedCredential.prototype = new Credential();
