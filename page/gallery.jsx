/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useEffect, useRef, useState } from 'preact/hooks'

import useCachedState from '../lib/state.js'
import Bar from '../lib/bar.jsx'
import SVGIcon from '../lib/svg.jsx'

include(build/photos.js)dnl

const year_offset = photos_map[0][0]
const year_tab = photos_map.map(([ year ]) => year)

for (const photos of photos_map)
	photos[0] = undefined

function init_year_idx()
{
	const idx_str = localStorage.getItem('photo_year_idx')

	if (!idx_str)
		return year_tab.length - 1

	const idx = Number(idx_str)

	if (idx < 0 || idx >= year_tab.length)
		return year_tab.length - 1

	return idx
}

function restore_pos_tab()
{
	const arr_str = localStorage.getItem('photo_pos_tab')

	if (!arr_str)
		return

	let arr

	try {
		arr = JSON.parse(arr_str)
	} catch {
		return
	}

	if (!Array.isArray(arr))
		return

	if (arr.length != photos_map.length)
		return

	let idx

	for (idx = 0; idx < arr.length; idx++)
		arr[idx] = Math.min(arr[idx], photos_map[idx].length - 1)

	return arr
}

function init_pos_tab()
{
	const cache = restore_pos_tab()

	if (cache)
		return cache

	const arr = new Array(photos_map.length)

	arr.fill(1)
	return arr
}

function init_loop()
{
	const loop = localStorage.getItem('photo_loop')

	switch (loop) {
	case '1':
	case '0':
		return Number(loop)

	default:
		return 1
	}
}

function Year({ children, onclick, ...props })
{
	APPEND_CLASS(props, 'p-2 font-bold transition duration-100 \
			     HOT(text-[MIKU_PINK]) HOT(-translate-y-1) \
			     ACTIVE(translate-y-0)')

RETURN_JSX_BEGIN
<button inert={ !children } onclick={ onclick }>
  <div { ...props }>
    <h3 style={ { visibility: children ? 'visible' : 'hidden' } }
        class='origin-bottom leading-none'>
      { children || 3939 }
    </h3>
  </div>
</button>
RETURN_JSX_END
}

function on_click_year(event, set_idx)
{
	const year_str = CHILD_TEXT_OF(event.currentTarget)
	const year = Number(year_str)

	set_idx(year - year_offset)
}

function YearKnob({ year_idx, set_year_idx })
{
	const fill_years_fn = (_, i) => year_tab[year_idx - 2 + i]
	const years = Array.from({ length: 5 }, fill_years_fn)
	const onclick = event => on_click_year(event, set_year_idx)

RETURN_JSX_BEGIN
<div class='flex items-center justify-around text-xl'>
  <Year class='hidden lg:block *:scale-60' { ...{ onclick } }>
    { years[0] }
  </Year>
  <Year class='*:scale-80' { ...{ onclick } }>
    { years[1] }
  </Year>
  <div class='px-5 font-bold
              before:content-["["] before:pr-2 before:text-miku-pink
              after:content-["]"] after:pl-2 after:text-miku-pink'>
    { years[2] }
  </div>
  <Year class='*:scale-80' { ...{ onclick } }>
    { years[3] }
  </Year>
  <Year class='hidden lg:block *:scale-60' { ...{ onclick } }>
    { years[4] }
  </Year>
</div>
RETURN_JSX_END
}

function Preview({ poster, set_visible, ...props })
{
	const node = useRef()

	useEffect(() =>
	{
		const observer = new IntersectionObserver(([ entry ]) =>
		{
			if (entry.isIntersecting)
				set_visible(1)
			else
				set_visible(0)
		})

		observer.observe(node.current)

		return () => observer.disconnect()
	}, [])

	APPEND_CLASS(props, 'max-h-full border-4 border-miku-pink/50 \
			     [--span:4px] mask-fade-edge')

RETURN_JSX_BEGIN !poster ? (
<img ref={ node } { ...props } decoding='async' draggable={ 0 }/>
) : (
<video ref={ node } controls preload='metadata'
       { ...{ ...props, poster } }></video>
) RETURN_JSX_END
}

function PreviewMask({ children })
{

RETURN_JSX_BEGIN
<div class='absolute inset-0 m-[4px] flex transition GROUP_HOT(bg-zinc-800/60)'>
  { children }
</div>
RETURN_JSX_END
}

function dialog_show(dialog, set_visible, keep_scroll_bar)
{
	if (keep_scroll_bar)
		document.documentElement.dataset.scrollbar = ''

	document.documentElement.dataset.dialog = ''
	set_visible(0)

	dialog.current.showModal()
}

function dialog_hide(dialog, set_visible, keep_scroll_bar)
{
	if (keep_scroll_bar)
		delete document.documentElement.dataset.scrollbar

	delete document.documentElement.dataset.dialog
	set_visible(1)

	dialog.current.close()
	
}

function Showcase({ dialog, onclick, children })
{

RETURN_JSX_BEGIN
<dialog ref={ dialog } { ...{ onclick } }
        class='p-10 max-w-none max-h-none w-screen h-screen open:flex
               bg-miku [--direction:to_bottom_right] select-none
               *:max-h-full *:m-auto *:object-contain *:drop-shadow-lg
               *:border-4 *:border-luka-pink *:mask-fade-edge *:[--span:4px]'>
  { children }
</dialog>
RETURN_JSX_END
}

function Video({ src, poster, set_visible })
{

RETURN_JSX_BEGIN
<div>
  <Preview { ...{ src, poster, set_visible } } class='size-full'/>
</div>
RETURN_JSX_END
}

function Photo({ src, dialog, set_visible })
{
	const open = dialog_show.bind(undefined, dialog, set_visible, 0)
	const close = dialog_hide.bind(undefined, dialog, set_visible, 0)

RETURN_JSX_BEGIN
<div>
  <button onclick={ open } class='group relative size-full outline-none'>
    <Preview { ...{ src, set_visible } }/>
    <PreviewMask>
      <SVGIcon src='AS_OPEN_IN_FULL_SVG'
               class='m-auto p-2 bg-gray-200 opacity-0
                      GROUP_HOT(opacity-100) GROUP_ACTIVE(scale-80)
                      *:size-6 *:bg-gray-700'/>
    </PreviewMask>
  </button>
  <Showcase onclick={ close } { ...{ dialog } }>
    <img { ...{ src } } decoding='async' draggable={ 0 }/>
  </Showcase>
</div>
RETURN_JSX_END
}

function Control({ onclick, ...props })
{
	APPEND_CLASS(props, 'p-2 duration-100 GROUP_HOT(bg-zinc-400) \
			     GROUP_ACTIVE(scale-80) *:size-6')

RETURN_JSX_BEGIN
<button onclick={ onclick } class='group outline-none'>
  <SVGIcon { ...props }/>
</button>
RETURN_JSX_END
}

function LoopControl({ loop, set_loop, year_idx, next })
{
	const toggle_fn = prev => prev ^ 1
	const disable_fn = set_loop.bind(undefined, toggle_fn)

	useEffect(() =>
	{
		if (!loop)
			return

		const timer = setInterval(() => next.current.click(), 3939)

		return () => clearInterval(timer)
	}, [ year_idx, loop ])

	const style = {}

	if (loop)
		APPEND_CLASS(style, '*:bg-meiko-red *:duration-0')
	else
		APPEND_CLASS(style, '*:bg-black')

RETURN_JSX_BEGIN
<Control src='AS_AUTOPLAY_SVG' onclick={ disable_fn } { ...style }/>
RETURN_JSX_END
}

function OpenControl({ dialog, video })
{
	const props = {}

	if (!video)
		APPEND_CLASS(props, '*:bg-black')
	else
		APPEND_CLASS(props, '*:bg-gray-400')

	props.onclick = () => PREV_SIBLING_OF(dialog.current).click()

RETURN_JSX_BEGIN
<>
  <div inert={ !!video } class='hidden pointer-coarse:flex'>
    <Control src='AS_OPEN_IN_FULL_SVG' { ...props }/>
  </div>
  <div class='pointer-coarse:hidden flex gap-x-8
              [&_*_*]:size-6 [&_*_*]:bg-rin-orange/70'>
    <SVGIcon src='AS_2020_CLOVER_SVG'/>
    <SVGIcon src='AS_2021_FLOWER_SVG'/>
    <SVGIcon src='AS_2022_PENTAGRAM_SVG'/>
    <SVGIcon src='AS_2025_OCTAGRAM_SVG'/>
  </div>
</>
RETURN_JSX_END
}

function on_img_click(dialog, set_visible, set_pos_tab, set_loop, event)
{
	const img = CHILD_OF(event.currentTarget)
	const box = PARENT_OF(event.currentTarget)

	const year_idx = Number(box.dataset.idx) ?? year_tab.length - 1
	const new_pos = Number(img.dataset.idx) ?? 1

	const map_fn = (val, idx) => idx != year_idx ? val : new_pos
	const bump_pos_tab_fn = prev => [ ...prev ].map(map_fn)

	set_pos_tab(bump_pos_tab_fn)
	dialog_hide(dialog, set_visible, 1)
	set_loop(0)
}

function ExplandControl({ year_idx, set_visible, set_pos_tab, set_loop })
{
	const dialog = useRef()
	const open = dialog_show.bind(undefined, dialog, set_visible, 1)
	const close = dialog_hide.bind(undefined, dialog, set_visible, 1)

	const jump = on_img_click.bind(undefined, dialog,
				       set_visible, set_pos_tab, set_loop)

	let photos = photos_map[year_idx]
	const pad_size = (3 - (photos.length - 1) % 3) % 3

	if (pad_size) {
		const pad = new Array(pad_size)

		pad.fill(0)
		photos = [ ...photos, ...pad ]
	}

RETURN_JSX_BEGIN
<div class='flex items-center'>
  <Control src='AS_EXPAND_ALL_SVG' class='*:bg-black' onclick={ open }/>
  <dialog ref={ dialog } onclick={ close }
          class='m-auto max-w-xl max-h-none h-screen md:h-[95vh] bg-miku
                 md:border-4 border-luka-pink md:mask-fade-edge [--span:4px]'>
    <div data-idx={ year_idx }
         class='p-1 grid grid-cols-3 gap-[1px] overflow-auto'>
    { photos.map((url, idx) => url == 0 ? (
      <div></div>
    ) : !url ? undefined : (
      <button onclick={ jump }
              class='group
                     nth-[3n+1]:*:origin-left
                     nth-[3n]:*:origin-right
                     nth-1:*:origin-top-left!
                     nth-2:*:origin-top!
                     nth-3:*:origin-top-right!
                     nth-last-3:*:origin-bottom-left!
                     nth-last-2:*:origin-bottom!
                     nth-last-1:*:origin-bottom-right!'>
        <img src={ url[1] } data-idx={ idx } draggable={ 0 }
             class='aspect-square object-cover select-none
                    transition-all GROUP_HOT(scale-120)
                    GROUP_HOT(outline-2) GROUP_HOT(outline-miku-cyan)'/>
      </button>
    )) }
    </div>
  </dialog>
</div>
RETURN_JSX_END
}

function Thumbnail({ src, onclick, children, ...props })
{
	APPEND_CLASS(props, 'relative aspect-video transition duration-100 \
			     GROUP_HOT(-translate-y-2) \
			     GROUP_ACTIVE(translate-0)')

RETURN_JSX_BEGIN
<button { ...{ onclick } } class='group outline-none'>
  <div { ...props }>
    <img { ...{ src } } decoding='async' draggable={ 0 }
         class='size-full object-cover
                border-2 border-rin-orange [--span:2px] mask-fade-edge'/>
    { children }
  </div>
</button>
RETURN_JSX_END
}

function on_thumb_click(new_pos, year_idx, set_loop, set_pos_tab, event)
{
	const map_fn = (val, idx) => idx != year_idx ? val : new_pos
	const bump_pos_tab_fn = prev => [ ...prev ].map(map_fn)

	if (event.isTrusted)
		set_loop(0)

	set_pos_tab(bump_pos_tab_fn)
}

divert(-1)

define(__PHOTO_ARROW,
       $1:absolute $1:-inset-y-1 $1:-$2-5 $1:w-2 $1:pointer-events-none \
       $1:border-$3-[.2rem] $1:border-y-[.2rem] $1:border-miku-pink)

define(PHOTO_ARROW, [[__PHOTO_ARROW($1, $2, substr($2, 0, 1))]])

divert(0)dnl
dnl
function PhotoKnob({ year_idx, pos, loop, set_loop, set_pos_tab, next })
{
	const photos = photos_map[year_idx]
	const l_pos = photos[pos - 1] ? pos - 1 : photos.length - 1
	const r_pos = photos[pos + 1] ? pos + 1 : 1

	const args = [ year_idx, set_loop, set_pos_tab ]
	const l_args = [ undefined, l_pos, ...args ]
	const r_args = [ undefined, r_pos, ...args ]

	const l_fn = on_thumb_click.bind(...l_args)
	const r_fn = on_thumb_click.bind(...r_args)

	const style = 'h-8 lg:h-16 GROUP_HOT(scale-120)'
	const l_style = {}
	const r_style = {}

	APPEND_CLASS(l_style, style)
	APPEND_CLASS(l_style, 'origin-bottom-right PHOTO_ARROW(before, left) \
			       GROUP_HOT(-translate-x-2)')

	APPEND_CLASS(r_style, style)
	APPEND_CLASS(r_style, 'origin-bottom-left PHOTO_ARROW(after, right) \
			       GROUP_HOT(translate-x-2)')

	if (loop)
		APPEND_CLASS(r_style, 'translate-x-1 -translate-y-1 scale-110')

RETURN_JSX_BEGIN
<div class='w-fit flex items-end gap-x-2 select-none'>
  <Thumbnail src={ photos[l_pos][1] } onclick={ l_fn } { ...l_style }>
    <div class='absolute inset-0 m-[2px] bg-zinc-800/70'></div>
  </Thumbnail>
  <div inert class='h-12 lg:h-24 **:size-full'>
    <Thumbnail src={ photos[pos][1] }></Thumbnail>
  </div>
  <Thumbnail src={ photos[r_pos][1] }
             onclick={ r_fn } { ...r_style }>
    <div class='absolute inset-0 m-[2px] bg-zinc-800/70' ref={ next }></div>
  </Thumbnail>
</div>
RETURN_JSX_END
}

divert(-1)

define(DEF_CACHED_STATE, [[dnl
const [ $1, set_$1 ] = useCachedState(init_$1, 'photo_$1')
]])

define(CANVAS_ARROW_HEAD,
       size-3 rounded-full border-3 border-miku-pink)

divert(0)dnl
dnl
export default function Gallery()
{
	DEF_CACHED_STATE(year_idx)dnl
	DEF_CACHED_STATE(pos_tab)dnl
	DEF_CACHED_STATE(loop)dnl

	const [ visible, set_visible ] = useState(1)
	const next = useRef()
	const dialog = useRef()

	const pos = pos_tab[year_idx]
	const photos = photos_map[year_idx]

	const photo = photos[pos]
	const video = +photo[0].endsWith('.webm')

RETURN_JSX_BEGIN
<section id='gallery' class='space-y-5 *:mx-auto *:max-w-lg lg:*:max-w-5xl'>
  <div>
    <YearKnob { ...{ year_idx, set_year_idx } }/>
  </div>
  <div>
    <Bar class='mx-auto h-15' vertical/>
    <div class='mx-auto -translate-y-0.5 CANVAS_ARROW_HEAD'></div>
    <Bar class='mt-5 mx-5 md:mx-10'/>
  </div>
  <div class='mt-15 lg:mt-20 px-10 w-fit select-none'>
    <div class='drop-shadow-lg *:h-60 lg:*:h-120'>
    { !video ? (
      <Photo src={ photo[0] } { ...{ dialog, set_visible } }/>
    ) : (
      <Video src={ photo[0] } poster={ photo[1] } { ...{ set_visible } }/>
    ) }
    </div>
  </div>
  <div>
    <div class='mx-auto mb-10 mt-15 lg:mt-20 p-2 max-w-xs lg:max-w-none lg:w-lg
                flex items-center justify-between rounded-full
                bg-zinc-200/50 shadow-sm'>
      <LoopControl loop={ loop && visible }
                   { ...{ year_idx, set_loop, next } }/>
      <OpenControl { ...{ dialog, video } }/>
      <ExplandControl { ...{ year_idx, set_visible, set_pos_tab, set_loop } } />
    </div>
  </div>
  <div>
    <Bar class='mx-5 md:mx-10'/>
    <div class='mx-auto mt-5 translate-y-0.5 CANVAS_ARROW_HEAD'></div>
    <Bar class='mx-auto h-15' vertical/>
  </div>
  <PhotoKnob { ...{ year_idx, pos, loop, set_loop, set_pos_tab, next } }/>
</section>
RETURN_JSX_END
}
