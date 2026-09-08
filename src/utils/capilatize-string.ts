export default function capitalizeString(text: string) {
    const firstLetter = text.slice(0, 1).toUpperCase();
    
    return `${firstLetter}${text.slice(1)}`;
}