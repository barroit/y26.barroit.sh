#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later

set -e

exec >$3

printf 'divert(-1)\n\n'

find $1 -maxdepth 1 -type f -exec basename {} \; | sort | while read name; do
	if ! printf $name | grep -q '\-.*\.'; then
		continue
	fi

	stem=$(printf $name | cut -d- -f1)
	ext=$(printf $name | cut -d. -f2)
	var=$(printf as_%s_%s $stem $ext | tr [[:lower:]] [[:upper:]])

	printf "define(%s, %s%s)\n\n" $var $2 $name
done

printf 'divert(0)dnl\n'
