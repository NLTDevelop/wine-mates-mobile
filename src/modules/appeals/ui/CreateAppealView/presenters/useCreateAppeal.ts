import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { appealsService } from '@/entities/appeals/AppealsService';
import { IAppeal } from '@/entities/appeals/types/IAppeal';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';
import { IGalleryPhoto } from '@/UIKit/Gallery/types/IGalleryPhoto';
import { getAppealGalleryPhotos } from '@/modules/appeals/utils/appealPhoto';

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE_BYTES = 50 * 1024 * 1024;

export const useCreateAppeal = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const params = route.params as { appeal?: IAppeal } | undefined;
    const appeal = params?.appeal;
    const isEditing = !!appeal;
    const initialSubject = appeal?.subject || '';
    const initialDescription = appeal?.description || '';
    const [subject, setSubject] = useState(initialSubject);
    const [description, setDescription] = useState(initialDescription);
    const [photos, setPhotos] = useState<IGalleryPhoto[]>(() => getAppealGalleryPhotos(appeal?.photos || []));
    const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const onSubjectChange = useCallback((value: string) => {
        setSubject(value);
    }, []);

    const onDescriptionChange = useCallback((value: string) => {
        setDescription(value);
    }, []);

    const onAddPhotoPress = useCallback(() => {
        const remainingPhotoSlots = MAX_PHOTOS - photos.length;

        if (remainingPhotoSlots <= 0) {
            return;
        }

        launchImageLibrary({ mediaType: 'photo', selectionLimit: remainingPhotoSlots, quality: 1 }, response => {
            if (response.didCancel || response.errorCode) {
                return;
            }

            const timestamp = Date.now();
            const selectedPhotos = (response.assets || [])
                .slice(0, remainingPhotoSlots)
                .reduce<IGalleryPhoto[]>((galleryPhotos, asset, index) => {
                    if (!asset.uri) {
                        return galleryPhotos;
                    }

                    if (asset.fileSize && asset.fileSize > MAX_PHOTO_SIZE_BYTES) {
                        toastService.showError(
                            localization.t('common.errorHappened'),
                            localization.t('appeals.photoTooLarge'),
                        );
                        return galleryPhotos;
                    }

                    const uri = asset.uri.startsWith('file://') ? asset.uri : `file://${asset.uri}`;
                    galleryPhotos.push({
                        id: `local-appeal-photo-${timestamp}-${index}`,
                        uri,
                        file: {
                            uri,
                            name: asset.fileName || `appeal-photo-${timestamp}-${index}.jpg`,
                            type: asset.type || 'image/jpeg',
                        },
                    });

                    return galleryPhotos;
                }, []);

            setPhotos(currentPhotos => [...currentPhotos, ...selectedPhotos].slice(0, MAX_PHOTOS));
        });
    }, [photos.length]);

    const onDeletePhoto = useCallback(
        (id: string) => {
            const photo = photos.find(item => item.id === id);

            if (typeof photo?.fileId === 'number') {
                setDeletedPhotoIds(currentIds => [...new Set([...currentIds, photo.fileId as number])]);
            }

            setPhotos(currentPhotos => currentPhotos.filter(item => item.id !== id));
        },
        [photos],
    );

    const gallery = useGallery({ photos, onDeletePhoto });
    const newPhotos = useMemo(() => {
        return photos.reduce<NonNullable<IGalleryPhoto['file']>[]>((files, photo) => {
            if (photo.file) {
                files.push(photo.file);
            }

            return files;
        }, []);
    }, [photos]);
    const hasChanges =
        subject.trim() !== initialSubject.trim() ||
        description.trim() !== initialDescription.trim() ||
        newPhotos.length > 0 ||
        deletedPhotoIds.length > 0;
    const isSubmitDisabled = !subject.trim() || isLoading || (isEditing && !hasChanges);
    const onAddPhoto = photos.length < MAX_PHOTOS ? onAddPhotoPress : undefined;

    const onSubmitPress = useCallback(async () => {
        const trimmedSubject = subject.trim();
        const trimmedDescription = description.trim();

        if (!trimmedSubject || isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();

            if (!isEditing || trimmedSubject !== initialSubject.trim()) {
                formData.append('subject', trimmedSubject);
            }

            if (!isEditing || trimmedDescription !== initialDescription.trim()) {
                formData.append('description', trimmedDescription);
            }

            newPhotos.forEach(photo => {
                formData.append('photos', photo as any);
            });
            deletedPhotoIds.forEach(photoId => {
                formData.append('deletedPhotoIds', String(photoId));
            });

            const response =
                isEditing && appeal
                    ? await appealsService.update(appeal.id, formData)
                    : await appealsService.create(formData);

            if (response.isError || !response.data) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
                return;
            }

            toastService.showSuccess(
                localization.t('common.success'),
                localization.t(isEditing ? 'appeals.updated' : 'appeals.created'),
            );
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    }, [
        appeal,
        deletedPhotoIds,
        description,
        initialDescription,
        initialSubject,
        isEditing,
        isLoading,
        navigation,
        newPhotos,
        subject,
    ]);

    return {
        isEditing,
        subject,
        description,
        gallery,
        onAddPhoto,
        isLoading,
        isSubmitDisabled,
        onSubjectChange,
        onDescriptionChange,
        onSubmitPress,
    };
};
