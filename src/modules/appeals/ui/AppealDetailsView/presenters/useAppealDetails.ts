import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { appealsService } from '@/entities/appeals/AppealsService';
import { AppealStatus } from '@/entities/appeals/enums/AppealStatus';
import { IAppeal } from '@/entities/appeals/types/IAppeal';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useGallery } from '@/UIKit/Gallery/presenters/useGallery';
import { getAppealGalleryPhotos } from '@/modules/appeals/utils/appealPhoto';

const formatAppealDate = (value: string | undefined, locale: string) => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'uk-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const useAppealDetails = (locale: string) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const { appealId } = route.params as { appealId: number };
    const [appeal, setAppeal] = useState<IAppeal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getAppeal = useCallback(async () => {
        try {
            const response = await appealsService.get(appealId);

            if (response.isError || !response.data) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
                return;
            }

            setAppeal(response.data);
        } catch {
            toastService.showError(localization.t('common.errorHappened'));
        }
    }, [appealId]);

    const loadAppeal = useCallback(async () => {
        setIsLoading(true);
        await getAppeal();
        setIsLoading(false);
    }, [getAppeal]);

    const onRefresh = useCallback(async () => {
        await getAppeal();
    }, [getAppeal]);

    useFocusEffect(
        useCallback(() => {
            loadAppeal();
        }, [loadAppeal]),
    );

    const isEditable = appeal?.status === AppealStatus.OPEN;
    const statusLabel = appeal ? localization.t(`appeals.status.${appeal.status}`, { locale }) : '';
    const createdAt = formatAppealDate(appeal?.createdAt, locale);
    const closedAt = formatAppealDate(appeal?.closedAt || undefined, locale);
    const description = appeal?.description || localization.t('appeals.notSpecified', { locale });
    const adminComment = appeal?.adminComment || '';
    const hasAdminComment = !!adminComment;
    const hasClosedAt = !!closedAt;
    const isDescriptionLast = !hasAdminComment;
    const photos = useMemo(() => getAppealGalleryPhotos(appeal?.photos || []), [appeal?.photos]);
    const gallery = useGallery({ photos });

    const onEditPress = useCallback(() => {
        if (!appeal || appeal.status !== AppealStatus.OPEN) {
            return;
        }

        navigation.navigate('CreateAppealView', { appeal });
    }, [appeal, navigation]);

    const onShowDelete = useCallback(() => {
        if (appeal?.status === AppealStatus.OPEN) {
            setIsDeleteVisible(true);
        }
    }, [appeal?.status]);

    const onHideDelete = useCallback(() => {
        if (!isDeleting) {
            setIsDeleteVisible(false);
        }
    }, [isDeleting]);

    const onDeletePress = useCallback(async () => {
        if (!appeal || isDeleting || appeal.status !== AppealStatus.OPEN) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await appealsService.delete(appeal.id);

            if (response.isError) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
                return;
            }

            setIsDeleteVisible(false);
            toastService.showSuccess(localization.t('common.success'), localization.t('appeals.deleted'));
            navigation.goBack();
        } finally {
            setIsDeleting(false);
        }
    }, [appeal, isDeleting, navigation]);

    return {
        appeal,
        isLoading,
        isEditable,
        statusLabel,
        createdAt,
        closedAt,
        description,
        adminComment,
        hasAdminComment,
        hasClosedAt,
        isDescriptionLast,
        gallery,
        isDeleteVisible,
        isDeleting,
        onRefresh,
        onEditPress,
        onShowDelete,
        onHideDelete,
        onDeletePress,
    };
};
