export function TimeConverter(datetime) {
    const date = new Date(datetime);

    // Convert to IST (Indian Standard Time, UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(date.getTime() + istOffset);

    let hours = istDate.getUTCHours() % 12 || 12; // Convert 24-hour format to 12-hour
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    const amPm = istDate.getUTCHours() >= 12 ? 'PM' : 'AM';

    return `${hours}:${minutes} ${amPm}`;
}
