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
  cat data.json | \
    # remote last array entry "[OATZ] RLT History" (by only keeping each days stats)
    jq ".[] | select(.name | match(\"RLT-\") )" | \
    # ... and wrap these loose JSON objects into a JSON array
    jq -s "." | \
    # get tabular format, by repeating the name (containing the date) for each player
    jq -r '.[] | .name as $n | .players[] | 
          [ $n, .name,
            .score.total.value, .score.avg.value,
            .goals.total.value, .goals.avg.value,
            .assists.total.value, .assists.avg.value,
            .saves.total.value, .saves.avg.value,
            .shots.total.value, .shots.avg.value,
            .speed.avg.value
          ] | @tsv' |\
    # replace "RLT-{year}-{month}-{day}" with the date
    sed 's/RLT-//'
) | tr '\t' ';' > data.csv
cat data.csv | sed 's|;\([0-9]*\)\.\([0-9]*\)|;\1,\2|g' > data_ger.csv