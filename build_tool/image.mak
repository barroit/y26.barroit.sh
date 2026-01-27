# SPDX-License-Identifier: GPL-3.0-or-later

image-dir           := $(shell find image -type d)
image-prefix        := $(addprefix $(prefix)/,$(image-dir))
static-image-prefix := $(addprefix $(static-prefix)/,$(image-dir))

prefix-y += $(image-prefix)
static-prefix-y += $(static-image-prefix)

image-glob     := $(addsuffix /*,$(image-dir))
image-in-dirty := $(shell find $(image-dir) -maxdepth 1 -type f)

image-in := $(filter-out %/README,$(image-in-dirty))
image-y  := $(addprefix $(prefix)/,$(image-in))

image-readme-in := $(filter %/README,$(image-in-dirty))
image-readme-y  := $(addprefix $(prefix)/,$(image-readme-in))

asmap-in += $(image-y)
onchange-in += $(image-glob)

$(image-readme-y): $(prefix)/%: % | $(image-prefix) $(static-image-prefix)
	ln -f $< $@
	ln -f $@ $(subst $(prefix),$(static-prefix),$(@D))

$(image-y): $(prefix)/%: % | $(image-prefix) $(static-image-prefix)
	ln -f $< $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

image-asmap-y := $(prefix)/image_asmap.m4

$(image-asmap-y): $(image-y) $(image-readme-y)
	$(gen-asmap) $@ $(static-prefix) $(static-image-prefix)

clean-y += clean-image

.PHONY: clean-image

clean-image:
	rm -f $(image-y) $(image-readme-y) $(image-asmap-y)
