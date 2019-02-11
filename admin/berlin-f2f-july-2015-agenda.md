WebAppSec Berlin F2F Agenda, July 13-14, 2015
=============================================

Logistics
---------
Mozilla has generously offered to host us at their Berlin office:
https://wiki.mozilla.org/Berlin_Office

See dial-in and irc details below.

Lunch is provided for registered attendees, courtesy of our host.

July 13
=======
All times are UTC+2

10:00 - start and introductions

10:30 - 11:15 Mixed Content https://w3c.github.io/webappsec/specs/mixedcontent/

11:15 - 12:00 Upgrade Insecure Requests https://w3c.github.io/webappsec/specs/upgrade/ (also, let's visit the IETF proposal at: https://tools.ietf.org/html/draft-hoffman-trytls-02) 

12:00 - 13:30 lunch

13:30 - 15:00 Powerful Features https://w3c.github.io/webappsec/specs/powerfulfeatures/

15:00 - 17:00 teleconference with W3C systems staff on migrating w3.org to https (09:00 Boston time)
 Systeam has a test mirror set-up at https://www-test.w3.org/. While we haven't rewritten links, you can substitute www-test for www in an existing URL to see what a page looks like if only the scheme is changed (e.g. https://www-test.w3.org/TR/mixed-content/ )

Do we want to give any time to Subresource Integrity?

July 14
=======
Guests will be joining us from the TAG.
Overall topic will be understanding plans to move the entire web to all-secure transports,
how spec work in WebAppSec can assist, and what gaps exist.

Some starting notes to guide the discussion: PR's and updates welcome:
https://github.com/w3c/webappsec/blob/master/admin/100_percent_https_roadmap.md

10:00 - start

10:00 - 12:00 open session: articulating goals and a clear model for what an "all-secure" Web should mean?  Can we describe in one document what properties and invariants we expect to hold according to the Same Origin Policy, Mixed Content, Powerful Features, and collective undocumented lore?  What exceptions exist for legacy reasons and their impact?

12:00 - 13:30 lunch

13:30 - 15:00 open session: how to get from today to "all-secure", migration plans, tools, gaps to fill, including non-WebAppSec work: Let's Encrypt, http-layer upgrades, HSTS

A few open problems to think about: What about "optimistic/opportunistic encryption"?  What does it mean for the web security model if we can transparently upgrade 'http' urls to full https-equivalance at runtime?  What would allow apps to be willing to use 'http' urls with that upgrade capability as-if 'https'?   How do we provide a migration path for data in localStorage or indexedDB for http origins to https?  How do we think about origin boundaries for transport-upgraded content?


Remote Participation Details
============================
#webappsec on irc.w3.org:6665
Meeting Number: 644 611 011
Meeting Password: webappsec


To join the online meeting (Now from mobile devices!)
-------------------------------------------------------
1. Go to
https://mit.webex.com/mit/j.php?MTID=m4f38efcb32d0e25ff09e58b6a1040702
2. If requested, enter your name and email address.
3. If a password is required, enter the meeting password: webappsec
4. Click "Join".

To view in other time zones or languages, please click the link:
https://mit.webex.com/mit/j.php?MTID=m6ea313ca2c810e419a057416e0ce3567

To join the audio conference only
-------------------------------------------------------
To receive a call back, provide your phone number when you join the
meeting, or call the number below and enter the access code.
US Toll Number: +1-617-324-0000

Access code:644 611 011
Mobile Auto Dial:+1-617-324-0000,,,644611011#


For assistance
-------------------------------------------------------
1. Go to https://mit.webex.com/mit/mc
2. On the left navigation bar, click "Support".
