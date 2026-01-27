/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { render } from 'preact'

function Root()
{

RETURN_JSX_BEGIN
<div class='flex justify-center drop-shadow-xl
            font-jetbrans_mono text-neutral-900 
            *:px-5 md:*:px-10 *:w-sm *:md:w-3xl *:xl:w-7xl *:xl'>
  11
</div>
RETURN_JSX_END
}

render(<Root/>, document.body)
