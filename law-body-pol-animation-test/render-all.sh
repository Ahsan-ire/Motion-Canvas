#!/bin/bash

# Define scenes to render
SCENES=("customScene" "legislativeGap" "costBenefit" "interventionRates")

# Render each scene
for scene in "${SCENES[@]}"; do
  echo "Rendering $scene..."
  node render.js --scene=$scene
  echo "$scene rendered successfully!"
  echo ""
done

echo "All scenes rendered! Videos are available in the output directory." 