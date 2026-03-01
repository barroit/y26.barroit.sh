/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

export default function Dead({ children })
{

RETURN_JSX_BEGIN
<div class='flex p-20'>
  <div class='m-auto px-6 py-4 flex items-center gap-x-6
              rounded-md bg-zinc-200/39 shadow-md'>
    <img src='IMAGES_AMALA_FROWN_PNG' draggable={ 0 }
         class='size-16 drop-shadow-md select-none'/>
    <div>
      <p class='text-xl'>Sorry, but</p>
      <p>{ children }</p>
    </div>
  </div>
</div>
RETURN_JSX_END
}
