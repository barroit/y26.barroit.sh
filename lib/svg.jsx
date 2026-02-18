/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

export default function SVGIcon({ src, ...props })
{
	APPEND_CLASS(props, 'rounded-full drop-shadow-sm transition')

	APPEND_CLASS(props, '*:mask-no-repeat *:mask-cover \
			     *:mask-(--mask) *:transition')

RETURN_JSX_BEGIN
<div { ...props }>
  <div style={ { '--mask': `url(${src})` } }></div>
</div>
RETURN_JSX_END
}
