# SPDX-License-Identifier: GPL-3.0-or-later

headers-in := _headers
headers-y  := $(static-prefix)/$(headers-in)

onchange-in += $(headers-in)
deploy-ready-y += $(headers-y)

$(headers-y): $(headers-in) | $(static-prefix)
	m4 $${DEV:+-DDEV} $< >$@

distclean-y += distclean-headers

.PHONY: distclean-headers

distclean-headers:
	rm -f $(headers-y)
