import https from 'https';
import fs from 'fs';
import { envConfig } from '@config/env.config';
import { getFileExtension } from '@utils/fileUtils';
import { fileExtensions } from '@constants/fileExtension';
import path from 'path';

/**
 * Gets Artifactory File Path
 * @param artifactoryUrl - URL of the artifactory
 * @param version       - Sisense version
 * @param filename      - file name that is used to get its Path
 * @returns             - path of the file in the artifactory (string)
 */
function getArtifactoryFilePath(artifactoryUrl: string, version: string, filename: string) {
    const fileExtension = getFileExtension(filename);

    if (!fileExtension || !fileExtensions.includes(fileExtension))
        throw new Error(
            `'${fileExtension}' file extension is not allowed. Please add it in to allowed one and check existence of file on Artifactory`,
        );

    return `${artifactoryUrl}/${version}/${fileExtension}/${filename}`;
}

/**
 * Downloads the file with user credentials
 * @param username
 * @param password
 * @param url
 * @param destination
 */
function downloadFile(
    username: string,
    password: string,
    url: string,
    destination: string,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Create an HTTP request options object
        const options = {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'), // Set the Authorization header with username and password
            },
        };

        const request = https.get(url, options, (response) => {
            // Check the status code
            if (response.statusCode !== 200) {
                reject(
                    `File download failed with status code: ${response.statusCode}: ${response.statusMessage}`,
                );
                return;
            }
            // Create a writable stream to the destination file
            const fileStream = fs.createWriteStream(destination);

            // Pipe the response stream to the file stream to download the file
            response.pipe(fileStream);

            // When the file download is complete, resolve the promise
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
        });

        // Handle errors during the download process
        request.on('error', (err) => {
            reject(`Error during the download process: ${err}`);
        });
    });
}

/**
 * Downloads the file from Artifactory
 * @param filename - file name to download
 * @param version - version on artifactory
 * @param targetDir - directory to download
 */
export const downloadFileFromArtifactory = async function (
    filename: string,
    version = envConfig.releaseBranch,
    targetDir = envConfig.localArtifactsDirectory,
): Promise<void> {
    // Set the URL and path to the file in Artifactory
    const artifactoryUrl = getArtifactoryFilePath(
        envConfig.getArtifactoryRepository(),
        version,
        filename,
    );
    const username = envConfig.artifactoryUserName;
    const password = envConfig.artifactoryPassword;
    const downloadPath = path.join(targetDir, filename);

    try {
        await downloadFile(username, password, artifactoryUrl, downloadPath);
        console.log(`File downloaded: '${downloadPath}' from '${artifactoryUrl}'`);

        // Further processing of the downloaded file can be done here
    } catch (error) {
        throw new Error(
            `Error downloading file: '${downloadPath}' from '${artifactoryUrl}': ${error} `,
        );
    }
};
