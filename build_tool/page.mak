# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,page,index.jsx,index.js,page/*.jsx))

asmap-in += $(page-y)
terser-in += $(page-y)
onchange-in += $(page-glob)
build-static-y += $(page-y)

$(page-m4-y): $(m4-prefix)/%: % $(image-asmap-y) $(lib-m4-y)
	mkdir -p $(@D)
	$(m4) $(image-asmap-y) $< >$@

$(page-y)1: $(page-m4-y) | $(prefix)
	$(esbuild) --jsx-import-source=preact --jsx=automatic \
		   --sourcemap=inline --outfile=$@ $<

$(page-y): %: %1$(minimize) | $(static-prefix)
	ln -f $< $@
	$(ln-unique) $@ $(static-prefix)

clean-y += clean-page

.PHONY: clean-page

clean-page:
	rm -f $(page-m4-y)
	rm -f $(page-y)*
