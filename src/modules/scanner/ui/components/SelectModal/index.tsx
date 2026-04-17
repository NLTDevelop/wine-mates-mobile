import { Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';
import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IAroma } from '@/entities/wine/types/IWineSmell';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { SmellListItem } from '../SmellListItem';
import { FlatListIndicator } from '@fanchenbao/react-native-scroll-indicator';
import { useSelectModalIndicator } from '../../../presenters/useSelectModalIndicator';

type SelectableItem = IAroma | IWineTaste;

interface IProps<T extends SelectableItem> {
    isVisible: boolean;
    onHide: () => void;
    onItemPress: (item: T, subgroupId?: number | null, groupId?: number | null) => number;
    data: T[];
    subgroupId?: number | null;
    groupId?: number | null;
}

export const SelectModal = <T extends SelectableItem>({
    isVisible,
    onHide,
    onItemPress,
    data,
    subgroupId,
    groupId,
}: IProps<T>) => {
    const { colors } = useUiContext();
    const { hasIndicatorOffset, onListLayout, onListScroll } = useSelectModalIndicator(data.length);
    const styles = useMemo(() => getStyles(colors, hasIndicatorOffset), [colors, hasIndicatorOffset]);

    const keyExtractor = useCallback((item: T, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: T }) => <SmellListItem item={item} onPress={() => onItemPress(item, subgroupId, groupId)} />,
        [groupId, onItemPress, subgroupId],
    );

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onHide}
            onBackButtonPress={onHide}
            backdropTransitionOutTiming={400}
            animationInTiming={400}
            animationOutTiming={400}
            backdropOpacity={0.5}
            style={styles.modal}
            deviceHeight={Dimensions.get('screen').height}
            deviceWidth={Dimensions.get('screen').width}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            statusBarTranslucent
        >
            <View style={styles.modalContent}>
                <FlatListIndicator
                    flatListProps={{
                        data,
                        keyExtractor,
                        renderItem,
                        style: styles.list,
                        contentContainerStyle: styles.contentContainer,
                        keyboardShouldPersistTaps: 'handled',
                        keyboardDismissMode: 'interactive',
                        showsVerticalScrollIndicator: true,
                        onLayout: event => onListLayout(event.nativeEvent.layout.height),
                        onScroll: onListScroll,
                    }}
                    indStyle={styles.indicator}
                />
            </View>
        </Modal>
    );
};
