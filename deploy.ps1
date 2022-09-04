# see https://gist.github.com/cobyism/4730490
# build from current source
npm --prefix ./oatz-charts run build

# add build to git and github
# -> this is not working in Windows Powershell, see https://stackoverflow.com/a/66764458
#git add oatz-charts/build && git commit -m "update with current build" && git push
# -> Note: -and is not a correct replacement for && operator
# -> thus replacement of && with condition on $? to check previous command succeeded
git add ./oatz-charts/build; if ($?) { git commit -m "update with current build"; if ($?) { git push } }

# override gh-pages branch with build directory content
git subtree push --prefix oatz-charts/build origin gh-pages