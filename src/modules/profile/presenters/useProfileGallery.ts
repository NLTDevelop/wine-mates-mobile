import { useCallback, useMemo, useState } from 'react';
import { IProfileGalleryItem, IProfileGalleryPhoto } from '../types/IProfileGalleryPhoto';

interface IProps {
    photos: IProfileGalleryPhoto[];
    onDeletePhoto?: (id: string) => void;
}

export const useProfileGallery = ({ photos, onDeletePhoto }: IProps) => {
    const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

    const onCloseViewer = useCallback(() => {
        setSelectedPhotoId(null);
    }, []);

    const items = useMemo<IProfileGalleryItem[]>(() => {
        return photos.map(photo => ({
            ...photo,
            onPress: () => {
                setSelectedPhotoId(photo.id);
            },
            onDelete: onDeletePhoto
                ? () => {
                      onDeletePhoto(photo.id);
                  }
                : undefined,
        }));
    }, [onDeletePhoto, photos]);

    const selectedPhotoIndex = useMemo(() => {
        const index = items.findIndex(item => item.id === selectedPhotoId);

        return index >= 0 ? index : 0;
    }, [items, selectedPhotoId]);

    return {
        items,
        hasPhotos: items.length > 0,
        selectedPhotoIndex,
        viewerKey: selectedPhotoId || 'profile-gallery-viewer',
        isViewerVisible: !!selectedPhotoId,
        onCloseViewer,
    };
};
