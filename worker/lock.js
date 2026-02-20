/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { list_head, list_add, list_del } from './list.js'

const head = new list_head()

export async function lock_acquire()
{
	const lock = new list_head()
	let resolve
	const promise = new Promise(r => resolve = r)

	lock.val = [ promise, resolve ]
	list_add(lock, head)

	if (lock.next !== head)
		await lock.next.val[0]
}

export function lock_release()
{
	const lock = head.prev
	const resolve = lock.val[1]

	resolve()
	list_del(lock, head)
}
