WebAppSec Berlin F2F Agenda, July 13-14, 2015
=============================================

Logistics
---------
Mozilla has generously offered to host us at their Berlin office:
https://wiki.mozilla.org/Berlin_Office

We'll plan 90 minutes each day at noon local time to find food in the neighborhood + check your email.

July 13
=======

All times are UTC+2

10:00 - start and introductions

10:30 - 11:15 Mixed Content https://w3c.github.io/webappsec/specs/mixedcontent/

11:15 - 12:00 Upgrade Insecure Requests https://w3c.github.io/webappsec/specs/upgrade/

12:00 - 13:30 lunch

13:30 - 15:00 Powerful Features https://w3c.github.io/webappsec/specs/powerfulfeatures/

15:00 - 17:00 teleconference with W3C systems staff on migrating w3.org to https (09:00 Boston time)


July 14
=======
Guests will be joining us from the TAG.
Overall topic will be understanding plans to move the entire web to all-secure transports,
how spec work in WebAppSec can assist, and what gaps exist.

10:00 - start

10:00 - 12:00 open session: articulating goals and a clear model for what an "all-secure" Web should mean?  Can we describe in one document what properties and invariants we expect to hold according to the Same Origin Policy, Mixed Content, Powerful Features, and collective undocumented lore?  What exceptions exist for legacy reasons and their impact?

12:00 - 13:30 lunch

13:30 - 15:00 open session: how to get from today to "all-secure", migration plans, tools, gaps to fill, including non-WebAppSec work: Let's Encrypt, http-layer upgrades, HSTS

A few open problems to think about: What about "optimistic/opportunistic encryption"?  What does it mean for the web security model if we can transparently upgrade 'http' urls to full https-equivalance at runtime?  What would allow apps to be willing to use 'http' urls with that upgrade capability as-if 'https'?   How do we provide a migration path for data in localStorage or indexedDB for http origins to https?  How do we think about origin boundaries for transport upgraded content?
