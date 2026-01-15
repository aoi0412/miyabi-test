#!/bin/bash

# Fix React imports in all TSX files
find src -name "*.tsx" -type f -exec sed -i '' \
  -e "s/^import React,/import/" \
  -e "s/import React from 'react';//" \
  {} \;

# Fix type imports
find src -name "*.ts" -name "*.tsx" -type f -exec sed -i '' \
  -e "s/import { \(ReactNode\) }/import type { \1 }/g" \
  {} \;
