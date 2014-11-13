all: clean content-security-policy/index.html mixedcontent/index.html referrer-policy/index.html

clean:
	rm -rf ./content-security-policy/index.html
	rm -rf ./credentialmanagement/index.html
	rm -rf ./mixedcontent/index.html
	rm -rf ./referrer-policy/index.html

content-security-policy/index.html: content-security-policy/index.src.html
	bikeshed -q spec ./content-security-policy/index.src.html index.html

credentialmanagement/index.html: credentialmanagement/index.src.html
	bikeshed -q spec ./credentialmanagement/index.src.html index.html

mixedcontent/index.html: mixedcontent/index.src.html
	bikeshed -q spec ./mixedcontent/index.src.html index.html

referrer-policy/index.html: referrer-policy/index.src.html
	bikeshed -q spec ./referrer-policy/index.src.html index.html

publish: all
	git push origin master master:gh-pages
