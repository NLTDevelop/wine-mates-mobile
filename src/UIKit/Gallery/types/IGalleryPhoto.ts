export interface IGalleryFile {
    uri: string;
    name: string;
    type: string;
}

export interface IGalleryPhoto {
    id: string;
    uri: string;
    fileId?: number;
    file?: IGalleryFile;
}

export interface IGalleryItem extends IGalleryPhoto {
    onPress: () => void;
    onDelete?: () => void;
}
