all: clean index.html

clean:
	rm -rf index.html

index.html: spec.markdown template.erb
	kramdown --parse-block-html --template='template.erb' spec.markdown > index.html

publish: all
	git push origin master
	git push origin master:gh-pages
