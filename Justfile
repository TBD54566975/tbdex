set positional-arguments := true

_help:
    @just -l

clean: install_hooks
    #!/usr/bin/env bash
    find hosted -type f -name "*.tmp" -delete

install_hooks:
    #!/usr/bin/env bash
    cp hooks/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit

format: lint
    #!/usr/bin/env bash
    find hosted -type f -name "*.json" | while read file; do
      jq --indent 2 . $file > $file.json.tmp
      if ! diff --brief $file $file.json.tmp > /dev/null; then
        mv $file.json.tmp $file
        printf "formatted: %s\n" $file
      else
        rm $file.json.tmp
      fi
    done

lint: clean
    #!/usr/bin/env bash
    if ! command -v jq &> /dev/null; then
      echo "jq is not installed. Please install jq to format JSON files"
      exit 1
    fi

    no_errors_found=true
    for file in $(find hosted -type f -name "*.json"); do
      if ! jq empty $file > /dev/null; then
        printf "[error] %s is not a valid JSON file\n\n" $file
        no_errors_found=false
      fi
    done

    if [ "$no_errors_found" = true ]; then
      echo "[success] All JSON files are valid"
    else
      exit 1
    fi

schemas: lint
    #!/usr/bin/env bash
    set -euo pipefail

    source_dir="hosted/json-schemas"
    dest_dir=".schemas"

    rm -rf $dest_dir
    mkdir -p $dest_dir
    cp -vR $source_dir/* $dest_dir/
    echo "Schema files successfully copied to $dest_dir/"
