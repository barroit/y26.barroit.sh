/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

export default function Bar({ vertical, color = 'bg-miku-cyan',
			      shadow = 'shadow-sm', ...props })
{
	APPEND_CLASS(props, vertical ? 'w-1' : 'h-1')
	props.class += ` ${color} ${shadow}`

RETURN_JSX_BEGIN
<div { ...props }></div>
RETURN_JSX_END
}
