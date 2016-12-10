#!/bin/sh

set -e

rm -rf .build
node_modules/.bin/gobble build .build
cd .build && now
