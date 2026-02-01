/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

export default function Bar({ vertical, ...props })
{
	const style = vertical ? 'w-1' : 'h-1' 

	if (props.class)
		props.class += ` ${style}`
	else
		props.class = style

	props.class += ' bg-miku-cyan drop-shadow-sm'

RETURN_JSX_BEGIN
<div { ...props }></div>
RETURN_JSX_END
}
