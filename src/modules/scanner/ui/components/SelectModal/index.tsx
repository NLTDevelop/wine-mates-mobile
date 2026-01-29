import { Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';
import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { FlatList } from 'react-native-gesture-handler';
import { IAroma } from '@/entities/wine/types/IWineSmell';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { SmellListItem } from '../SmellListItem';

type SelectableItem = IAroma | IWineTaste;

interface IProps {
    isVisible: boolean;
    onHide: () => void;
    onItemPress: (item: SelectableItem, subgroupId?: number | null, groupId?: number | null) => void;
    data: SelectableItem[];
    subgroupId?: number | null;
    groupId?: number | null;
}

export const SelectModal = ({ isVisible, onHide, onItemPress, data, subgroupId, groupId }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: SelectableItem, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: SelectableItem }) => <SmellListItem item={item} onPress={() => onItemPress(item, subgroupId, groupId)} />,
    [groupId, onItemPress, subgroupId]);

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
                <FlatList
                    data={data}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    style={styles.list}
                    contentContainerStyle={styles.contentContainer}
                />
            </View>
        </Modal>
    );
};
