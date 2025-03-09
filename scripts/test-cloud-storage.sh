#!/bin/bash
FILE="/Users/noahgross/train/trainapi/test.txt"
curl -X POST http://localhost:3000/api/upload-file \
     -H "Content-Type: application/json" \
     -d "{\"pathString\":\"$FILE\"}"