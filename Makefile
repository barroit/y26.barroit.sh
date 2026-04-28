# SPDX-License-Identifier: GPL-3.0-or-later

m4 ?= m4
m4 := printf 'changequote([[, ]])' | $(m4) $${DEV:+-DDEV} -Uformat -

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
concurrently ?= concurrently
wrangler ?= wrangler
caddy ?= caddy

lan-ip       := ./scripts/lan-ip.py
ln-unique    := ./scripts/ln-unique.sh
map-asset    := ./scripts/map-asset.sh
map-license  := ./scripts/map-license.sh
map-notice   := ./scripts/map-notice.sh

objtree := build
static := $(objtree)/static

ifneq ($(MINIMIZE),)
	MINIMIZE := -min
endif

clean :=
distclean :=

onchange-src :=
deploy-ready :=

.PHONY: deploy-ready

deploy-ready:

include scripts/Makefile.media

include scripts/Makefile.images

include scripts/Makefile.fonts

include scripts/Makefile.notice

include scripts/Makefile.license

include scripts/Makefile.lib

include scripts/Makefile.page

include scripts/Makefile.script

include scripts/Makefile.style

include scripts/Makefile.asset

include scripts/Makefile.html

include scripts/Makefile.headers

include scripts/Makefile.worker

$(static)/%.stamp: %
	mkdir -p $(@D)
	$(ln-unique) $< $(@D)
	touch $@

%_asmap.m4: %_asmap.sed
	printf '%s\n' \
	       $(addsuffix -*,$(basename $(basename $(filter-out $<,$^)))) | \
	sed s,$(static),, | sort | uniq | $(map-asset) $$(cat $<) >$@

$(objtree)/m4/%: %
	mkdir -p $(@D)
	$(m4) $(filter-out $<,$^) $< >$@

deploy-ready: $(deploy-ready)

.PHONY: clean distclean

clean:
	find build -type f \
	     ! \( -name '*.avif*' -o -name '*.mp4*' -o -name '*.webm*' \) \
	     -exec rm {} +

distclean:
	rm -f build

.PHONY: hot-build hot-proxy hot-host hot-dev host deploy

hot-build: deploy-ready
	$(onchange) $(patsubst %,'%',$(onchange-src)) -- $(MAKE) deploy-ready

hot-host:
	$(wrangler) dev --live-reload --ip=127.0.0.1 --port=3901

hot-proxy:
	$(caddy) reverse-proxy --from http://$$($(lan-ip)):3939 \
			       --to 127.0.0.1:3901 \
			       --header-up "Host: 127.0.0.1:3901" \
			       --header-up "Origin: http://127.0.0.1:3901"

hot-dev: deploy-ready
	$(concurrently) '$(MAKE) hot-build' \
			'$(MAKE) hot-host' '$(MAKE) hot-proxy'

host:
	$(wrangler) dev --ip=$$($(lan-ip)) --port=3939

$(static)/.assetsignore:
	mkdir -p $(@D)
	printf '%s\n' '*.stamp' >$@

deploy: deploy-ready $(static)/.assetsignore
	$(wrangler) deploy
	$(wrangler) secret bulk .dev.vars
