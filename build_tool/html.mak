# SPDX-License-Identifier: GPL-3.0-or-later

onchange-in += $(html-glob)
build-static-y += $(html-y)

$(html-y): $(prefix)/%: $(asmap-y) $(html-m4-y)
	$(m4) $^ >$@
	ln -f $@ $(static-prefix)/$*

clean-y += clean-html

.PHONY: clean-html

clean-html:
	rm -f $(html-y)
