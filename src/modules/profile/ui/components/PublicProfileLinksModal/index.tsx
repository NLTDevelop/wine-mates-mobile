import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IPublicProfileLinkItem } from '@/modules/profile/types/IPublicProfileLinkItem';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { PublicProfileLinkItem } from '@/modules/profile/ui/components/PublicProfileLinkItem';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    items: IPublicProfileLinkItem[];
    onClose: () => void;
}

export const PublicProfileLinksModal = ({ visible, items, onClose }: IProps) => {
    const { t } = useUiContext();
    const styles = useMemo(() => getStyles(), []);
    const keyExtractor = useCallback((item: IPublicProfileLinkItem) => item.id, []);
    const renderItem = useCallback<ListRenderItem<IPublicProfileLinkItem>>(
        ({ item }) => <PublicProfileLinkItem item={item} />,
        [],
    );

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('publicProfile.links')}>
            <View style={styles.container}>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    scrollEnabled={false}
                    contentContainerStyle={styles.list}
                />
            </View>
        </BottomModal>
    );
};
