import { IEventShareMessageData } from '../types/IEventShareMessageData';

export const prepareEventShareMessage = ({
    intro,
    labels,
    title,
    dateTime,
    meetingPlaceName,
    location,
    mapLink,
    price,
    eventType,
    tastingType,
    link,
}: IEventShareMessageData) => {
    const lines: string[] = [];

    const addRawLine = (value?: string | null) => {
        const preparedValue = value?.trim();

        if (preparedValue) {
            lines.push(preparedValue);
        }
    };

    const addFieldLine = (label: string, value?: string | null) => {
        const preparedLabel = label.trim();
        const preparedValue = value?.trim();

        if (preparedLabel && preparedValue) {
            lines.push(`${preparedLabel}: ${preparedValue}`);
        }
    };

    addRawLine(intro);
    addFieldLine(labels.title, title);
    addFieldLine(labels.dateTime, dateTime);
    addFieldLine(labels.meetingPlaceName, meetingPlaceName);
    addFieldLine(labels.location, location);
    addFieldLine(labels.mapLink, mapLink);
    addFieldLine(labels.price, price);
    addFieldLine(labels.eventType, eventType);
    addFieldLine(labels.tastingType, tastingType);
    addRawLine(link);

    return lines.join('\n');
};
