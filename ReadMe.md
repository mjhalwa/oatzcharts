# Charts for Stats of OATZ Rocket League Tuesdays

[OATS Rocket League](https://www.oatz.net/rocketleague)

[OATS Rocket League - All data](https://www.oatz.net/rocketleague/all)

[Github Pages](https://mjhalwa.github.io/oatzcharts/)

## Requirements

1. Linux OS or WSL to access `bash` commands like `sed`, `cat`, `echo`, ...
2. bash-package `jq`

    ``` bash
    sudo apt install jq
    ```

3. Microsoft Excel for Proof of Concept Graphics

## Development

0. load requirements of `oatz-charts` and `dev-server` project

    ``` ps1
    # from ./oatz-charts
    npm install
    # and
    # from ./dev-server
    npm install
    ```

1. start `dev-server`

    ``` ps1
    # from ./dev-server
    npm run run
    #or from ./oatz-charts
    npm run dev-server
    ```

2. start react in `./oatz-charts`

    ``` ps1
    npm run start
    #or
    yarn start
    ```

Note: see `./dev-server/ReadMe.md` on details of served json files, if `dev-server` is not available, will use offline data from `./oatz-charts/src/lib/data.json`

## Deployment

``` cmd
powershell .\deploy.ps1
```

Note: returns `Everything up-to-date` in case the `build` does not contain any changes

Note: script was created using guideline [Gist `cobyism/gh-pages-deploy.md`](https://gist.github.com/cobyism/4730490) with replacing bash's `&&` with `; if ($?) {...}` as pointed out at [this stackoverflow response](https://stackoverflow.com/a/66764458). Also note that `-and` is not a valid replacement for `&&` and that `&&` should be supported by Powershell v7+ according to that stackoverflow response.

Note: Call Powershell scripts from Windows Command Prompt either with `powershell .\script.ps1` (see [response at stackoverflow](https://stackoverflow.com/a/167394769)) or `PowerShell -File .\script.ps1` (see [petri.com - How to Write and Run a PowerShell Script File on Windows 11](https://petri.com/how-to-write-and-run-a-powershell-script-file-on-windows-11/))

### Troubleshooting

initially had to fix gh-pages branch with guideline from [stephenlee.info - Force Push a Git Subtree](https://stephenlee.info/version%20control/2021/01/13/git-force-push-subtree.html) as gh-pages branch was previously maintained with committing manual copies of build directory content, leading to non-mergeable scenario for `git subtree push` with

``` bash
# push build-dir content into new local `gh-pages` branch
git subtree split --prefix oatz-charts/build -b gh-pages
# force push the local gh-pages branch over the remote one
git push -f origin gh-pages:gh-pages
# delete the local gh-pages branch
git branch -D gh-pages
```

## Create Graphics

1. get all JSON data from [OATS Rocket League API](https://www.oatz.net/rocketleague/api/all)

    ``` bash
    curl https://www.oatz.net/rocketleague/api/all | jq "." > ./oatz-charts/src/lib/data.json
    ```

2. create Excel-importable csv table from `data.json`

    ``` bash
    bash json2csv.sh
    ```

    creates
    - `data.csv` extracted stats in tabular format: `date | username | ...stats`
    - `data_ger.csv` for opening with German MS Excel (',' comma)

3. open `data.csv` in Excel and copy data into first Tab of `data.xslx` (+ extend first column in this tab to the new table size)

## Proof of Concept

### 17.8.2021

![Spider-Charts 17.8.2021](./img/spider-2021_08_17.png)

### 27.7.2021

![Spider-Charts 27.7.2021](./img/spider-2021_07_27.png)

## dev-server

run dev server on each `npm start`, see [stackoverflow](https://stackoverflow.com/questions/37078968/how-to-specify-the-path-of-package-json-to-npm)

``` bash
npm --prefix /path/to/project run build
```
