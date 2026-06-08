import { useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { Checkbox } from '@/UIKit/Checkbox';
import { Button } from '@/UIKit/Button';
import { IEventPaymentMethodOption } from '@/modules/event/ui/EventDetailsView/types/IEventPaymentMethodOption';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    options: IEventPaymentMethodOption[];
    isNextDisabled: boolean;
    onClose: () => void;
    onNextPress: () => void;
}

export const EventPaymentMethodsModal = ({
    visible,
    options,
    isNextDisabled,
    onClose,
    onNextPress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: IEventPaymentMethodOption) => `${item.id}`, []);

    const renderItem = useCallback(({ item }: { item: IEventPaymentMethodOption }) => {
        return (
            <TouchableOpacity style={styles.option} onPress={item.onPress} activeOpacity={0.8}>
                <View style={styles.optionTextWrap}>
                    <Typography text={item.name} variant="h6" style={styles.optionName} />
                    <Typography text={item.paymentDetails} variant="body_400" style={styles.optionDetails} />
                </View>
                <Checkbox isRound isChecked={item.isSelected} onPress={item.onPress} />
            </TouchableOpacity>
        );
    }, [styles]);

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('payments.paymentsMethods')}>
            <View style={styles.container}>
                <Typography text={t('payments.selectPaymentMethodHint')} variant="body_400" style={styles.subtitle} />
                <FlatList
                    data={options}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Typography text={t('payments.addPaymentMethodsInProfile')} variant="body_400" style={styles.emptyText} />
                    }
                />
                <Button
                    text={t('common.next')}
                    onPress={onNextPress}
                    type="main"
                    disabled={isNextDisabled}
                    containerStyle={styles.nextButton}
                />
            </View>
        </BottomModal>
    );
};
