# SPDX-License-Identifier: GPL-3.0-or-later

$(eval $(call def-target,worker,worker.js,worker.js,worker/*.js))

terser-in += $(worker-y)
onchange-in += $(worker-glob)
deploy-ready-y += $(worker-y)

$(worker-y)1: $(worker-in) | $(prefix)
	$(esbuild) --sourcemap=inline --outfile=$@ $<

$(worker-y): %: %1$(minimize)
	ln -f $< $@

clean-y += clean-worker

.PHONY: clean-worker

clean-worker:
	rm -f $(worker-y)*
