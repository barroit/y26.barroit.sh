/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

function patch_props(box, props)
{
	const ents = Object.entries(props)

	for (const [ key, val ] of ents) {
		if (!key.startsWith('on_')) {
			box.setAttribute(key, val)

		} else {
			const name = key.substring(3)

			box.addEventListener(name, val)
		}
	}
}

function fill_children(box, children)
{
	for (const child of children) {
		if (child == null || child === false)
			continue

		if (child instanceof Node) {
			box.appendChild(child)

		} else {
			const text = String(child)
			const node = document.createTextNode(text)

			box.appendChild(node)
		}
	}
}

function init_tag(tag, props, ...children)
{
	if (typeof tag == 'function')
		return tag({ ...props, children })

	if (tag == 'fragment')
		return children

	const box = document.createElement(tag)
	const d1_children = children.flat(Infinity)

	if (props)
		patch_props(box, props)

	fill_children(box, d1_children)
	return box
}

function Root()
{

JSX_BEGIN
<div class='p-2'>Hello</div>
JSX_END
}

document.body.appendChild(<Root/>)
