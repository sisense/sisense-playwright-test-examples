export function getRandomItemsFromArray(array: any[], numberOfItems: number): any[] {
    if (numberOfItems >= array.length) {
        console.error(
            `Number of items (${numberOfItems}) is the same or bigger than in array (${array.length}) to get random items. Array will be not modified.`,
        );
        return array;
    } else {
        // Shuffle the array
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        // Get the first 'num' elements
        return shuffled.slice(0, numberOfItems);
    }
}

export function getRandomItemFromArray(array: any): any {
    const randomIndex = Math.floor(Math.random() * array.length);
    console.log('randomIndex   ' + randomIndex);
    return array[randomIndex];
}
