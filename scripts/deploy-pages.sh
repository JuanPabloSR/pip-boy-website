#!/usr/bin/env bash
# Publishes the current checkout to GitHub Pages by hand: builds the site and pushes
# dist/ to the gh-pages branch, keeping its history. Handy from a feature branch;
# on main, .github/workflows/deploy.yml does the same thing on every push.
#
#   scripts/deploy-pages.sh
#
# The public URL baked into the build comes from VITE_SITE_URL (.env) or, if unset,
# from CONTACT.site in src/data/shared.ts.
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
REMOTE=$(git -C "$ROOT" remote get-url origin)
SHA=$(git -C "$ROOT" rev-parse --short HEAD)
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

cd "$ROOT"
npx vite build --outDir "$WORK/dist" --emptyOutDir >/dev/null
git clone -q --branch gh-pages --single-branch "$REMOTE" "$WORK/site"
find "$WORK/site" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r "$WORK/dist/." "$WORK/site/"
touch "$WORK/site/.nojekyll"

cd "$WORK/site"
git add -A
git commit -q -m "Deploy $SHA" || { echo "Nothing to deploy"; exit 0; }
git push -q origin gh-pages
echo "Published $SHA to gh-pages"
