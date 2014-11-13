all: spec/index.html usecases/index.html writeonly/index.html

clean:
	rm -rf ./spec/index.html
	rm -rf ./usecases/index.html
	rm -rf ./writeonly/index.html

spec/index.html: spec/index.src.html biblio.json
	bikeshed -q spec ./spec/index.src.html index.html

usecases/index.html: usecases/index.src.html biblio.json
	bikeshed -q spec ./usecases/index.src.html index.html

writeonly/index.html: writeonly/index.src.html biblio.json
	bikeshed -q spec ./writeonly/index.src.html index.html
