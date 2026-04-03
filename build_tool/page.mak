# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,page,index.jsx,index.js,page/*.jsx))

page-generic-filter-out := %/gallery.jsx %/log.jsx %/credit.jsx
page-generic-m4-y := $(filter-out $(page-generic-filter-out),$(page-m4-y))

page-photos-m4-y  := $(filter %/gallery.jsx, $(page-m4-y))
page-resume-m4-y  := $(filter %/log.jsx, $(page-m4-y))
page-credit-m4-y  := $(filter %/credit.jsx, $(page-m4-y))

page-m4-prefix := $(m4-prefix)/page

resume-in := page/resume
resume-y  := $(prefix)/resume.js

photos-map-y := $(prefix)/photos.js

prefix-y += $(page-m4-prefix)
terser-in += $(page-y)
onchange-in += $(page-glob) $(resume-in)

$(resume-y): $(resume-in)
	$(parse-resume) <$< >$@

$(photos-map-y): $(photos-asmap-y)
	trap 'rm -f $(prefix)/.tmp-$$$$' EXIT && \
	printf 'dumpdef\n' >$(prefix)/.tmp-$$$$ && \
	$(m4) $< $(prefix)/.tmp-$$$$ 2>&1 | grep ^PHOTOS_ | \
	sort -t_ -k2,2 -k3,3n -k4,4 | $(map-photos) photos_map >$@

$(page-resume-m4-y): $(m4-prefix)/%: % $(images-asmap-y) $(jsx-helper-y) \
				     $(lib-m4-y) $(resume-y) | $(page-m4-prefix)
	$(m4) $(resume-y) $(images-asmap-y) $(jsx-helper-y) $< >$@

$(page-photos-m4-y): $(m4-prefix)/%: % $(photos-asmap-y) $(images-asmap-y) \
				     $(lib-m4-y) $(jsx-helper-y) \
				     $(photos-map-y) | $(page-m4-prefix)
	$(m4) $(photos-asmap-y) $(images-asmap-y) \
	      $(jsx-helper-y) $(photos-map-y) $< >$@

$(page-credit-m4-y): $(m4-prefix)/%: % $(fonts-asmap-y) $(images-asmap-y) \
				     $(photos-asmap-y) $(jsx-helper-y) \
				     $(notice-map-y) $(license-map-y) \
				     $(lib-m4-y) | $(page-m4-prefix)
	$(m4) $(fonts-asmap-y) $(images-asmap-y) \
	      $(photos-asmap-y) $(jsx-helper-y) \
	      $(notice-map-y) $(license-map-y) $< >$@

$(page-generic-m4-y): $(m4-prefix)/%: % $(images-asmap-y) $(jsx-helper-y) \
				      $(lib-m4-y) | $(page-m4-prefix)
	$(m4) $(images-asmap-y) $(jsx-helper-y) $< >$@

$(page-y)1: $(page-m4-y) | $(prefix)
	$(esbuild) --jsx-import-source=preact --jsx=automatic \
		   --sourcemap=inline --outfile=$@ $<

$(page-y): %: %1$(MINIMIZE) | $(static-prefix)
	cp $< $@
	$(ln-unique) $@ $(static-prefix)

clean-y += clean-page

.PHONY: clean-page

clean-page:
	rm -f $(resume-y) $(photos-map-y) $(page-m4-y) $(page-y)* \
	      $(static-prefix)/index-*.js
