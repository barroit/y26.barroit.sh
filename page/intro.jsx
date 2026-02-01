/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import Bar from '../lib/bar.jsx'

function ObjectiveInfo()
{

RETURN_JSX_BEGIN
<div class='w-92 space-y-20'>
  <img src='AS_AVATAR_SQUARE_JPG'
       class='mx-auto rounded-full drop-shadow-md'/>
  <div class='grid'>
    <h2 class='text-3xl font-bold'>barroit</h2>
  </div>
</div>
RETURN_JSX_END
}

function SubjectiveInfo()
{

RETURN_JSX_BEGIN
<div class='origin-top-left skew-x-12 *:pl-10
            relative @container *:not-first:-skew-x-12'>
  <Bar class='origin-top-left rotate-90 absolute top-0 left-0 w-[100cqh]'/>
  <div>Line 1</div>
  <div>Line 2</div>
</div>
RETURN_JSX_END
}

export default function Intro()
{

RETURN_JSX_BEGIN
<section id='intro' class='bg-miku [--direction:to_top_right] flex h-screen'>
  <div class='flex-1'>
    <ObjectiveInfo/>
  </div>
  <div class='flex-3'>
    <SubjectiveInfo/>
  </div>
</section>
RETURN_JSX_END
}
