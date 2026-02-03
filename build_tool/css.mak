# SPDX-License-Identifier: GPL-3.0-or-later

css-in := index.html index.jsx page/*.jsx styles/*.css
$(eval $(call def-target,css,$(realpath index.css),index.css,$(css-in)))
css-m4-y := $(m4-prefix)/index.css

asmap-in += $(css-y)
build-static-y += $(css-y)
onchange-in += index.css styles/*.css

$(css-y)1: $(css-in) $(page-m4-y) $(html-m4-y) | $(prefix)
	$(tailwindcss) --cwd $(m4-prefix) --input $< >$@

$(css-m4-y): $(m4-prefix)/%: $(fonts-asmap-y) $(image-asmap-y) $(prefix)/%1
	mkdir -p $(@D)
	$(m4) $^ >$@

$(css-y): $(css-m4-y) | $(static-prefix)
	$(esbuild) --external:/fonts/* --external:/image/* \
		   --minify $< --outfile=$@
	$(ln-unique) $@ $(static-prefix)

clean-y += clean-css

.PHONY: clean-css

clean-css:
	rm -f $(css-m4-y)
	rm -f $(css-y)*
