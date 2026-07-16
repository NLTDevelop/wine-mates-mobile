import { userModel } from '@/entities/users/UserModel';
import { IMedia } from '@/entities/media/types/IMedia';
import { IProfileGalleryPhoto } from '../types/IProfileGalleryPhoto';
import { PROFILE_GALLERY_MAX_PHOTOS } from '../constants/profileGallery';

const getMediaUri = (media: IMedia) => {
    return media.originalUrl || media.mediumUrl || media.smallUrl;
};

export const getProfileGalleryPhotos = (): IProfileGalleryPhoto[] => {
    const wineryGallery = userModel.winery?.gallery || [];
    const userGallery = userModel.user?.gallery || [];
    const gallery = userModel.winery ? wineryGallery : userGallery;

    return gallery.slice(0, PROFILE_GALLERY_MAX_PHOTOS).reduce<IProfileGalleryPhoto[]>((photos, media, index) => {
        const uri = getMediaUri(media);
        if (!uri) {
            return photos;
        }

        photos.push({
            id:
                typeof media.id === 'number'
                    ? `gallery-file-${media.id}`
                    : `${media.name || media.originalName || uri}-${index}`,
            uri,
            fileId: media.id,
        });

        return photos;
    }, []);
};
