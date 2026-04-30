import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { getStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetInput } from '@/UIKit/BottomSheetInput';
import { BottomModal } from '@/UIKit/BottomModal/ui';

interface IProps {
    isVisible: boolean;
    value: string;
    onChangeValue: (v: string) => void;
    onCreate: () => void;
    onClose: () => void;
    isCreating?: boolean;
}

export const CreateListBottomSheet = ({ isVisible, value, onChangeValue, onCreate, onClose, isCreating }: IProps) => {
    const { colors, t } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);

    return (
        <BottomModal visible={isVisible} onClose={onClose} title={t('savedWine.createList')}>
            <View style={styles.container}>
                <BottomSheetInput
                    value={value}
                    onChangeText={onChangeValue}
                    placeholder={t('savedWine.listName')}
                    containerStyle={styles.inputContainer}
                    onSubmitEditing={onCreate}
                    returnKeyType="done"
                />
                <Button
                    text={t('common.create')}
                    onPress={onCreate}
                    containerStyle={styles.button}
                    disabled={!value || isCreating}
                />
            </View>
        </BottomModal>
    );
};
