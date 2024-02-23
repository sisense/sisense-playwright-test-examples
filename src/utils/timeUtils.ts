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