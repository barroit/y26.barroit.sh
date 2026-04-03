# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,worker,,worker.js,worker/*.js))
worker-entry-in := worker/entry.js
worker-helper-in := worker/helper.m4
worker-m4-prefix := $(m4-prefix)/worker

prefix-y += $(worker-m4-prefix)
terser-in += $(worker-y)
onchange-in += $(worker-glob)
deploy-ready-y += $(worker-y)

$(worker-m4-y): $(m4-prefix)/%: $(worker-helper-in) % | $(worker-m4-prefix)
	$(m4) $^ >$@

$(worker-y)1: $(worker-m4-y)
	$(esbuild) --sourcemap=inline --outfile=$@ $<

$(worker-y): %: %1$(MINIMIZE)
	cp $< $@

clean-y += clean-worker

.PHONY: clean-worker

clean-worker:
	rm -f $(worker-m4-y) $(worker-y)*
