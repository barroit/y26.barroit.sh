/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

async function on_fetch(req, env)
{
	return new Response('Not Found', { status: 404 })
}

export default {
	fetch: on_fetch,
}
