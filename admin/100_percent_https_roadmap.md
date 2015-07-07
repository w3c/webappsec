100% HTTPS: Roadmap for the entire Web
======================================

“Just turn on https” isn’t enough.
----------------------------------
* Mixed content and secure <--> insecure information flows can violate the invariants of secure contexts.
* Need a plan to manage upgrading static content, including URLs-as-data and URLs-as-stable-identifiers, to work with secure transports.

Terminology
-----------
* Resource = some information addressable by a URL / URI
* Application = a graph of resources instantiated in a user agent and labeled with a Web Origin security principal

E.g.: HTTP GET/POST send data from an application to a resource, XHR reads data from a resource into an application, postMessage sends data between two applications

Starting Assumptions
----------------------------------
* Axiom 1: Users cannot meaningfully deal with nuanced security models.  A resource is either secure or it is not.
* Axiom 2: Secure means that the source of information is authenticated, and it has privacy and integrity guarantees in transit between the source and the user.
* Axiom 3: (controversial?) We should not ask users to make exceptions or bypass security. (follows from Axiom 1)
* Axiom 4: Applications must be able to require a security contract from user agents on behalf of users.

e.g. if Facebook is going to send a security token somewhere on your behalf, we will never do so over an insecure channel or one that is only “optimistically” secure.

The Invariants
----------------------------------
From the Biba and Bell-LaPadula formal integrity models.
* No read up
* No read down / No write up
* No write down
* Tranquility

Complications: Each origin is the authority over its own information flows. User agents try to enforce the contracts an origin requests. Origins can read/write insecurely, but user agents also try to protect users from some classes of incorrect or dangerous actions.

No Read Up
---------------
* Insecure content cannot read secure content.
* Complicated in the context of the Web.
 - Same Origin Policy puts http & https in different origins for application instances, so http application cannot read from https application.
 - But an http resource can request and read or transclude resources with an https scheme.
 - 

No Read Down / No Write Up
---------------------------
* A resource should not read information at a lower integrity level than itself.
 - Mixed content blocking
* A resource should not write information to a higher integrity level than itself.
 - Same Origin Policy enforces this for application contexts, but…
 - http resources can GET/POST to https resources
 - Cookies (even w/secure flag) can be written by http and are sent to https


