/**
 * Gets current date in format 'YYYY-MM-DD'
 */
export function getCurrentDate(): string {
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: string = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1, because months begin from 0
    const day: string = currentDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Sleeps test execution on 'seconds' time
 * Do not use it for wait of UI elements
 * @param seconds   - amount in seconds to sleep
 * @param reason    - add reason for sleep trigger (will be added to console output)
 */
export async function sleep(seconds: number, reason?: string): Promise<void> {
    console.log(`Waiting '${seconds}' seconds... ${reason}`);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    console.log(`Waiting done.`);
}