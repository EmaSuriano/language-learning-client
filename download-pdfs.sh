#!/bin/bash

# Create the output directory
mkdir -p static/pdfs

# Download Spanish version (main branch)
echo "Downloading Spanish PDF..."
curl -L "https://github.com/EmaSuriano/language-learning-paper/blob/main/memoria.pdf?raw=true" -o "static/pdfs/spanish.pdf"

# Check if download was successful
if [ $? -eq 0 ]; then
  echo "✅ Successfully downloaded Spanish PDF"
else
  echo "❌ Failed to download Spanish PDF"
fi

# Download English version
echo "Downloading English PDF..."
curl -L "https://github.com/EmaSuriano/language-learning-paper/blob/english/memoria.pdf?raw=true" -o "static/pdfs/english.pdf"

# Check if download was successful
if [ $? -eq 0 ]; then
  echo "✅ Successfully downloaded English PDF"
else
  echo "❌ Failed to download English PDF"
fi

echo "All downloads completed!"