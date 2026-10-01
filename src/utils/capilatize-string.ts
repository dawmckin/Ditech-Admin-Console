export default function capitalizeString(text: string) {
    const words = text.split(' ');
    let capitalizedWords: string[] = [];

    words.forEach(word => {
        const firstLetter = word.slice(0, 1).toUpperCase();
        capitalizedWords.push(`${firstLetter}${word.slice(1)}`);
    });
    
    return capitalizedWords.join(' ');
}