import { IWineShareMessageData } from '../types/IWineShareMessageData';

export const prepareWineShareMessage = ({
    intro,
    labels,
    title,
    producer,
    grapeVariety,
    country,
    region,
    type,
    link,
}: IWineShareMessageData) => {
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
    addFieldLine(labels.producer, producer);
    addFieldLine(labels.grapeVariety, grapeVariety);
    addFieldLine(labels.country, country);
    addFieldLine(labels.region, region);
    addFieldLine(labels.type, type);
    addRawLine(link);

    return lines.join('\n');
};
