/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { render } from 'preact'

import Hero from './page/hero.jsx'

function Root()
{

RETURN_JSX_BEGIN
<main class='font-jetbrans_mono text-neutral-900 
             md:flex md:justify-center md:drop-shadow-xl
             *:px-5 md:*:px-10 *:md:w-192 *:xl:w-384'>
  <Hero/>
</main>
RETURN_JSX_END
}

render(<Root/>, document.body)
