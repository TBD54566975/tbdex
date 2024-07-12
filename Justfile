set positional-arguments

_help:
  @just -l

schemas:
  #!/bin/bash
  set -euo pipefail
  
  source_dir="hosted/json-schemas" 
  dest_dir=".schemas"

  mkdir -p $dest_dir
  rm -rf $dest_dir/*
  cp -R $source_dir/* $dest_dir/
  echo "Schema files successfully copied to $dest_dir/"