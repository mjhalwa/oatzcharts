# Charts for Stats of OATZ Rocket League Tuesdays

## Requirements

1. Linux OS or WSL to access `bash` commands like `sed`, `cat`, `echo`, ...
2. bash-package `jq`

    ``` bash
    sudo apt-get install jq
    ```

3. Microsoft Excel for Proof of Concept Graphics

## Create Graphics

1. update data from [OATS Rocket League](https://www.oatz.net/rocketleague/all)

    ``` bash
    bash webscraper.sh
    ```

    creates
    - `raw.html` HTML-Website as is
    - `filtered.html` only relevant HTML elements
    - `data.csv` extracted stats in tabular format: `date | username | ...stats`
    - `data_ger.csv` for opening with German MS Excel (','  comma)
    - `data.json` (__kept__) extracted data in json format

2. import updated data in `data.xslx`

## Proof of Concept

### 17.8.2021

![Spider-Charts 17.8.2021](./img/spider-2021_08_17.png)

### 27.7.2021

![Spider-Charts 27.7.2021](./img/spider-2021_07_27.png)