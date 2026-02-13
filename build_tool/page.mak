# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,page,index.jsx,index.js,page/*.jsx))

resume-in := page/resume
resume-y  := $(prefix)/resume.m4

asmap-in += $(page-y)
terser-in += $(page-y)
onchange-in += $(page-glob) $(resume-in)
build-static-y += $(page-y)

$(resume-y): $(resume-in)
	$(parse-resume) <$< >$@

$(page-m4-y): $(m4-prefix)/%: % $(image-asmap-y) $(lib-m4-y) \
			      $(jsx-helper-y) $(resume-y)
	mkdir -p $(@D)
	$(m4) $(image-asmap-y) $(jsx-helper-y) $< >$@

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
