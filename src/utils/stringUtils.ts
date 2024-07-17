import * as generatePassword from 'generate-password-ts';

export const generateUserPassword = function (): string {
    return generateString();
};

export const generateEmail = function (): string {
    return generateString(false) + "@sisense.com";
};

function generateString(isSymbols: boolean = true, length: number = 11, exclude: string = "\\ ' ? \"") {
    return generatePassword.generate({
        length: length,
        exclude: exclude,
        numbers: true,
        symbols: isSymbols,
        uppercase: true,
        lowercase: true,
        excludeSimilarCharacters: true,
        strict: true
    });
}