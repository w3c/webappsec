all: clean index.html

clean:
	rm -rf index.html

index.html: spec.markdown template.erb
	sed -e 's/\[\[/\\[\\[/g' -e 's/\]\]/\\]\\]/g' ./spec.markdown | kramdown --parse-block-html --template='template.erb' > index.html

publish: all
	git push origin master
	git push origin master:gh-pages
