#!/bin/bash

# Path to your repository and files
repo_path="~/site/ultravioleta"
html_file="$repo_path/index.html"
js_file="$repo_path/script.js"

# Function to update version in HTML file
# Function to update version in HTML file
update_version() {
    version=$(date +%s) # Using Unix timestamp for versioning
    sed -i.bak "s/script.js?v=[^&\"]*/script.js?v=$version/g" "$html_file" # Update version
}

# Change to your repository's directory
cd $repo_path

# Update version in HTML file
update_version

# Add all changed files to the staging area
git add .

# Commit the changes with a message
echo "Enter commit message:"
read commitMessage
git commit -m "$commitMessage"

# Push the changes to the remote repository
git push origin main

echo "Changes pushed to GitHub."

