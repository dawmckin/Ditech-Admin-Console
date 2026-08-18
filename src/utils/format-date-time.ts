export default function formatDateTime(dateString: string, dateOnly: boolean = false) {
    
    return (dateString) ? 
        new Date(dateString).toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
            hour: dateOnly ? undefined : '2-digit',
            minute: dateOnly ? undefined : '2-digit',
            hour12: dateOnly ? undefined : true,
        }) : 
        "--";
}