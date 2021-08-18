# reload
#wget https://www.oatz.net/rocketleague/all --output-document=raw.html

# filter raw html for JSON data
# - get JSON content of script element
sed 's|^.*</head>||' raw.html | \
  sed 's|^.*<script id="__NEXT_DATA__" type="application/json">\(.*\)</script>.*$|\1|' | \
  jq '.' > data.json 

# filter raw html to collect tabular data from each table
# - only keep content of html body
sed 's|^.*<body>||' raw.html > filtered.html
sed -i 's|</body>.*$||' filtered.html
# - remove all script elements
sed -i 's|<script[ >].*</script>||g' filtered.html
# - get each day in an individual line
sed -i 's|\(<div class="container">\)|\n\1|g' filtered.html
# - remove additonal table of each day, starting with win/loss table
sed -i 's|<div class="right"><h1>TEAMS.*$||g' filtered.html
# - remove everything afer the first table of each day
sed -i 's|\(</table>\).*$|\1|' filtered.html
# - remove everything before the first table of each day
sed -i 's|^<div class="container"><div class="left">||g' filtered.html
# - only keep lines that contain headlines (and first table of each day)
grep "^<h1>" filtered.html > filtered.tmp
mv filtered.tmp filtered.html

# convert each line (table) into total table rows
# cols:
# - Date from "<h1>RLT-{Date}</h1>" in
# - user from "NAME" column
# - SCORE
# - SCORE avg
# - GOALS
# - GOALS avg
# - ASSISTS
# - ASSISTS avg
# - SAVES
# - SAVES avg
# - SHOTS
# - SHOTS avg
# - SPEED
(
  # table header
  echo "date"$'\t'"user"$'\t'\
       "score"$'\t'"score_avg"$'\t'\
       "goals"$'\t'"goals_avg"$'\t'\
       "assists"$'\t'"assists_avg"$'\t'\
       "saves"$'\t'"saves_avg"$'\t'\
       "shots"$'\t'"shots_avg"$'\t'\
       "speed" | \
       sed 's|\t |\t|g'
  # table body
  old_IFS=$IFS
  IFS=$'\n'
  for line in $(cat filtered.html); do
    # remove html table header from line
    line=$(echo $line | sed 's|<thead>.*</thead>||')
    # get title
    title=$(echo $line | sed 's|^.*<h1>\(.*\)</h1>.*$|\1|')
    table_date=$(echo $title | sed 's|^RLT-||')
    # get table body
    table_body=$(echo $line | sed 's|^.*<tbody>\(.*\)</tbody>.*$|\1|')

#    echo $table_body | sed 's|</tr>|</tr>\n|g' | wc -l
    # iterate rows (each user's results) in html table
    for row in $(echo $table_body | sed 's|</tr>|\n|g'); do
      # convert html row to columns of relevant values
      # - remove initial <tr> element
      row=$(echo $row | sed 's|^<tr>||')
      # - split into columns between <td> elements
      row=$(echo $row | sed 's|</td><td[^>]*>|\t|g')
      # - remove trailing </td>
      row=$(echo $row | sed 's|</td>$||')
      # - split into columns between <p> elements (which splits each html table field into 2 lines)
      row=$(echo $row | sed 's|</p><p[^>]*>|\t|g')
      # - remove rest of opening and closing <p> tags
      row=$(echo $row | sed 's|</p>||g' | sed 's|<p[^>]*>||g')
      # - averages are denoted with "o <!-- -->{val}", exctrat {val}
      row=$(echo $row | sed 's|\t. <!-- -->|\t|g')
      # - remove first column of RANKs
      row=$(echo $row | cut -d $'\t' -f2-)
      echo $table_date$'\t'$row
    done
  done
  IFS=$old_IFS
) | tr '\t' ';' > data.csv
cat data.csv | sed 's|;\([0-9]*\)\.\([0-9]*\)|;\1,\2|g' > data_ger.csv


