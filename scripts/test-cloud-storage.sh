#!/bin/bash
$FILE="../test.txt"
curl -X POST http://localhost:3000//api/upload-file \
     -H "Content-Type: application/json" \
     -d "{
          \"pathString\": \"$FILE\"
        }"