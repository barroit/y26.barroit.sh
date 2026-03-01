# SPDX-License-Identifier: GPL-3.0-or-later

images-in  := $(shell find image -type f)
images-dir := $(sort $(dir $(images-in)))
images-y   := $(addprefix $(prefix)/,$(images-in))

images-prefix := $(addprefix $(prefix)/,$(images-dir))
static-images-prefix := $(addprefix $(static-prefix)/,$(images-dir))

prefix-y += $(images-prefix) $(static-images-prefix)
onchange-in += image/**/*
asmap-in += $(images-y)

$(images-y): $(prefix)/%: % | $(images-prefix) $(static-images-prefix)
	cp $< $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

images-asmap-y := $(prefix)/image_asmap.m4

$(images-asmap-y): $(images-y)
	find $(static-images-prefix) -maxdepth 1 -type f | \
	sed s,$(static-prefix),, | $(gen-asmap) s,^/image/,, IMAGES >$@

clean-y += clean-images

.PHONY: clean-images

clean-images:
	rm -f $(images-y) $(images-asmap-y)
