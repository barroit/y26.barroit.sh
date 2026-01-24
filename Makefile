# SPDX-License-Identifier: GPL-3.0-or-later

m4 ?= m4
m4 := printf 'changequote(`[\043\047, `\043]\047)' | $(m4) -
m4 += -DJSX_BEGIN='return (' -DJSX_END=')'

esbuild ?= esbuild
esbuild += --bundle --format=esm \
	   --jsx-factory=init_tag --jsx-fragment='"fragment"'
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
image-prefix := $(prefix)/image
fonts-prefix := $(prefix)/fonts
static-image-prefix := $(static-prefix)/image
static-fonts-prefix := $(static-prefix)/fonts

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
onchange-in :=

bundle-y :=

.PHONY: build-static

build-static:

$(prefix):
	mkdir $@

$(m4-prefix) $(static-prefix) $(image-prefix) $(fonts-prefix): | $(prefix)
	mkdir $@

$(static-image-prefix) $(static-fonts-prefix): | $(static-prefix)
	mkdir $@

fonts-in := $(filter-out fonts/README,$(wildcard fonts/*))
fonts-y  := $(addprefix $(prefix)/,$(fonts-in))

onchange-in += fonts/*

$(fonts-y): $(prefix)/%: % | $(fonts-prefix) $(static-fonts-prefix)
	ln -f $< $@
	$(ln-unique) $@ $(static-fonts-prefix)

fonts-asmap-y := $(prefix)/fonts_asmap.m4

$(fonts-asmap-y): $(fonts-y)
	$(gen-asmap) $(static-fonts-prefix) /fonts/ $@

image-in := $(filter-out image/README,$(wildcard image/*))
image-y  := $(addprefix $(prefix)/,$(image-in))

onchange-in += image/*

$(image-y): $(prefix)/%: % | $(image-prefix) $(static-image-prefix)
	ln -f $< $@
	$(ln-unique) $@ $(static-image-prefix)

image-asmap-y := $(prefix)/image_asmap.m4

$(image-asmap-y): $(image-y)
	$(gen-asmap) $(static-image-prefix) /image/ $@

$(eval $(call def-target,page,index.jsx,index.js,page/*.jsx page/*.js))

asmap-in += $(page-y)
terser-in += $(page-y)
onchange-in += $(page-glob)

$(page-m4-y): $(m4-prefix)/%: $(image-asmap-y) %
	mkdir -p $(@D)
	$(m4) $^ >$@

$(page-y)1: $(page-m4-y) | $(prefix)
	$(esbuild) --sourcemap=inline --outfile=$@ $<

$(page-y): %: %1$(minimize) | $(static-prefix)
	ln -f $< $@
	$(ln-unique) $@ $(static-prefix)

$(eval $(call def-target,worker,worker.js,worker.js,worker/*.js))

terser-in += $(worker-y)
onchange-in += $(worker-glob)

$(worker-y)1: $(worker-in) | $(prefix)
	$(esbuild) --sourcemap=inline --outfile=$@ $<

$(worker-y): %: %1$(minimize)
	ln -f $< $@

terser-y := $(addsuffix 1-terser,$(terser-in))

$(terser-y): %1-terser: %1
	$(terser) <$< >$@

css-in := index.html index.jsx page/*.jsx styles/*.css
$(eval $(call def-target,css,index.css,index.css,$(css-in)))
css-m4-y := $(m4-prefix)/index.css

asmap-in += $(css-y)

$(css-y)1: $(css-in) | $(prefix)
	$(tailwindcss) --cwd . --input $< >$@

$(css-m4-y): $(m4-prefix)/%: $(fonts-asmap-y) $(prefix)/%1
	mkdir -p $(@D)
	$(m4) $^ >$@

$(css-y): $(css-m4-y) | $(static-prefix)
	$(esbuild-css) $< --outfile=$@
	$(ln-unique) $@ $(static-prefix)

asmap-y := $(prefix)/asmap.m4

$(asmap-y): $(asmap-in)
	$(gen-asmap) $(static-prefix) / $@

$(eval $(call def-target,html,index.html,index.html))

onchange-in += $(html-glob)

$(html-y): $(prefix)/%: $(asmap-y) $(image-asmap-y) $(html-in)
	$(m4) $^ >$@
	ln -f $@ $(static-prefix)/$*

headers-in := _headers
headers-y  := $(static-prefix)/$(headers-in)

$(headers-y): $(headers-in)
	cp $< $@

build-static: $(page-y) $(css-y) $(html-y) $(worker-y) $(headers-y)

.PHONY: clean

clean:
	rm -f $(page-m4-y)
	rm -f $(page-y)* $(worker-y)*
	rm -f $(asmap-y) $(image-asmap-y) $(fonts-asmap-y) $(html-y)
	rm -f $(css-y)*
	rm -f $(image-y) $(fonts-y)

	test -d $(static-prefix) && \
	find $(static-prefix) -type f -exec rm {} + || true

.PHONY: hot-build-static host-build hot-dev

hot-build-static: build-static
	$(onchange) $(onchange-in) -- $(MAKE) -j build-static

host-build:
	cd $(static-prefix) && \
	$(browser-sync) start --server --no-open --files '**/*'

hot-dev:
	$(concurrently) '$(MAKE) hot-build-static' '$(MAKE) host-build'

.PHONY: preview

preview:
	$(wrangler) dev --no-bundle
