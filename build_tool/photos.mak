# SPDX-License-Identifier: GPL-3.0-or-later

photos-dir := $(shell find photos -mindepth 1 -type d)

photos-prefix        := $(addprefix $(prefix)/,$(photos-dir))
static-photos-prefix := $(addprefix $(static-prefix)/,photos)

prefix-y += $(photos-prefix) $(static-photos-prefix)
onchange-in += photos/**/*

photos-glob := $(addsuffix /*,$(photos-dir))
photos-in   := $(wildcard $(photos-glob))

photos-y-in   := $(addprefix $(prefix)/,$(photos-in))
photos-avif-y := $(patsubst %.jpeg,%.avif,$(filter %.jpeg,$(photos-y-in)))
photos-webm-y := $(patsubst %.mov,%.webm,$(filter %.mov,$(photos-y-in)))

photos-avif-thumb-y := $(patsubst %.avif,%_thumbnail.avif,$(photos-avif-y))
photos-webm-thumb-y := $(patsubst %.webm,%_thumbnail.avif,$(photos-webm-y))

photos-readme-in := photos/README
photos-readme-y  := $(prefix)/$(photos-readme-in)

deploy-photo = ln -f $@ $(@D)_$(@F) && \
	       $(ln-unique) $(@D)_$(@F) $(static-photos-prefix)

$(photos-readme-y): $(prefix)/%: % | $(photos-prefix) $(static-photos-prefix)
	ln -f $< $@
	ln -f $@ $(subst $(prefix),$(static-prefix),$(@D))

$(photos-avif-y): $(prefix)/%.avif: \
		  %.jpeg | $(photos-prefix) $(static-photos-prefix)
	$(magick) $< -auto-orient -strip -quality 60 $@
	$(deploy-photo)

$(photos-avif-thumb-y): $(prefix)/%_thumbnail.avif: \
			%.jpeg | $(photos-prefix) $(static-photos-prefix)
	$(magick) $< -auto-orient -strip -resize 390x -quality 39 $@
	$(deploy-photo)

$(photos-webm-y): $(prefix)/%.webm: \
		  %.mov | $(photos-prefix) $(static-photos-prefix)
	$(ffmpeg) -i $< -c:v av1_nvenc -preset p7 -cq 30 -b:v 0 -c:a libopus $@
	$(deploy-photo)

$(photos-webm-thumb-y): $(prefix)/%_thumbnail.avif: \
			%.mov | $(photos-prefix) $(static-photos-prefix)
	$(magick) $<[0] -auto-orient -strip -resize 390x -quality 39 $@
	$(deploy-photo)

photos-asmap-y := $(prefix)/photos_asmap.m4

$(photos-asmap-y): $(photos-avif-y) $(photos-avif-thumb-y) \
		   $(photos-webm-y) $(photos-webm-thumb-y) $(photos-readme-y)
	$(gen-asmap) $@ $(static-prefix) $(static-photos-prefix)

photos-map-y := $(prefix)/photos.js

$(photos-map-y): $(photos-asmap-y)
	trap 'rm -f $(prefix)/.tmp-$$$$' EXIT && \
	printf 'dumpdef\n' >$(prefix)/.tmp-$$$$ && \
	$(m4) $< $(prefix)/.tmp-$$$$ 2>&1 | \
	grep ^AS_ | $(map-asmap) photos_map >$@

clean-y += clean-photos

.PHONY: clean-photos

clean-photos:
	test -d $(prefix)/photos && find $(prefix)/photos -type f -exec rm {} +
	rm -f $(photos-readme-y) $(photos-asmap-y)
