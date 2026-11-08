#!/bin/bash

set -e

cd $(dirname $0)

rm -rf .astro node_modules/.astro node_modules/.vite
npm install
npm run dev
