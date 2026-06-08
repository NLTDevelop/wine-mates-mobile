import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { Checkbox } from '@/UIKit/Checkbox';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerModal/types/IUniversalPickerOption';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    title: string;
    options: IUniversalPickerOption[];
    isLoading: boolean;
    isConfirming?: boolean;
    selectionMode: 'single' | 'multiple';
    emptyText: string;
    confirmText: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const UniversalPickerBottomModal = ({
    visible,
    title,
    options,
    isLoading,
    isConfirming = false,
    selectionMode,
    emptyText,
    confirmText,
    onClose,
    onConfirm,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: IUniversalPickerOption) => {
        return item.id;
    }, []);

    const renderItem = useCallback(({ item }: { item: IUniversalPickerOption }) => {
        return (
            <TouchableOpacity onPress={item.onPress} style={styles.option}>
                <View style={styles.optionTextContainer}>
                    <Typography variant="h6" text={item.title} style={styles.optionText} />
                    {item.subtitle ? (
                        <Typography variant="subtitle_12_400" text={item.subtitle} style={styles.optionSubtitle} />
                    ) : null}
                </View>
                <Checkbox isChecked={item.isSelected} onPress={item.onPress} isRound={selectionMode === 'single'} />
            </TouchableOpacity>
        );
    }, [selectionMode, styles]);

    const renderSeparator = useCallback(() => {
        return <View style={styles.separator} />;
    }, [styles]);

    return (
        <BottomModal visible={visible} onClose={onClose} title={title}>
            <View style={styles.container}>
                {isLoading ? (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={options}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        ItemSeparatorComponent={renderSeparator}
                        style={styles.list}
                        ListEmptyComponent={
                            <View style={styles.stateContainer}>
                                <Typography variant="h5" text={emptyText} style={styles.emptyText} />
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
                <Button
                    text={confirmText}
                    onPress={onConfirm}
                    type="main"
                    disabled={isLoading || isConfirming}
                    inProgress={isConfirming}
                    containerStyle={styles.confirmButton}
                />
            </View>
        </BottomModal>
    );
};
