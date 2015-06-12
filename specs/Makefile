all: clean content-security-policy/index.html mixedcontent/index.html referrer-policy/index.html

clean:
	rm -rf ./content-security-policy/index.html
	rm -rf ./credentialmanagement/index.html
	rm -rf ./mixedcontent/index.html
	rm -rf ./referrer-policy/index.html

CLEAR: clear-site-data/index.html
CREDENTIAL: credentialmanagement/index.html
CREDENTIAL-FPWD: credentialmanagement/published/2015-04-FPWD.html
CSP-PINNING: csp-pinning/index.html
CSP-PINNING-FPWD: csp-pinning/published/2015-02-FPWD.html
CSP2: CSP2/index.html
CSP2-CR: CSP2/published/2015-02-CR.html
CSP3: content-security-policy/index.html
EPR: epr/index.html
MIX: mixedcontent/index.html
MIX-CR: mixedcontent/published/2015-02-CR.html
POWER: powerfulfeatures/index.html
POWER-WD: powerfulfeatures/published/WD.html
REFERRER: referrer-policy/index.html
UPGRADE: upgrade/index.html
UPGRADE-WD: upgrade/published/WD.html

clear-site-data/index.html: clear-site-data/index.src.html biblio.json
	bikeshed -f spec ./clear-site-data/index.src.html

csp-pinning/index.html: csp-pinning/index.src.html biblio.json
	bikeshed -f spec ./csp-pinning/index.src.html

csp-pinning/published/2015-02-FPWD.html: csp-pinning/index.src.html
	bikeshed -f spec --md-status=FPWD --md-date=2015-02-26 ./csp-pinning/index.src.html ./csp-pinning/published/2015-02-FPWD.html

CSP2/index.html: CSP2/index.src.html biblio.json
	bikeshed -f spec ./CSP2/index.src.html

CSP2/published/2015-02-CR.html: CSP2/index.src.html
	bikeshed -f spec --md-status=CR --md-deadline=2015-07-01 ./CSP2/index.src.html ./CSP2/published/2015-02-CR.html

content-security-policy/index.html: content-security-policy/index.src.html biblio.json
	bikeshed -f spec ./content-security-policy/index.src.html

credentialmanagement/index.html: credentialmanagement/index.src.html biblio.json
	bikeshed -f spec ./credentialmanagement/index.src.html

credentialmanagement/published/2015-04-FPWD.html: credentialmanagement/index.src.html biblio.json
	bikeshed -f spec --md-status=FPWD --md-date=2015-04-28 ./credentialmanagement/index.src.html ./credentialmanagement/published/2015-04-FPWD.html

epr/index.html: epr/index.src.html biblio.json
	bikeshed -f spec ./epr/index.src.html

mixedcontent/index.html: mixedcontent/index.src.html biblio.json
	bikeshed -f spec ./mixedcontent/index.src.html

mixedcontent/published/2015-02-CR.html: mixedcontent/index.src.html
	bikeshed -f spec --md-status=CR --md-date=2015-03-17 --md-deadline=2015-07-01 ./mixedcontent/index.src.html ./mixedcontent/published/2015-02-CR.html

referrer-policy/index.html: referrer-policy/index.src.html biblio.json
	bikeshed -f spec ./referrer-policy/index.src.html

powerfulfeatures/index.html: powerfulfeatures/index.src.html biblio.json
	bikeshed -f spec ./powerfulfeatures/index.src.html

powerfulfeatures/published/WD.html: powerfulfeatures/index.src.html biblio.json
	bikeshed -f spec --md-status=WD ./powerfulfeatures/index.src.html ./powerfulfeatures/published/WD.html

upgrade/index.html: upgrade/index.src.html biblio.json
	bikeshed -f spec ./upgrade/index.src.html

upgrade/published/WD.html: upgrade/index.src.html
	bikeshed -f spec --md-status=WD ./upgrade/index.src.html ./upgrade/published/WD.html

publish:
	git push origin master master:gh-pages
