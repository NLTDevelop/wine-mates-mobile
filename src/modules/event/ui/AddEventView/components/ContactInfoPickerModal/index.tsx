import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { Checkbox } from '@/UIKit/Checkbox';
import { IContactInfoOption } from '@/modules/event/types/IContactInfoOption';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    options: IContactInfoOption[];
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ContactInfoPickerModal = ({
    visible,
    options,
    isLoading,
    onClose,
    onConfirm,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: IContactInfoOption) => {
        return `${item.id}`;
    }, []);

    const renderItem = useCallback(({ item }: { item: IContactInfoOption }) => {
        return (
            <TouchableOpacity onPress={item.onPress} style={styles.option}>
                <Typography variant="h6" text={item.name} style={styles.optionText} />
                <Checkbox isChecked={item.isSelected} onPress={item.onPress} isRound />
            </TouchableOpacity>
        );
    }, [styles]);

    const renderSeparator = useCallback(() => {
        return <View style={styles.separator} />;
    }, [styles]);

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('contactInfo.contacts')}>
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
                        ListEmptyComponent={
                            <View style={styles.stateContainer}>
                                <Typography
                                    variant="body_400"
                                    text={t('contactInfo.noVisibleContacts')}
                                    style={styles.emptyText}
                                />
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <Button
                    text={t('common.confirm')}
                    onPress={onConfirm}
                    type="main"
                    disabled={isLoading}
                    containerStyle={styles.confirmButton}
                />
            </View>
        </BottomModal>
    );
};
