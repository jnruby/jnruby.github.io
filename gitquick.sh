#!/bin/bash

# Add all changed files to the staging area
git add .

# Commit the changes with a message
echo "Enter commit message:"
read commitMessage
git commit -m "$commitMessage"

# Push the changes to the remote repository
git push origin main

echo "Changes pushed to GitHub."

