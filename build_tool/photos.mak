# SPDX-License-Identifier: GPL-3.0-or-later

photos-in  := $(shell find photos -type f)
photos-dir := $(sort $(dir $(photos-in)))
photos-y   := $(addprefix $(prefix)/,$(photos-in))

photos-prefix := $(addprefix $(prefix)/,$(photos-dir))
static-photos-prefix := $(addprefix $(static-prefix)/,$(photos-dir))

prefix-y += $(photos-prefix) $(static-photos-prefix)
onchange-in += photos/**/*

photos-avif-y := $(patsubst %.jpeg,%.avif,$(filter %.jpeg,$(photos-y)))
photos-avif-thumb-y := $(patsubst %.avif,%_xthumb.avif,$(photos-avif-y))

photos-webm-y := $(patsubst %.mov,%.webm,$(filter %.mov,$(photos-y)))
photos-webm-fb-y := $(patsubst %.webm,%.mp4,$(photos-webm-y))
photos-webm-thumb-y := $(patsubst %.webm,%_xthumb.avif,$(photos-webm-y))

photos-misc-y := $(filter-out %.mov %.jpeg %.bak,$(photos-y))

$(photos-avif-y): $(prefix)/%.avif: %.jpeg | \
		  $(photos-prefix) $(static-photos-prefix)
	$(magick) $< -auto-orient -strip -quality 60 $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

$(photos-avif-thumb-y): $(prefix)/%_xthumb.avif: %.jpeg | \
			$(photos-prefix) $(static-photos-prefix)
	$(magick) $< -auto-orient -strip -resize 390x -quality 39 $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

$(photos-webm-y): $(prefix)/%.webm: %.mov | \
		  $(photos-prefix) $(static-photos-prefix)
	$(ffmpeg) -y -i $< -c:v av1_nvenc \
		  -preset p7 -cq 30 -b:v 0 -c:a libopus $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

$(photos-webm-fb-y): $(prefix)/%.mp4: %.mov $(prefix)/%.webm | \
		     $(photos-prefix) $(static-photos-prefix)
	$(ffmpeg) -y -i $< -c:v hevc_nvenc -preset p7 -cq 28 \
		  -pix_fmt p010le -profile:v main10 -tag:v hvc1 \
		  -c:a aac -b:a 192k -movflags +faststart $@
	rm -f $(subst $(prefix),$(static-prefix),$(basename $@))-*.mp4
	ln $@ $$(printf $(subst $(prefix), \
				$(static-prefix),$(basename $@))-*.webm | \
		 sed s/webm$$/mp4/)

$(photos-webm-thumb-y): $(prefix)/%_xthumb.avif: %.mov | \
			$(photos-prefix) $(static-photos-prefix)
	$(magick) $<[0] -auto-orient -strip -resize 390x -quality 39 $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

$(photos-misc-y): $(prefix)/%: % | $(photos-prefix) $(static-photos-prefix)
	cp $< $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

photos-asmap-y := $(prefix)/photos_asmap.m4

$(photos-asmap-y): $(photos-avif-y) $(photos-avif-thumb-y) \
		   $(photos-webm-y) $(photos-webm-thumb-y) \
		   $(photos-webm-fb-y) $(photos-misc-y)
	find $(static-photos-prefix) -maxdepth 1 -type f ! -name '*.mp4' | \
	sed s,$(static-prefix),, | $(gen-asmap) s,^/photos/,, PHOTOS >$@

clean-y += clean-photos
distclean-y += distclean-photos

.PHONY: clean-photos distclean-photos

clean-photos:
	rm -f $(photos-asmap-y)

distclean-photos: clean-photos
	find $(photos-prefix) $(static-photos-prefix) \
	     -exec rm {} + 2>/dev/null || true
