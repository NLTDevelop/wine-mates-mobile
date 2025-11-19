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
import { CustomDropdown } from '../../../../UIKit/CustomDropdown/ui';
import { useWineTypes } from '../../presenters/useWineTypes';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { useWineColor } from '../../presenters/useWineColor';
import { observer } from 'mobx-react-lite';

export const AddWineView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { form, onChangeWinery, onChangeGrapeVariety, onChangeVintageYear, onChangeWineName, handleNextPress, isDisabled,
        onChangeType, onChangeColor, onChangeCountry, onChangeRegion } = useAddWine();
    const { typeData, getTypes, isLoading, isError } = useWineTypes();
    const { colorsData } = useWineColor(form.typeOfWine.id);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getTypes} isLoading={isLoading}>
            <ScreenContainer
                edges={['top']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('scanner.whatsInYourGlass')} />}
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
                                    data={[
                                        { id: 1, label: 'red', value: 'Red' },
                                        { id: 2, label: 'blue', value: 'Blue' },
                                        { id: 3, label: 'green', value: 'Green' },
                                    ]}
                                    placeholder={t('wine.country')}
                                    onPress={onChangeCountry}
                                    selectedValue={form.country.value}
                                    withSearch
                                />
                                <CustomDropdown
                                    data={[
                                        { id: 1, label: 'red', value: 'Red' },
                                        { id: 2, label: 'blue', value: 'Blue' },
                                        { id: 3, label: 'green', value: 'Green' },
                                    ]}
                                    placeholder={t('wine.region')}
                                    onPress={onChangeRegion}
                                    selectedValue={form.region.value}
                                    withSearch
                                />
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.winery.value}
                                    onChangeText={onChangeWinery}
                                    placeholder={t('wine.wineryName')}
                                    containerStyle={styles.input}
                                />
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.grapeVariety.value}
                                    onChangeText={onChangeGrapeVariety}
                                    placeholder={t('wine.grapeVariety')}
                                    containerStyle={styles.input}
                                />
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.vintageYear.value}
                                    onChangeText={onChangeVintageYear}
                                    placeholder={t('wine.vintage')}
                                    containerStyle={styles.input}
                                />
                                <CustomInput
                                    autoCapitalize="none"
                                    value={form.wineName.value}
                                    onChangeText={onChangeWineName}
                                    placeholder={t('wine.wineName')}
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
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
