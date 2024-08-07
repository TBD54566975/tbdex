set positional-arguments := true

_help:
    @just -l

clean:
    #!/usr/bin/env bash
    find hosted -type f -name "*.tmp" -delete

format: lint
    #!/usr/bin/env bash
    find hosted -type f -name "*.json" | while read file; do
      jq --indent 2 . $file > $file.json.tmp
      mv $file.json.tmp $file
      printf "formatted: %s\n" $file
    done

lint: clean
    #!/usr/bin/env bash
    if ! command -v jq &> /dev/null; then
      echo "jq is not installed. Please install jq to format JSON files"
      exit 1
    fi

    find hosted -type f -name "*.json" | while read file; do
      if ! jq empty $file > /dev/null; then
        printf "[error] %s is not a valid JSON file\n\n" $file
        exit 1
      fi
    done
    echo "[success] All JSON files are valid"

schemas: lint
    #!/usr/bin/env bash
    set -euo pipefail

    source_dir="hosted/json-schemas"
    dest_dir=".schemas"

    rm -rf $dest_dir
    mkdir -p $dest_dir
    cp -vR $source_dir/* $dest_dir/
    echo "Schema files successfully copied to $dest_dir/"
