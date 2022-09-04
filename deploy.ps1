# see https://gist.github.com/cobyism/4730490
# build from current source
npm --prefix ./oatz-charts run build
# add build to git and github
git add ./oatz-charts/build && git commit -m "update with current build" && git push
# override gh-pages branch with build directory content
git subtree push --prefix ./oatz-charts/build origin gh-pages