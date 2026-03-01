# SPDX-License-Identifier: GPL-3.0-or-later

m4 ?= m4
m4 := printf 'changequote([[, ]])' | $(m4) - -Uformat

esbuild ?= esbuild
esbuild += --bundle --format=esm

terser ?= terser
terser += --module --ecma 2020 --mangle --comments false \
	  --compress 'passes=3,pure_getters=true,unsafe=true'

tailwindcss ?= tailwindcss
tailwindcss += --optimize

magick ?= magick

ffmpeg ?= ffmpeg
ffmpeg += -v error

onchange ?= onchange
browser-sync ?= browser-sync
concurrently ?= concurrently
wrangler ?= wrangler

gen-asmap    := ./scripts/gen-asmap.sh
lan-ip       := ./scripts/lan-ip.py
ln-unique    := ./scripts/ln-unique.sh
map-photos   := ./scripts/map-photos.py
parse-resume := ./scripts/parse-resume.py

prefix := build
m4-prefix := $(prefix)/m4
static-prefix := $(prefix)/static

define def-target
	$1-glob := $2 $4
	$1-in   := $$(wildcard $$($1-glob))
	$1-m4-y := $$(addprefix $$(m4-prefix)/,$$($1-in))
	$1-y    := $$(prefix)/$3
endef

ifneq ($(minimize),)
	minimize := -terser
endif

asmap-in :=
asmap-y  := $(prefix)/asmap.m4

onchange-in :=

bundle-y :=
clean-y :=
deploy-ready-y :=

prefix-y := $(m4-prefix) $(static-prefix)

.PHONY: deploy-ready

deploy-ready:

include build_tool/photos.mak

include build_tool/images.mak

include build_tool/fonts.mak

include build_tool/lib.mak

include build_tool/page.mak

include build_tool/worker.mak

include build_tool/html_m4.mak

include build_tool/css.mak

include build_tool/html.mak

include build_tool/rule.mak

$(prefix-y):
	mkdir -p $@

terser-y := $(addsuffix 1-terser,$(terser-in))

$(terser-y): %1-terser: %1
	$(terser) <$< >$@

$(asmap-y): $(asmap-in)
	ls $(static-prefix)/index-* | grep -E '\.(css|js)$$' | \
	sed s,$(static-prefix),, | $(gen-asmap) s,/,, AS >$@

deploy-ready: $(deploy-ready-y)

.PHONY: clean distclean

clean: $(clean-y)
	rm -f $(asmap-y)
	test -d $(static-prefix) && \
	find $(static-prefix) -type f -exec rm {} + || true

distclean: clean
	test -d node_modules && find node_modules -exec rm -rf {} + || true
	test -d .wrangler && find .wrangler -exec rm -rf {} + || true
	test -d build && find build -exec rm -rf {} + || true

.PHONY: hot-build host hot-dev

hot-build: deploy-ready
	$(onchange) $(patsubst %,'%',$(onchange-in)) -- $(MAKE) deploy-ready

host:
	cd $(static-prefix) && \
	$(wrangler) dev --live-reload --ip=$(shell $(lan-ip))

hot-dev: deploy-ready
	$(concurrently) '$(MAKE) hot-build' '$(MAKE) host'
