# SPDX-License-Identifier: GPL-3.0-or-later

licenses-in := $(wildcard LICENSES/*)
licenses-y  := $(addprefix $(static-prefix)/,$(licenses-in))
licenses-prefix := $(static-prefix)/LICENSES

prefix-y += $(licenses-prefix)
onchange-in += LICENSES/*
deploy-ready-y += $(licenses-y)

$(licenses-y): $(static-prefix)/%: % | $(licenses-prefix)
	cp $< $@

distclean-y += distclean-licenses

.PHONY: distclean-licenses

distclean-licenses:
	rm -f $(licenses-y)
