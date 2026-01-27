# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,html,index.html,index.html))

onchange-in += $(html-glob)
build-static-y += $(html-y)

$(html-y): $(prefix)/%: $(asmap-y) $(image-asmap-y) $(html-in)
	$(m4) $^ >$@
	ln -f $@ $(static-prefix)/$*

clean-y += clean-html

.PHONY: clean-html

clean-html:
	rm -f $(html-y)
