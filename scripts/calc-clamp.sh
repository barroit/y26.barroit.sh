#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later

set -e

min_val=$1
max_val=$2
min_width=${3:-360}
max_width=${4:-1280}

test -n "$max_val"

cat <<EOF | bc
scale = 6

a = $min_val
b = $max_val

p = $min_width / 16
q = $max_width / 16

u = (b - a) / (q - p)

s = u * 100
f = a - (u * p)

scale = 4

f /= 1
s /= 1

print "clamp(", a, "rem, ", f, "rem + ", s, "vw, ", b, "rem)\n"
EOF
