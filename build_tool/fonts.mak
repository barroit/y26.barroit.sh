# SPDX-License-Identifier: GPL-3.0-or-later

fonts-dir           := $(shell find fonts -type d)
fonts-prefix        := $(addprefix $(prefix)/,$(fonts-dir))
static-fonts-prefix := $(addprefix $(static-prefix)/,$(fonts-dir))

prefix-y += $(fonts-prefix)
static-prefix-y += $(static-fonts-prefix)

fonts-glob     := $(addsuffix /*,$(fonts-dir))
fonts-in-dirty := $(shell find $(fonts-dir) -maxdepth 1 -type f)

fonts-in := $(filter-out %/README,$(fonts-in-dirty))
fonts-y  := $(addprefix $(prefix)/,$(fonts-in))

fonts-readme-in := $(filter %/README,$(fonts-in-dirty))
fonts-readme-y  := $(addprefix $(prefix)/,$(fonts-readme-in))

asmap-in += $(fonts-y)
onchange-in += $(fonts-glob)

$(fonts-readme-y): $(prefix)/%: % | $(fonts-prefix) $(static-fonts-prefix)
	ln -f $< $@
	ln $@ $(subst $(prefix),$(static-prefix),$(@D))

$(fonts-y): $(prefix)/%: % | $(fonts-prefix) $(static-fonts-prefix)
	ln -f $< $@
	$(ln-unique) $@ $(subst $(prefix),$(static-prefix),$(@D))

fonts-asmap-y := $(prefix)/fonts_asmap.m4

$(fonts-asmap-y): $(fonts-y) $(fonts-readme-y)
	$(gen-asmap) $@ $(static-prefix) $(static-fonts-prefix)

clean-y += clean-fonts

.PHONY: clean-fonts

clean-fonts:
	rm -f $(fonts-y) $(fonts-readme-y) $(fonts-asmap-y)
