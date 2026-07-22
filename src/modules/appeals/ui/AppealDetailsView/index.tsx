import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Loader } from '@/UIKit/Loader';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { DeleteForeverIcon } from '@assets/icons/DeleteForeverIcon';
import { EditIcon } from '@assets/icons/EditIcon';
import { Gallery } from '@/UIKit/Gallery';
import { useRefresh } from '@/hooks/useRefresh';
import { AppealDetailsField } from './components/AppealDetailsField';
import { DeleteAppealAlert } from './components/DeleteAppealAlert';
import { useAppealDetails } from './presenters/useAppealDetails';
import { getStyles } from './styles';

export const AppealDetailsView = () => {
    const { colors, locale, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
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
        onEditPress,
        onShowDelete,
        onHideDelete,
        onDeletePress,
        onRefresh,
    } = useAppealDetails(locale);
    const { refreshControl } = useRefresh(onRefresh);

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
            refreshControl={refreshControl}
            headerComponent={<HeaderWithBackButton title={t('appeals.detailsTitle')} isCentered />}
            contentContainerStyle={styles.scrollContent}
        >
            {isLoading ? (
                <Loader />
            ) : appeal ? (
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.titleRow}>
                            <Typography text={appeal.subject} variant="h4" style={styles.subject} />
                            <View style={styles.status}>
                                <Typography text={statusLabel} variant="subtitle_12_500" style={styles.statusText} />
                            </View>
                        </View>
                        <AppealDetailsField label={t('appeals.createdAt')} value={createdAt} />
                        {hasClosedAt && <AppealDetailsField label={t('appeals.closedAt')} value={closedAt} />}
                        <AppealDetailsField
                            label={t('appeals.description')}
                            value={description}
                            isLast={isDescriptionLast}
                        />
                        {hasAdminComment && (
                            <AppealDetailsField
                                label={t('appeals.adminComment')}
                                value={adminComment}
                                isLast
                            />
                        )}
                    </View>
                    {gallery.hasPhotos && <Gallery title={t('appeals.attachments')} {...gallery} />}
                    {isEditable && (
                        <View style={styles.actions}>
                            <Button
                                text={t('appeals.edit')}
                                onPress={onEditPress}
                                type="secondary"
                                containerStyle={styles.actionButton}
                                LeftAccessory={<EditIcon color={colors.primary} />}
                            />
                            <Button
                                text={t('appeals.delete')}
                                onPress={onShowDelete}
                                type="secondary"
                                containerStyle={styles.actionButton}
                                textStyle={styles.deleteText}
                                LeftAccessory={<DeleteForeverIcon color={colors.error} />}
                            />
                        </View>
                    )}
                </View>
            ) : null}
            <DeleteAppealAlert
                visible={isDeleteVisible}
                isLoading={isDeleting}
                onClose={onHideDelete}
                onConfirm={onDeletePress}
            />
        </ScreenContainer>
    );
};
