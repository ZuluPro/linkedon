VERSION := $(shell cat VERSION)

package:
	mkdir -p build/
	cd src && zip -r -FS ../build/$(VERSION).xpi * --exclude '*.swp'

clean:
	rm -f build/
