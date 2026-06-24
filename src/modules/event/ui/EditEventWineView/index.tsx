import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { useWineInitialData } from '@/modules/scanner/presenters/useWineInitialData';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { useWineColor } from '@/modules/scanner/presenters/useWineColor';
import { observer } from 'mobx-react-lite';
import { useWineRegion } from '@/modules/scanner/presenters/useWineRegion';
import { Warning } from '@/modules/authentication/ui/components/Warning';
import { useEditEventWineView } from './presenters/useEditEventWineView';

export const EditEventWineView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        form,
        inProgress,
        isVintageError,
        isDisabled,
        onChangeType,
        onChangeColor,
        onChangeCountry,
        onChangeRegion,
        onChangeWinery,
        onChangeGrapeVariety,
        onChangeVintageYear,
        onChangeWineName,
        onSavePress,
    } = useEditEventWineView();
    const { countries, typeData, getTypes, isLoading, isError } = useWineInitialData();
    const { colorsData } = useWineColor(form.typeOfWine.id);
    const { regions } = useWineRegion(form.country.id);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getTypes} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('event.editWine')} />}
                isKeyboardAvoiding
                scrollEnabled
            >
                {!typeData || isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <View>
                            <Typography text={t('scanner.enterData')} variant="body_400" style={styles.title} />
                            <View style={styles.mainContainer}>
                                <CustomDropdown
                                    data={typeData}
                                    placeholder={t('wine.typeOfWine')}
                                    onPress={onChangeType}
                                    selectedValue={form.typeOfWine.value}
                                />
                                <CustomDropdown
                                    data={colorsData}
                                    placeholder={t('wine.colorOfWine')}
                                    onPress={onChangeColor}
                                    selectedValue={form.colorOfWine.value}
                                    disabled={!colorsData.length}
                                />
                                <CustomDropdown
                                    data={countries}
                                    placeholder={t('wine.country')}
                                    onPress={onChangeCountry}
                                    selectedValue={form.country.value}
                                    withSearch={true}
                                />
                                <CustomDropdown
                                    data={regions}
                                    placeholder={t('wine.region')}
                                    onPress={onChangeRegion}
                                    selectedValue={form.region.value}
                                    disabled={!regions.length}
                                    withSearch={true}
                                    emptyStateLabel={t('wine.withoutRegion')}
                                />
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.producer.value || ''}
                                    onChangeText={onChangeWinery}
                                    placeholder={t('wine.wineryName')}
                                    maxLength={255}
                                    containerStyle={styles.input}
                                />
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.grapeVariety.value || ''}
                                    onChangeText={onChangeGrapeVariety}
                                    placeholder={t('wine.grapeVariety')}
                                    maxLength={255}
                                    containerStyle={styles.input}
                                />
                                <View>
                                    <CustomInput
                                        autoCapitalize="none"
                                        value={form.vintageYear.value || ''}
                                        onChangeText={onChangeVintageYear}
                                        placeholder={t('wine.vintage')}
                                        containerStyle={styles.input}
                                        maxLength={4}
                                        keyboardType="number-pad"
                                        error={isVintageError.status}
                                    />
                                    {isVintageError.status && <Warning warningText={isVintageError.errorText} />}
                                </View>
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.wineName.value || ''}
                                    onChangeText={onChangeWineName}
                                    placeholder={t('wine.wineName')}
                                    maxLength={255}
                                    containerStyle={styles.input}
                                />
                            </View>
                        </View>
                        <Button
                            text={t('common.save')}
                            onPress={onSavePress}
                            containerStyle={styles.button}
                            disabled={isDisabled}
                            inProgress={inProgress}
                        />
                    </View>
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
