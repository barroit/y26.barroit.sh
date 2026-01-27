#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later

set -e

exec >$1

shift

subst=$1

shift

printf 'divert(-1)\n\n'

find $@ -maxdepth 1 -type f | sort | while read fullname; do
	name=$(basename $fullname)

	if ! printf $name | grep -q '\-.*\.'; then
		continue
	fi

	stem=$(printf $name | cut -d- -f1)
	ext=$(printf $name | cut -d. -f2)

	var_name=$(printf as_%s_%s $stem $ext | tr [[:lower:]] [[:upper:]])
	var_val=${fullname#$subst}

	printf "define(%s, %s%s)\n\n" $var_name $var_val
done

printf 'divert(0)dnl\n'
