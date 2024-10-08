import fs from 'fs';

export const getFileExtension = (filename: string) => {
    return filename.split('.').pop();
};

export const changeFilePermission = (filePath: string, permission: string) => {
    if (fs.existsSync(filePath)) {
        fs.chmodSync(filePath, permission);
    }
};

/**
 * Creates a directory with following name
 * @param directoryPath - directory name
 */
export const createDirectoryRecursively = function (directoryPath: string) {
    // Creates the download directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Directory created: '${directoryPath}'`);
    }
};

/**
 * Removes following directory with all files in
 * @param directoryPath - directory Path
 */
export const removeDirectoryRecursively = function (directoryPath: string) {
    // Removes the download directory if it exists
    if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, { recursive: true });
        console.log(`Directory removed: '${directoryPath}'`);
    }
};