# SPDX-License-Identifier: GPL-3.0-or-later

rule-in := _headers
rule-y  := $(static-prefix)/$(rule-in)

build-static-y += $(rule-y)

$(rule-y): $(rule-in)
	cp $< $@

clean-y += clean-rule

.PHONY: clean-rule

clean-rule:
	rm -f $(rule-y)
