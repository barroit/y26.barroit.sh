/* SPDX-License-Identifier: GPL-3.0-or-later */
/*
 * Copyright 2026 Jiamu Sun <barroit@linux.com>
 */

import { useEffect, useState } from 'preact/hooks'
import { Temporal } from 'temporal-polyfill'

import Bar from '../lib/bar.jsx'
import Flick from '../lib/flick.jsx'
import { LinkExtern } from '../lib/link.jsx'

function Label({ children, src, ...props })
{
	const style = 'flex items-center gap-x-2'

	if (props.class)
		props.class += ` ${style}`
	else
		props.class = style

RETURN_JSX_BEGIN
<div { ...props }>
  <img class='h-5 select-none drop-shadow-sm' src={ src } draggable={ false }/>
  <p class='text-sm'>
    { children }
  </p>
</div>
RETURN_JSX_END
}

function BirthdayLabel()
{
	const birth_date = { year: 2005, month: 4, day: 6 }
	const birth = Temporal.PlainDateTime.from(birth_date)

	const now = Temporal.Now.plainDateTimeISO()
	const age = birth.until(now, { largestUnit: 'years' })

	const age_label = { years: 'year', months: 'month', days: 'day' }

	if (age.years > 1)
		age_label.years += 's'
	if (age.months > 1)
		age_label.months += 's'
	if (age.days > 1)
		age_label.days += 's'

RETURN_JSX_BEGIN
<Label src='AS_CAKE_SVG'>
    { age.years } { age_label.years }, {}
    { age.months } { age_label.months }, {}
    { age.days } { age_label.days }
</Label>
RETURN_JSX_END
}

function ClockLabel()
{
	const now_ref = Temporal.Now.zonedDateTimeISO
	const now_fn = now_ref.bind(undefined, 'Asia/Tokyo')
	const [ now, next ] = useState(now_fn)

	useEffect(() =>
	{
		const next_fn = next.bind(undefined, now_fn)
		const timer = setInterval(next_fn, 1000)

		return () => clearInterval(timer)
	}, [])

	const hour_str = now.hour + ''
	const minute_str = now.minute + ''

	const hour = hour_str.padStart(2, '0')
	const minute = minute_str.padStart(2, '0')

RETURN_JSX_BEGIN
<Label src='AS_SCHEDULE_SVG'>
  <span>{ hour }:{ minute } </span>
  <span class='text-zinc-500'>(UTC { now.offset })</span>
</Label>
RETURN_JSX_END
}

function Identity()
{

RETURN_JSX_BEGIN
<div class='flex items-center gap-x-10'>
  <img src='AS_AVATAR_SQUARE_JPG' draggable={ false }
       class='w-20 rounded-full drop-shadow-md select-none'/>
  <div>
    <p class='text-2xl font-bold'>
      Jiamu Sun
      <sup aria-hidden={ true }
           class='italic tracking-widest
                  font-x16y32px_grid_gazer text-miku-cyan'>
        {} 39
      </sup>
    </p>
    <div class='text-zinc-500'>
      <span class='text-xl'>barroit</span>
      <span class='ml-2 font-sans'>/ˈbɑːˌroʊrt/</span>
    </div>
  </div>
</div>
RETURN_JSX_END
}

function Status()
{

RETURN_JSX_BEGIN
<div class='space-y-5'>
  <BirthdayLabel/>
  <Label src='AS_MIC_SVG'>Chinese / English / Japanese</Label>
  <Label src='AS_LOCATION_ON_SVG'>Chiba Chuo</Label>
  <ClockLabel/>
  <Label src='AS_MAIL_SVG'>
    <LinkExtern href='mailto:barroit@linux.com' class='hover:underline'>
      <Flick>barroit@linux.com</Flick>
    </LinkExtern>
  </Label>
  <Label src='AS_SMS_SVG'>
    <LinkExtern href='https://x.com/barro1t' class='hover:underline'>
      <Flick>https://x.com/barro1t</Flick>
    </LinkExtern>
  </Label>
</div>
RETURN_JSX_END
}

export default function Intro()
{

RETURN_JSX_BEGIN
<section id='intro' class='space-y-15'>
  <div class='mx-auto w-fit space-y-10'>
    <Identity/>
    <Status/>
  </div>
</section>
RETURN_JSX_END
}
