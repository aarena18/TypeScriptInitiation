#!/bin/bash

echo "Project compilation"

# Compiler avec TypeScript
npx tsc src/index.ts --target es2020 --module esnext --moduleResolution bundler

if [ $? -eq 0 ]; then
    echo "Compile success"
    echo "Project loading"
    echo ""
    node src/index.js
else
    echo "Error"
    exit 1
fi