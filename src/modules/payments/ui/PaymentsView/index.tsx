import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { FlatList, View } from 'react-native';
import { useRefresh } from '@/hooks/useRefresh';
import { Loader } from '@/UIKit/Loader';
import { usePaymentsList } from './presenters/usePaymentsList';
import { IPaymentsListItem } from '@/entities/payments/types/IPaymentsListItem';
import { PaymentsListItem } from './components/PaymentsListItem';
import { Button } from '@/UIKit/Button';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { observer } from 'mobx-react-lite';

export const PaymentsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, isLoading, getList, onAddPress } = usePaymentsList();
    const { refreshControl } = useRefresh(getList);

    const keyExtractor = useCallback((item: IPaymentsListItem, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(({ item }: { item: IPaymentsListItem }) => <PaymentsListItem item={item} />, []);

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            scrollEnabled={false}
            headerComponent={<HeaderWithBackButton title={t('payments.paymentsMethods')} isCentered />}
        >
            {isLoading ? (
                <Loader />
            ) : (
                <View style={styles.container}>
                    <FlatList
                        data={data}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        refreshControl={refreshControl}
                        style={styles.list}
                        contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}
                    />
                    <Button
                        type="secondary"
                        onPress={onAddPress}
                        text={t('payments.paymentsMethod')}
                        LeftAccessory={
                            <View style={styles.addContainer}>
                                <PlusIcon />
                            </View>
                        }
                        textStyle={styles.buttonText}
                    />
                </View>
            )}
        </ScreenContainer>
    );
});
