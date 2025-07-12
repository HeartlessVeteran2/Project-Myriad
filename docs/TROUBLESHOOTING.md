# Troubleshooting Guide

This guide provides solutions to common problems you might encounter while working with Project Myriad.

## Installation Issues

- **`npm install` fails**:
  - Ensure you have Node.js v18 or later installed.
  - Delete your `node_modules` directory and `package-lock.json` file, then run `npm install` again.
  - If you're on a Mac with an M1 chip, you may need to install Rosetta 2.

## Running the Application

- **Application doesn't start**:
  - Make sure you have a `.env` file in the `backend` directory with the required environment variables. You can use `.env.example` as a template.
  - Check that your database and Redis servers are running.
  - Look for any error messages in the console output.

## Common Errors

- **"Cannot find module..."**:
  - This usually means you need to run `npm install` in the appropriate directory (`backend`, `frontend`, or `mobile`).

- **"Connection refused..."**:
  - This indicates that the application can't connect to the database or Redis. Check that they are running and that your `.env` file is configured correctly.

## Git & GitHub

- **Merge conflicts**:
  - If you encounter a merge conflict, open the conflicting file and look for the `<<<<<<<`, `=======`, and `>>>>>>>` markers.
  - Edit the file to resolve the conflict, then `git add` the file and continue the merge or rebase.

## Further Help

If you're still having trouble, please open an issue on our [GitHub repository](https://github.com/HeartlessVeteran2/Project-Myriad/issues).
