/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { lock_acquire, lock_release } from './lock.js'

import * as highlight from './highlight.js'

const queries = [ highlight ]
const cache = {}

for (const { pathname, retry_cd_ms, cache_ttl_ms } of queries) {
	cache[pathname] = {
		cache_ttl_ms,
		retry_cd_ms,
		last_run_at: 0,
		state: ST_DONE,
	}
}

function cache_load(key)
{
	const now = Date.now()
	const { cache_ttl_ms, retry_cd_ms, last_run_at } = cache[key]
	const { state, data } = cache[key]

	switch (state) {
	case ST_DONE:
		if (last_run_at + cache_ttl_ms < now)
			return [ ST_RETRY, undefined ]
		break

	case ST_RETRY:
		if (last_run_at + retry_cd_ms < now)
			return [ ST_RETRY, data ]
		break
	}

	return [ ST_DONE, data ]
}

function cache_bump(key, state, data)
{
	cache[key].last_run_at = Date.now()
	cache[key].state = state
	cache[key].data = data
}

async function on_fetch(req, env)
{
	const url = new URL(req.url)
	let handler

	switch (url.pathname) {
	case highlight.pathname:
		handler = highlight.query
		break

	default:
		return new Response('not found', { status: 404 })
	}

	let [ state, data ] = cache_load(url.pathname)
	let locked

	let status = 200
	let str = '[]'

	try {
		if (state == ST_RETRY) {
			await lock_acquire()
			locked = 1
		}

		[ state, data ] = cache_load(url.pathname)

		if (locked && state != ST_RETRY) {
			lock_release()
			locked = 0

		} else if (state == ST_RETRY) {
			[ state, data ] = await handler(req, env, data)
			cache_bump(url.pathname, state, data)
		}

		if (!data)
			status = 500
		else
			str = JSON.stringify(data)

	} catch (err) {
		status = 500

		console.error(err)

	} finally {
		if (locked)
			lock_release()
	}

	return new Response(str, { status })
}

export default {
	fetch: on_fetch,
}
