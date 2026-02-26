/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useState, useEffect } from 'preact/hooks'

function test_mobile()
{
	const test = window.matchMedia('(pointer: coarse)')

	return +test.matches
}

export default function useMobile()
{
	const [ mobile, set_mobile ] = useState(test_mobile)

	useEffect(() =>
	{
		const set_mobile_fn = set_mobile.bind(undefined, test_mobile)

		window.addEventListener('change', set_mobile_fn)
		return () => window.removeEventListener('change', set_mobile_fn)
	}, [])

	return mobile
}
