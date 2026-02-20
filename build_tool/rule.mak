# SPDX-License-Identifier: GPL-3.0-or-later

rule-in := _headers
rule-y  := $(static-prefix)/$(rule-in)

onchange-in += $(rule-in)
deploy-ready-y += $(rule-y)

$(rule-y): $(rule-in) | $(static-prefix)
	m4 $${HOT_DEV:+-DHOT_DEV} $< >$@

clean-y += clean-rule

.PHONY: clean-rule

clean-rule:
	rm -f $(rule-y)
