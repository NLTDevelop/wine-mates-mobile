import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Modal, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IGalleryItem } from './types/IGalleryPhoto';
import { getStyles } from './styles';
import { useGalleryLayout } from './presenters/useGalleryLayout';
import { GalleryPhoto } from './components/GalleryPhoto';
import { GalleryViewerPhoto } from './components/GalleryViewerPhoto';

interface IProps {
    title: string;
    items: IGalleryItem[];
    hasPhotos: boolean;
    selectedPhotoIndex: number;
    viewerKey: string;
    isViewerVisible: boolean;
    onCloseViewer: () => void;
    onAddPhoto?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    photoStyle?: StyleProp<ViewStyle>;
    hideHeader?: boolean;
    hidePreview?: boolean;
}

export const Gallery = ({
    title,
    items,
    hasPhotos,
    selectedPhotoIndex,
    viewerKey,
    isViewerVisible,
    onCloseViewer,
    onAddPhoto,
    containerStyle,
    photoStyle,
    hideHeader = false,
    hidePreview = false,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { viewerWidth, viewerPhotoStyle, closeViewerButtonInsetStyle } = useGalleryLayout();

    const renderItem = useCallback<ListRenderItem<IGalleryItem>>(
        ({ item }) => {
            return <GalleryPhoto {...item} photoStyle={photoStyle} />;
        },
        [photoStyle],
    );

    const keyExtractor = useCallback((item: IGalleryItem) => item.id, []);

    const renderViewerItem = useCallback<ListRenderItem<IGalleryItem>>(
        ({ item }) => {
            return <GalleryViewerPhoto item={item} containerStyle={viewerPhotoStyle} />;
        },
        [viewerPhotoStyle],
    );

    const getViewerItemLayout = useCallback(
        (_data: ArrayLike<IGalleryItem> | null | undefined, index: number) => {
            return {
                length: viewerWidth,
                offset: viewerWidth * index,
                index,
            };
        },
        [viewerWidth],
    );

    return (
        <View style={[styles.container, hideHeader && hidePreview && styles.hiddenContainer, containerStyle]}>
            {!hideHeader && (
                <View style={styles.header}>
                    <Typography text={title} variant="body_500" style={styles.title} />
                    {!!onAddPhoto && (
                        <TouchableOpacity onPress={onAddPhoto} style={styles.addButton}>
                            <Typography
                                text={t('settings.addPhoto')}
                                variant="subtitle_12_500"
                                style={styles.addButtonText}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {hasPhotos && !hidePreview && (
                <FlatList
                    horizontal
                    directionalLockEnabled
                    alwaysBounceVertical={false}
                    style={styles.list}
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={hideHeader ? styles.listContentWithoutHeader : styles.listContent}
                    showsHorizontalScrollIndicator={false}
                />
            )}
            <Modal visible={isViewerVisible} animationType="fade" statusBarTranslucent onRequestClose={onCloseViewer}>
                <View style={styles.viewer}>
                    <FlatList
                        key={viewerKey}
                        style={styles.viewerList}
                        horizontal
                        directionalLockEnabled
                        alwaysBounceVertical={false}
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
