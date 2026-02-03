# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,html,index.html,index.html))

$(html-m4-y): $(m4-prefix)/%: $(image-asmap-y) $(html-in) | $(m4-prefix)
	$(m4) $^ >$@

clean-y += clean-html-m4

.PHONY: clean-html-m4

clean-html-m4:
	rm -f $(html-m4-y)
