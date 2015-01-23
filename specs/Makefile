all: clean content-security-policy/index.html mixedcontent/index.html referrer-policy/index.html

clean:
	rm -rf ./content-security-policy/index.html
	rm -rf ./credentialmanagement/index.html
	rm -rf ./mixedcontent/index.html
	rm -rf ./referrer-policy/index.html

CSP-PINNING: csp-pinning/index.html
CSP3: content-security-policy/index.html
CSP2: CSP2/index.html
CREDENTIAL: credentialmanagement/index.html
MIX: mixedcontent/index.html

csp-pinning/index.html: csp-pinning/index.src.html biblio.json
	bikeshed -f spec ./csp-pinning/index.src.html

CSP2/index.html: CSP2/index.src.html biblio.json
	bikeshed -f spec ./CSP2/index.src.html

content-security-policy/index.html: content-security-policy/index.src.html biblio.json
	bikeshed -f spec ./content-security-policy/index.src.html

credentialmanagement/index.html: credentialmanagement/index.src.html biblio.json
	bikeshed -f spec ./credentialmanagement/index.src.html

mixedcontent/index.html: mixedcontent/index.src.html biblio.json
	bikeshed -f spec ./mixedcontent/index.src.html

referrer-policy/index.html: referrer-policy/index.src.html biblio.json
	bikeshed -q spec ./referrer-policy/index.src.html index.html

powerfulfeatures/index.html: powerfulfeatures/index.src.html biblio.json
	bikeshed -q spec ./powerfulfeatures/index.src.html index.html

publish: all
	git push origin master master:gh-pages
