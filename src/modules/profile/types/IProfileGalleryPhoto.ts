export interface IProfileGalleryFile {
    uri: string;
    name: string;
    type: string;
}

export interface IProfileGalleryPhoto {
    id: string;
    uri: string;
    fileId?: number;
    file?: IProfileGalleryFile;
}

export interface IProfileGalleryItem extends IProfileGalleryPhoto {
    onPress: () => void;
    onDelete?: () => void;
}
