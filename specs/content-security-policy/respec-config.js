var respecConfig = {
    // specification status (e.g. WD, LCWD, NOTE, etc.). If in doubt use ED.
    // Member-SUBM
    specStatus:           "ED",

    // the specification's short name, as in http://www.w3.org/TR/short-name/
    shortName:            "CSP",

    // if your specification has a subtitle that goes below the main
    // formal title, define it here
    // subtitle   :  "an excellent document",

    // if you wish the publication date to be other than today, set this
    // publishDate:  "2009-08-06",

    // if the specification's copyright date is a range of years, specify
    // the start date here:
    copyrightStart: "2010",

    // if there is a previously published draft, uncomment this and set its YYYY-MM-DD date
    // and its maturity status
    // previousPublishDate:  "1977-03-15",
    // previousMaturity:  "WD",

    // if there a publicly available Editor's Draft, this is the link
    edDraftURI:           "http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html",

    // if this is a LCWD, uncomment and set the end of its review period
    // lcEnd: "2009-08-05",

    // editors, add as many as you like
    // only "name" is required
    editors:  [
        { name: "Adam Barth", url: "mailto:w3c@adambarth.com",
          company: "Google, Inc.", companyURL: "http://www.google.com/" },
        { name: "Dan Veditz", url: "mailto:dveditz@mozilla.com",
          company: "Mozilla Corporation", companyURL: "http://www.mozilla.com/" },
        { name: "Mike West", url: "mailto:mkwst@google.com",
          company: "Google, Inc.", companyURL: "http://www.google.com/" },
    ],

    // name of the WG
    wg:           "Web Application Security Working Group",

    // URI of the public WG page
    wgURI:        "http://www.w3.org/2011/webappsec/",

    // name (with the @w3c.org) of the public mailing to which comments are due
    wgPublicList: "public-webappsec",

    // URI of the patent status for this WG, for Rec-track documents
    // !!!! IMPORTANT !!!!
    // This is important for Rec-track documents, do not copy a patent URI from a random
    // document unless you know what you're doing. If in doubt ask your friendly neighbourhood
    // Team Contact.
    wgPatentURI:  "http://www.w3.org/2004/01/pp-impl/49309/status",

    localBiblio: {
      "RFC3492": {
        title: "Punycode: A Bootstring encoding of Unicode for Internationalized Domain Names in Applications (IDNA)",
        href: "http://tools.ietf.org/html/rfc3492",
        authors: [
          "Adam M. Costello",
        ],
        status: "PROPOSED STANDARD",
        publisher: "IETF",
      },

      "RFC7034": {
        title: "HTTP Header Field X-Frame-Options",
        href: "http://tools.ietf.org/html/rfc7034",
        authors: [
          "David Ross",
          "Tobias Gondrom",
          "Thames Stanley"
        ],
        status: "INFORMATIONAL",
        publisher: "IETF",
      },
      "UIREDRESS": {
        title: "User Interface Security Directives for Content Security Policy",
        href: "https://dvcs.w3.org/hg/user-interface-safety/raw-file/tip/user-interface-safety.html",
        authors: [
          "Giorgio Maone",
          "David Lin-Shung Huang",
          "Tobias Gondrom",
          "Brad Hill"
        ],
        status: "Working Draft",
        publisher: "W3C",
      },
    },
};
