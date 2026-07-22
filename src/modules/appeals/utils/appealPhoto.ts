import { IAppealPhoto } from '@/entities/appeals/types/IAppealPhoto';
import { IGalleryPhoto } from '@/UIKit/Gallery/types/IGalleryPhoto';

export const getAppealPhotoUrl = (photo: IAppealPhoto) => {
    const photoFile = photo.file || photo;

    return photoFile.originalUrl || photoFile.mediumUrl || photoFile.smallUrl || photoFile.url || '';
};

export const getAppealGalleryPhotos = (photos: IAppealPhoto[]): IGalleryPhoto[] => {
    return photos.reduce<IGalleryPhoto[]>((galleryPhotos, photo, index) => {
        const uri = getAppealPhotoUrl(photo);

        if (!uri) {
            return galleryPhotos;
        }

        galleryPhotos.push({
            id: typeof photo.id === 'number' ? `appeal-photo-${photo.id}` : `${uri}-${index}`,
            uri,
            fileId: photo.id,
        });

        return galleryPhotos;
    }, []);
};
