# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,worker,,worker.js,worker/*.js))
worker-entry-in := worker/entry.js
worker-helper-in := worker/helper.m4

terser-in += $(worker-y)
onchange-in += $(worker-glob)
deploy-ready-y += $(worker-y)

$(worker-m4-y): $(m4-prefix)/%: $(worker-helper-in) %
	mkdir -p $(@D)
	$(m4) $^ >$@

$(worker-y)1: $(m4-prefix)/$(worker-entry-in) $(worker-m4-y)
	$(esbuild) --sourcemap=inline --outfile=$@ $<

$(worker-y): %: %1$(minimize)
	ln -f $< $@

clean-y += clean-worker

.PHONY: clean-worker

clean-worker:
	rm -f $(worker-m4-y) $(worker-y)*
