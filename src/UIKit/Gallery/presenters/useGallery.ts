import { useCallback, useMemo, useState } from 'react';
import { IGalleryItem, IGalleryPhoto } from '../types/IGalleryPhoto';

interface IProps {
    photos: IGalleryPhoto[];
    onDeletePhoto?: (id: string) => void;
}

export const useGallery = ({ photos, onDeletePhoto }: IProps) => {
    const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

    const onCloseViewer = useCallback(() => {
        setSelectedPhotoId(null);
    }, []);

    const items = useMemo<IGalleryItem[]>(() => {
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
        viewerKey: selectedPhotoId || 'gallery-viewer',
        isViewerVisible: !!selectedPhotoId,
        onCloseViewer,
    };
};
