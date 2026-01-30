/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { render } from 'preact'

import Hero from './page/hero.jsx'
import Intro from './page/intro.jsx'
import Log from './page/log.jsx'
import Gallery from './page/gallery.jsx'
import Highlight from './page/highlight.jsx'
import Commits from './page/commits.jsx'
import Credit from './page/credit.jsx'

function Root()
{

RETURN_JSX_BEGIN
<main class='font-jetbrans_mono text-neutral-900 
             md:flex flex-col items-center md:drop-shadow-xl
             *:px-5 md:*:px-10 *:md:w-192 *:xl:w-384'>
  <Hero/>
  <Intro/>
  <Log/>
  <Gallery/>
  <Highlight/>
  <Commits/>
  <Credit/>
</main>
RETURN_JSX_END
}

render(<Root/>, document.body)
