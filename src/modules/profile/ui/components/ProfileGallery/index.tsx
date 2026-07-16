import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Modal, TouchableOpacity, View } from 'react-native';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IProfileGalleryItem } from '@/modules/profile/types/IProfileGalleryPhoto';
import { getStyles } from './styles';
import { useProfileGalleryLayout } from './presenters/useProfileGalleryLayout';
import { GalleryPhoto } from './components/GalleryPhoto';
import { GalleryViewerPhoto } from './components/GalleryViewerPhoto';

interface IProps {
    items: IProfileGalleryItem[];
    hasPhotos: boolean;
    selectedPhotoIndex: number;
    viewerKey: string;
    isViewerVisible: boolean;
    onCloseViewer: () => void;
    onAddPhoto?: () => void;
}

export const ProfileGallery = ({
    items,
    hasPhotos,
    selectedPhotoIndex,
    viewerKey,
    isViewerVisible,
    onCloseViewer,
    onAddPhoto,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { viewerWidth, viewerPhotoStyle, closeViewerButtonInsetStyle } = useProfileGalleryLayout();

    const renderItem = useCallback<ListRenderItem<IProfileGalleryItem>>(({ item }) => {
        return <GalleryPhoto {...item} />;
    }, []);

    const keyExtractor = useCallback((item: IProfileGalleryItem) => item.id, []);

    const renderViewerItem = useCallback<ListRenderItem<IProfileGalleryItem>>(
        ({ item }) => {
            return <GalleryViewerPhoto item={item} containerStyle={viewerPhotoStyle} />;
        },
        [viewerPhotoStyle],
    );

    const getViewerItemLayout = useCallback(
        (_data: ArrayLike<IProfileGalleryItem> | null | undefined, index: number) => {
            return {
                length: viewerWidth,
                offset: viewerWidth * index,
                index,
            };
        },
        [viewerWidth],
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography text={t('settings.photoGallery')} variant="body_500" style={styles.title} />
                {!!onAddPhoto && (
                    <TouchableOpacity onPress={onAddPhoto} style={styles.addButton}>
                        <Typography text={t('settings.addPhoto')} variant="subtitle_12_500" style={styles.addButtonText} />
                    </TouchableOpacity>
                )}
            </View>
            {hasPhotos && (
                <FlatList
                    horizontal
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContent}
                    showsHorizontalScrollIndicator={false}
                />
            )}
            <Modal
                visible={isViewerVisible}
                animationType="fade"
                statusBarTranslucent
                onRequestClose={onCloseViewer}
            >
                <View style={styles.viewer}>
                    <FlatList
                        key={viewerKey}
                        style={styles.viewerList}
                        horizontal
                        pagingEnabled
                        data={items}
                        renderItem={renderViewerItem}
                        keyExtractor={keyExtractor}
                        initialScrollIndex={selectedPhotoIndex}
                        getItemLayout={getViewerItemLayout}
                        showsHorizontalScrollIndicator={false}
                    />
                    <TouchableOpacity
                        onPress={onCloseViewer}
                        style={[styles.closeViewerButton, closeViewerButtonInsetStyle]}
                        hitSlop={12}
                    >
                        <CrossIcon color={colors.icon_inverted} width={20} height={20} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};
