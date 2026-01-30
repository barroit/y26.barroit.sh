# SPDX-License-Identifier: GPL-3.0-or-later

lib-glob := lib/*.jsx lib/*.js
lib-in   := $(wildcard $(lib-glob))
lib-m4-y := $(addprefix $(m4-prefix)/,$(lib-in))

onchange-in += $(lib-glob)

$(lib-m4-y): $(m4-prefix)/%: $(image-asmap-y) %
	mkdir -p $(@D)
	$(m4) $^ >$@

clean-y += clean-lib

.PHONY: clean-lib

clean-lib:
	rm -f $(lib-m4-y)
