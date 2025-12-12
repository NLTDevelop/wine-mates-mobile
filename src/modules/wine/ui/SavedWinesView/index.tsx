import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { observer } from 'mobx-react-lite';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { useSavedWines } from '../../presenters/useSavedWine';
import { Button } from '@/UIKit/Button';
import { PlusIcon } from '@assets/icons/PlusIcon';

export const SavedWinesView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isLoading, wines, isError, getSavedWines } = useSavedWines();

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getSavedWines}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('savedWine.savedWine')} isCentered={false} />}
            >
                <Button
                    text={t('savedWine.createList')}
                    onPress={() => {}}
                    type="secondary"
                    LeftAccessory={
                        <View style={styles.plusIconContainer}>
                            <PlusIcon />
                        </View>
                    }
                    containerStyle={styles.button}
                />
            </ScreenContainer>
        </WithErrorHandler>
    );
});
