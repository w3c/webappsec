all: clean spec/index.html usecases/index.html

clean:
	rm -rf ./spec/index.html
	rm -rf ./usecases/index.html

spec/index.html: spec/index.src.html biblio.json
	bikeshed -q spec ./spec/index.src.html ./spec/index.html

usecases/index.html: usecases/index.src.html biblio.json
	bikeshed -q spec ./usecases/index.src.html ./usecases/index.html
