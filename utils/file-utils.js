// File system utility functions
// Shared utilities for file operations across the Bosser project

const fs = require('fs');

/**
 * Ensure directory exists, create if it doesn't
 * Used by: multiple scripts throughout the project
 */
function ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Ensure multiple directories exist
 * Used by: scripts that need to create several directories at once
 */
function ensureDirectories(dirPaths) {
    dirPaths.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

/**
 * Check if file exists
 * Simple wrapper for consistency
 */
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

module.exports = {
    ensureDirectory,
    ensureDirectories,
    fileExists
};