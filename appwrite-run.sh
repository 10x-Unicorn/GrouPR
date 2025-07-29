#!/bin/bash

set -e

# Load PROJECT_ID from .env
if [[ ! -f ".env" ]]; then
    echo "❌ .env file not found!"
    exit 1
fi

if [[ ! -f "appwrite.config.json" ]]; then
    echo "❌ appwrite.config.json not found!"
    exit 1
fi

# Extract PROJECT_ID from .env
PROJECT_ID=$(grep "^APPWRITE_PROJECT_ID=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")

if [[ -z "$PROJECT_ID" ]]; then
    echo "❌ APPWRITE_PROJECT_ID not found in .env file!"
    exit 1
fi

echo "🚀 Using PROJECT_ID: $PROJECT_ID"

# Backup original file
cp appwrite.config.json appwrite.config.json.temp

# Function to restore original file on exit
cleanup() {
    if [[ -f "appwrite.config.json.temp" ]]; then
        mv appwrite.config.json.temp appwrite.config.json
        echo "✅ Restored original appwrite.config.json"
    fi
    # Clean up the .bak file created by sed -i
    if [[ -f "appwrite.config.json.bak" ]]; then
        rm appwrite.config.json.bak
    fi
}

# Set trap to restore file on script exit (success or failure)
trap cleanup EXIT

# Temporarily substitute PROJECT_ID in the actual file
sed -i.bak "s/\${APPWRITE_PROJECT_ID}/$PROJECT_ID/g" appwrite.config.json

echo "⚡ Running: appwrite $*"
appwrite "$@"