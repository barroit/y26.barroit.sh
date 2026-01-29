# SPDX-License-Identifier: GPL-3.0-or-later

m4 ?= m4
m4 := printf 'changequote([[, ]])' | $(m4) -
m4 += -DRETURN_JSX_BEGIN='return (' -DRETURN_JSX_END=')' -Uformat

esbuild ?= esbuild
esbuild += --bundle --format=esm
esbuild-css := $(esbuild) --external:/fonts/* --minify

terser ?= terser
terser += --module --ecma 2020 --mangle --comments false \
	  --compress 'passes=3,pure_getters=true,unsafe=true'

tailwindcss ?= tailwindcss
tailwindcss += --optimize

onchange ?= onchange
browser-sync ?= browser-sync
concurrently ?= concurrently
wrangler ?= wrangler

ln-unique := ./scripts/ln-unique.sh
gen-asmap := ./scripts/gen-asmap.sh

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
build-static-y :=

prefix-y := $(prefix)/m4 $(prefix)/static
static-prefix-y :=

.PHONY: build-static

build-static:

include build_tool/image.mak

include build_tool/fonts.mak

include build_tool/page.mak

include build_tool/worker.mak

include build_tool/css.mak

include build_tool/html.mak

include build_tool/rule.mak

$(prefix):
	mkdir $@

$(prefix-y): | $(prefix)
	mkdir $@

$(static-prefix-y): | $(static-prefix)
	mkdir $@

terser-y := $(addsuffix 1-terser,$(terser-in))

$(terser-y): %1-terser: %1
	$(terser) <$< >$@

$(asmap-y): $(asmap-in)
	$(gen-asmap) $@ $(static-prefix) $(static-prefix)

build-static: $(build-static-y)

.PHONY: clean

clean: $(clean-y)
	rm -f $(asmap-y)
	test -d $(static-prefix) && \
	find $(static-prefix) -type f -exec rm {} + || true

.PHONY: hot-build-static host-build hot-dev

hot-build-static: build-static
	$(onchange) $(patsubst %,'%',$(onchange-in)) -- $(MAKE) -j build-static

host-build:
	cd $(static-prefix) && \
	$(browser-sync) start --server --no-open --files '**/*'

hot-dev:
	$(concurrently) '$(MAKE) hot-build-static' '$(MAKE) host-build'

.PHONY: preview

preview:
	$(wrangler) dev --no-bundle
