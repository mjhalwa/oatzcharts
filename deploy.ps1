function UserHint-on-DirtyGitStatus {
  Write-Host "[Note] refer to git status" -ForegroundColor "DarkCyan"
  Write-Host "[Note] run git add and git commit first before retying to deploy!" -ForegroundColor "DarkCyan"
}

# empty line before any other script output
Write-Host ""
# only deploy if all changes are committed, else reject with warning, see https://stackoverflow.com/a/45146130
if(git status --porcelain |Where {$_ -match '^\?\?'}){
  # untracked files exist
  Write-Host "[Error] Deployment stopped, as untracked files exist" -ForegroundColor "red"
  UserHint-on-DirtyGitStatus
} 
elseif(git status --porcelain |Where {$_ -notmatch '^\?\?'}) {
  # uncommitted changes
  Write-Host "[Error] Deployment stopped, as uncommited changes exist" -ForegroundColor "red"
  UserHint-on-DirtyGitStatus
}
else {
  # Git tree is clean
  Write-Host "[Note] git tree is clean" -ForegroundColor "DarkCyan"

  # see https://gist.github.com/cobyism/4730490
  # build from current source
  Write-Host "building oatz-charts..." -ForegroundColor "DarkCyan"
  npm --prefix ./oatz-charts run build

  # add build to git and github
  # -> this is not working in Windows Powershell, see https://stackoverflow.com/a/66764458
  #git add oatz-charts/build && git commit -m "update with current build" && git push
  # -> Note: -and is not a correct replacement for && operator
  # -> thus replacement of && with condition on $? to check previous command succeeded
  Write-Host "adding build to git and GitHub..." -ForegroundColor "DarkCyan"
  git add ./oatz-charts/build; if ($?) { git commit -m "update with current build"; if ($?) { git push } }

  # override gh-pages branch with build directory content
  Write-Host "push build directory content to gh-pages branch on GitHub..." -ForegroundColor "DarkCyan"
  git subtree push --prefix oatz-charts/build origin gh-pages
}
