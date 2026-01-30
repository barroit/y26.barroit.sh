/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

export default function Bar({ vertical, ...props })
{
	let style = 'bg-miku-cyan drop-shadow-sm '

	if (vertical)
		style += 'w-[1vw] md:w-2'
	else
		style += 'h-[1vw] md:h-2'

	if (props.class)
		props.class = `${style} ${props.class}`
	else
		props.class = style

RETURN_JSX_BEGIN
<div { ...props }></div>
RETURN_JSX_END
}
