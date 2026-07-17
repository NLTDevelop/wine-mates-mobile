import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { WineListItem } from '@/UIKit/WineListItem';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { WineShareModal } from '@/UIKit/WineShareModal';
import { useWineShareModal } from '@/UIKit/WineShareModal/presenters/useWineShareModal';
import { Button } from '@/UIKit/Button';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { useMyWineryWines } from './presenters/useMyWineryWines';
import { getStyles } from './styles';

export const MyWineryWinesView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { data, isLoading, onPressBack, onItemPress, onAddWinePress } = useMyWineryWines();
    const { isShareModalVisible, onOpenShareModal, onCloseShareModal, onShareMessengerPress, onCopyWineLinkPress } =
        useWineShareModal();

    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);

    const renderItem = useCallback<ListRenderItem<IWineListItem>>(
        ({ item }) => {
            return <WineListItem item={item} onPress={onItemPress} onSharePress={onOpenShareModal} />;
        },
        [onItemPress, onOpenShareModal],
    );

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('profile.myWineryWines')} onPressBack={onPressBack} isCentered/>}
        >
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                style={styles.list}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyListView
                        isLoading={isLoading}
                        image={<EmptyWineListIcon />}
                        text={t('profile.noWineryWines')}
                    />
                }
            />
            <Button
                text={t('profile.addWineToWinery')}
                onPress={onAddWinePress}
                LeftAccessory={
                    <View style={styles.plusIconContainer}>
                        <PlusIcon />
                    </View>
                }
                containerStyle={styles.button}
            />
            <WineShareModal
                visible={isShareModalVisible}
                onClose={onCloseShareModal}
                onShareMessengerPress={onShareMessengerPress}
                onCopyLinkPress={onCopyWineLinkPress}
            />
        </ScreenContainer>
    );
};
