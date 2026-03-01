# SPDX-License-Identifier: GPL-3.0-or-later

fonts-in  := $(shell find fonts -type f)
fonts-dir := $(sort $(dir $(fonts-in)))
fonts-y   := $(addprefix $(prefix)/,$(fonts-in))

fonts-prefix := $(addprefix $(prefix)/,$(fonts-dir))
static-fonts-prefix := $(addprefix $(static-prefix)/,$(fonts-dir))

prefix-y += $(fonts-prefix) $(static-fonts-prefix)
onchange-in += fonts/**/*
asmap-in += $(fonts-y)

$(fonts-y): $(prefix)/%: % | $(fonts-prefix) $(static-fonts-prefix)
	cp $< $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

fonts-asmap-y := $(prefix)/fonts_asmap.m4

$(fonts-asmap-y): $(fonts-y)
	find $(static-fonts-prefix) -maxdepth 1 -type f | \
	sed s,$(static-prefix),, | $(gen-asmap) s,^/fonts/,, FONTS >$@

clean-y += clean-fonts

.PHONY: clean-fonts

clean-fonts:
	rm -f $(fonts-y) $(fonts-asmap-y)
