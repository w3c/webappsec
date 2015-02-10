all: clean content-security-policy/index.html mixedcontent/index.html referrer-policy/index.html

clean:
	rm -rf ./content-security-policy/index.html
	rm -rf ./credentialmanagement/index.html
	rm -rf ./mixedcontent/index.html
	rm -rf ./referrer-policy/index.html

CREDENTIAL: credentialmanagement/index.html
CSP-PINNING: csp-pinning/index.html
CSP-PINNING-FPWD: csp-pinning/published/2015-02-FPWD.html
CSP2: CSP2/index.html CSP2/published/2015-02-CR.html
CSP3: content-security-policy/index.html
MIX: mixedcontent/index.html
POWER: powerfulfeatures/index.html
REFERRER: referrer-policy/index.html
UPGRADE: upgrade/index.html

csp-pinning/index.html: csp-pinning/index.src.html biblio.json
	bikeshed -f spec ./csp-pinning/index.src.html

csp-pinning/published/2015-02-FPWD.html: csp-pinning/index.src.html
	bikeshed -f spec --md-status=FPWD ./csp-pinning/index.src.html ./csp-pinning/published/2015-02-FPWD.html

CSP2/index.html: CSP2/index.src.html biblio.json
	bikeshed -f spec ./CSP2/index.src.html

CSP2/published/2015-02-CR.html: CSP2/index.src.html
	bikeshed -f spec --md-status=CR --md-deadline=2015-05-01 ./CSP2/index.src.html ./CSP2/published/2015-02-CR.html

content-security-policy/index.html: content-security-policy/index.src.html biblio.json
	bikeshed -f spec ./content-security-policy/index.src.html

credentialmanagement/index.html: credentialmanagement/index.src.html biblio.json
	bikeshed -f spec ./credentialmanagement/index.src.html

mixedcontent/index.html: mixedcontent/index.src.html biblio.json
	bikeshed -f spec ./mixedcontent/index.src.html

referrer-policy/index.html: referrer-policy/index.src.html biblio.json
	bikeshed -f spec ./referrer-policy/index.src.html

powerfulfeatures/index.html: powerfulfeatures/index.src.html biblio.json
	bikeshed -f spec ./powerfulfeatures/index.src.html

upgrade/index.html: upgrade/index.src.html biblio.json
	bikeshed -f spec ./upgrade/index.src.html

publish: all
	git push origin master master:gh-pages
