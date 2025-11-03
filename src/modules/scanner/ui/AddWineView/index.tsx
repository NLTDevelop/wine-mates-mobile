import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { useAddWine } from '../../presenters/useAddWine';

export const AddWineView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { form, onChangeWinery, onChangeGrapeVariety, onChangeVintageYear, onChangeWineName, handleNextPress,isDisabled }
        = useAddWine();

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('scanner.whatsInYourGlass')} />}
        >
            <View style={styles.container}>
                <View>
                    <Typography text={t('scanner.enterData')} variant="body_400" style={styles.title} />
                    <View style={styles.mainContainer}>
                        <CustomInput
                            autoCapitalize="none"
                            value={form.winery}
                            onChangeText={onChangeWinery}
                            placeholder={t('scanner.winery')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            autoCapitalize="none"
                            value={form.grapeVariety}
                            onChangeText={onChangeGrapeVariety}
                            placeholder={t('wine.grapeVariety')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            autoCapitalize="none"
                            value={form.vintageYear}
                            onChangeText={onChangeVintageYear}
                            placeholder={t('scanner.vintageYear')}
                            containerStyle={styles.input}
                        />
                        <CustomInput
                            autoCapitalize="none"
                            value={form.wineName}
                            onChangeText={onChangeWineName}
                            placeholder={t('scanner.wineName')}
                            containerStyle={styles.input}
                        />
                    </View>
                </View>
                <Button
                    text={t('scanner.tasteWine')}
                    onPress={handleNextPress}
                    containerStyle={styles.button}
                    disabled={isDisabled}
                />
            </View>
        </ScreenContainer>
        // </WithErrorHandler>
    );
};
