import type { Event } from "~/data/models/EventModels";
import type { Venue } from "~/data/models/VenueModels";

/**
 * Generates an iCalendar (.ics) file content from an Event instance
 * @param event The event to convert to calendar format
 * @returns A string containing the iCalendar file content
 */
function generateCalendarFile(event: Event, venues: Venue[]): string {
    // Format dates according to iCalendar format (YYYYMMDDTHHMMSSZ)
    const formatDate = (date: Date): string => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+/g, '');
    };

    // Escape special characters in text fields
    const escapeText = (text: string): string => {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n');
    };

    // Build the venue/location string
    const location = event.venues.map(venue => 
        venue.name || 'Unnamed Venue'
    ).join(', ');

    // Create description including event details
    let description = escapeText(event.body || '');

    // Add external link if available
    if (event.externalLink) {
        description += `\\n\\nMore info: ${event.externalLink}`;
    }

    // Build the iCalendar content
    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ACME//Event Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${event.id}`,
        `DTSTAMP:${formatDate(event.createdAt)}`,
        `DTSTART:${formatDate(event.startTime)}`,
        `DTEND:${formatDate(event.stopTime)}`,
        `SUMMARY:Olympsis: ${escapeText(event.title)}`,
        `ATTACH;FMTTYPE=image/jpeg:${generateImageURL(event.mediaURL)}`,
        `URL:https://www.olympsis.com/events/${event.id}`,
        `DESCRIPTION:${description}`
    ];

    // Add location if venues are specified
    if (location) {
        icsContent.push(`LOCATION:${escapeText(location)}`);
    }

    // Add URL if available
    if (event.externalLink) {
        icsContent.push(`URL:${event.externalLink}`);
    }

    // Add first venue location
    if (venues.length > 0) {
        const venue = venues.at(0);
        const coordinates = venue?.location?.coordinates;
        if (coordinates) {
            icsContent.push(`GEO:${coordinates.at(1)};${coordinates.at(0)}`);

            // Add Apple-specific structured location for better map display
            const appleLoc = `X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=${escapeText(location)};` +
                `X-APPLE-RADIUS=100;X-TITLE=${escapeText(venue.name || 'Event Location')}:geo:${coordinates.at(1)},${coordinates.at(0)}`;
            icsContent.push(appleLoc);
        }
    }

    // Add a 30-minute reminder
    icsContent.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: ' + escapeText(event.title),
        'TRIGGER:-PT30M',  // 30 minutes before the event
        'END:VALARM'
    );

    // Close the event and calendar
    icsContent.push('END:VEVENT');
    icsContent.push('END:VCALENDAR');

    return icsContent.join('\r\n');
}


export {
    generateCalendarFile
}