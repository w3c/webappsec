all: clean content-security-policy/index.html mixedcontent/index.html referrer-policy/index.html

clean:
	rm -rf ./content-security-policy/index.html
	rm -rf ./cowl/index.html
	rm -rf ./credentialmanagement/index.html
	rm -rf ./mixedcontent/index.html
	rm -rf ./referrer-policy/index.html

CLEAR: clear-site-data/index.html
CLEAR-FPWD: clear-site-data/published/2015-07-FPWD.html
CREDENTIAL: credentialmanagement/index.html
COWL: cowl/index.html
CREDENTIAL-FPWD: credentialmanagement/published/2015-04-FPWD.html
CSP-PINNING: csp-pinning/index.html
CSP-PINNING-FPWD: csp-pinning/published/2015-02-FPWD.html
CSP2: CSP2/index.html
CSP2-PR: CSP2/published/2015-08-PR.html
CSP3: content-security-policy/index.html
EPR: epr/index.html
MIX: mixedcontent/index.html
MIX-CR: mixedcontent/published/2015-08-CR.html
MIX-PR: mixedcontent/published/2015-07-PR.html
POWER: powerfulfeatures/index.html
POWER-WD: powerfulfeatures/published/WD.html
REFERRER: referrer-policy/index.html
UPGRADE: upgrade/index.html
UPGRADE-CR: upgrade/published/2015-09-CR.html

clear-site-data/index.html: clear-site-data/index.src.html biblio.json
	bikeshed -f spec ./clear-site-data/index.src.html

clear-site-data/published/2015-07-FPWD.html: clear-site-data/index.src.html biblio.json
	bikeshed -f spec --md-status=FPWD --md-date=2015-07-30 ./clear-site-data/index.src.html ./clear-site-data/published/2015-07-FPWD.html

csp-pinning/index.html: csp-pinning/index.src.html biblio.json
	bikeshed -f spec ./csp-pinning/index.src.html

csp-pinning/published/2015-02-FPWD.html: csp-pinning/index.src.html
	bikeshed -f spec --md-status=FPWD --md-date=2015-02-26 ./csp-pinning/index.src.html ./csp-pinning/published/2015-02-FPWD.html

CSP2/index.html: CSP2/index.src.html biblio.json
	bikeshed -f spec ./CSP2/index.src.html

CSP2/published/2015-08-PR.html: CSP2/index.src.html
	bikeshed -f spec --md-status=PR --md-date=2015-08-21 --md-deadline=2015-10-21 ./CSP2/index.src.html ./CSP2/published/2015-08-PR.html

content-security-policy/index.html: content-security-policy/index.src.html biblio.json
	bikeshed -f spec ./content-security-policy/index.src.html

cowl/index.html: cowl/index.src.html biblio.json
	bikeshed -f spec ./cowl/index.src.html

credentialmanagement/index.html: credentialmanagement/index.src.html biblio.json
	bikeshed -f spec ./credentialmanagement/index.src.html

credentialmanagement/published/2015-04-FPWD.html: credentialmanagement/index.src.html biblio.json
	bikeshed -f spec --md-status=FPWD --md-date=2015-04-28 ./credentialmanagement/index.src.html ./credentialmanagement/published/2015-04-FPWD.html

epr/index.html: epr/index.src.html biblio.json
	bikeshed -f spec ./epr/index.src.html

mixedcontent/index.html: mixedcontent/index.src.html biblio.json
	bikeshed -f spec ./mixedcontent/index.src.html

mixedcontent/published/2015-07-PR.html: mixedcontent/index.src.html
	bikeshed -f spec --md-status=PR --md-date=2015-07-01 --md-deadline=2015-08-01 ./mixedcontent/index.src.html ./mixedcontent/published/2015-07-PR.html

mixedcontent/published/2015-08-CR.html: mixedcontent/index.src.html
	bikeshed -f spec --md-status=CR --md-date=2015-08-04 --md-deadline=2015-09-04 ./mixedcontent/index.src.html ./mixedcontent/published/2015-08-CR.html

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

upgrade/published/2015-09-CR.html: upgrade/index.src.html
	bikeshed -f spec --md-status=CR --md-date=2015-09-03 --md-deadline=2015-10-03 ./upgrade/index.src.html ./upgrade/published/2015-09-CR.html

publish:
	git push origin master master:gh-pages
