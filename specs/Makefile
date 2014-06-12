all: clean content-security-policy/index.html mixedcontent/index.html referrer-policy/index.html

clean:
	rm -rf ./content-security-policy/index.html
	rm -rf ./mixedcontent/index.html
	rm -rf ./referrer-policy/index.html

content-security-policy/index.html: content-security-policy/index.src.html
	bikeshed -q spec ./content-security-policy/index.src.html ./content-security-policy/index.html

mixedcontent/index.html: mixedcontent/index.src.html
	bikeshed -q spec ./mixedcontent/index.src.html ./mixedcontent/index.html

referrer-policy/index.html: referrer-policy/index.src.html
	bikeshed -q spec ./referrer-policy/index.src.html ./referrer-policy/index.html

publish: all
	git push origin master master:gh-pages
