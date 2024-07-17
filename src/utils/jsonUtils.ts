import fs from 'fs';

/**
 * Gets json from the file
 * @param filePath - Path to file
 * @returns parsed json object of the file content
 */
export const getJsonFromFile = function (filePath: string) {
    try {
        // Read the file contents synchronously
        const fileContents = fs.readFileSync(filePath, 'utf-8');

        // Parse the JSON object from the file contents
        return JSON.parse(fileContents, (key, value) => {
            return value;
        });
    } catch (error) {
        throw new Error(`Failed to read JSON from file: ${error}`);
    }
};