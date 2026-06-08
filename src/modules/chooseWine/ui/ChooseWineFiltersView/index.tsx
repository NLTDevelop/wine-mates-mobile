import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { RangeSlider } from '@/UIKit/RangeSlider';
import { Checkbox } from '@/UIKit/Checkbox';
import { UniversalPickerModal } from '@/UIKit/UniversalPickerModal';
import { UserIcon } from '@assets/icons/UserIcon';
import { PeopleIcon } from '@assets/icons/PeopleIcon';
import { useChooseWineFilters } from '../../presenters/useChooseWineFilters';
import { PickerButton } from '@/UIKit/PickerButton';
import { getStyles } from './styles';
import { TasteFilterItem } from './components/TasteFilterItem';
import { IChooseWineTasteFilterItem } from '../../types/IChooseWineTasteFilterItem';
import { RatingFilter } from './components/RatingFilter';

export const ChooseWineFiltersView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        mode,
        filters,
        isInitialLoading,
        isApplying,
        pickerState,
        selectedTypeText,
        selectedColorText,
        selectedCountryText,
        selectedRegionText,
        selectedAromaText,
        selectedFlavorText,
        selectedGrapeText,
        selectedVintageLabel,
        isRegionDisabled,
        isAromaFlavorDisabled,
        ageMin,
        ageMax,
        ratingMin,
        ratingMax,
        userRating,
        userRatingHintText,
        isLoverRating,
        constants,
        tasteItems,
        applyTasteCharacteristics,
        onSelectMyselfMode,
        onSelectFriendMode,
        onSelectFemale,
        onSelectMale,
        onAgeRangeChange,
        onExpertRatingRangeChange,
        onUserRatingChange,
        onToggleTasteCharacteristics,
        onOpenTypePicker,
        onOpenColorPicker,
        onOpenCountryPicker,
        onOpenRegionPicker,
        onOpenVintagePicker,
        onOpenGrapePicker,
        onOpenAromaPicker,
        onOpenFlavorPicker,
        onClosePicker,
        onConfirmPicker,
        onApplyPress,
    } = useChooseWineFilters();

    const keyExtractor = useCallback((item: IChooseWineTasteFilterItem) => {
        return `${item.id}`;
    }, []);

    const renderTasteItem = useCallback(({ item }: { item: IChooseWineTasteFilterItem }) => {
        return <TasteFilterItem item={item} />;
    }, []);

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('common.filters')} />}
            containerStyle={styles.screen}
        >
            {isInitialLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            ) : (
                <View style={styles.screen}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.content}
                    >
                        <View style={styles.modeRow}>
                            <TouchableOpacity
                                onPress={onSelectMyselfMode}
                                style={[styles.modeCard, mode === 'myself' ? styles.modeCardActive : undefined]}
                            >
                                <UserIcon />
                                <Typography variant="subtitle_16_700" text={t('chooseWine.myself')} style={styles.modeTitle} />
                                <Typography
                                    variant="subtitle_10_400"
                                    text={t('chooseWine.myselfDescription')}
                                    style={styles.modeDescription}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onSelectFriendMode}
                                style={[styles.modeCard, mode === 'friend' ? styles.modeCardActive : undefined]}
                            >
                                <PeopleIcon />
                                <Typography variant="subtitle_16_700" text={t('chooseWine.friend')} style={styles.modeTitle} />
                                <Typography
                                    variant="subtitle_10_400"
                                    text={t('chooseWine.friendDescription')}
                                    style={styles.modeDescription}
                                />
                            </TouchableOpacity>
                        </View>

                        <Typography variant="h6" text={t('chooseWine.sex')} style={styles.sectionLabel} />
                        <View style={styles.segmentRow}>
                            <TouchableOpacity
                                onPress={onSelectFemale}
                                style={[styles.segmentButton, filters.gender === 'female' ? styles.segmentButtonActive : undefined]}
                            >
                                <Typography variant="h6" text={t('chooseWine.women')} style={styles.segmentText} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onSelectMale}
                                style={[styles.segmentButton, filters.gender === 'male' ? styles.segmentButtonActive : undefined]}
                            >
                                <Typography variant="h6" text={t('chooseWine.men')} style={styles.segmentText} />
                            </TouchableOpacity>
                        </View>

                        <Typography variant="h6" text={t('chooseWine.age')} style={styles.sectionLabel} />
                        <RangeSlider
                            min={constants.AGE_MIN}
                            max={constants.AGE_MAX}
                            minValue={ageMin}
                            maxValue={ageMax}
                            onChange={onAgeRangeChange}
                        />

                        <PickerButton
                            label={t('chooseWine.typeWine')}
                            text={selectedTypeText}
                            placeholder={t('chooseWine.typeWine')}
                            onPress={onOpenTypePicker}
                        />
                        <PickerButton
                            label={t('chooseWine.colorWine')}
                            text={selectedColorText}
                            placeholder={t('chooseWine.colorWine')}
                            onPress={onOpenColorPicker}
                        />
                        <PickerButton
                            label={t('chooseWine.aroma')}
                            text={selectedAromaText}
                            placeholder={t('chooseWine.aroma')}
                            onPress={onOpenAromaPicker}
                            isDisabled={isAromaFlavorDisabled}
                        />
                        <PickerButton
                            label={t('chooseWine.taste')}
                            text={selectedFlavorText}
                            placeholder={t('chooseWine.taste')}
                            onPress={onOpenFlavorPicker}
                            isDisabled={isAromaFlavorDisabled}
                        />

                        <RatingFilter
                            isLoverRating={isLoverRating}
                            ratingMin={constants.RATING_MIN}
                            ratingMax={constants.RATING_MAX}
                            userRating={userRating}
                            userRatingHintText={userRatingHintText}
                            expertRatingMin={ratingMin}
                            expertRatingMax={ratingMax}
                            onExpertRatingRangeChange={onExpertRatingRangeChange}
                            onUserRatingChange={onUserRatingChange}
                        />

                        <PickerButton
                            label={t('chooseWine.country')}
                            text={selectedCountryText}
                            placeholder={t('chooseWine.country')}
                            onPress={onOpenCountryPicker}
                        />
                        <PickerButton
                            label={t('chooseWine.region')}
                            text={selectedRegionText}
                            placeholder={t('chooseWine.region')}
                            onPress={onOpenRegionPicker}
                            isDisabled={isRegionDisabled}
                        />
                        <PickerButton
                            label={t('chooseWine.vintage')}
                            text={selectedVintageLabel}
                            placeholder={t('chooseWine.vintage')}
                            onPress={onOpenVintagePicker}
                        />
                        <PickerButton
                            label={t('chooseWine.grapeVariety')}
                            text={selectedGrapeText}
                            placeholder={t('chooseWine.grapeVariety')}
                            onPress={onOpenGrapePicker}
                        />

                        <TouchableOpacity onPress={onToggleTasteCharacteristics} style={styles.checkboxRow}>
                            <Checkbox isChecked={applyTasteCharacteristics} onPress={onToggleTasteCharacteristics} />
                            <Typography
                                variant="h6"
                                text={t('chooseWine.applyTasteCharacteristics')}
                                style={styles.checkboxText}
                            />
                        </TouchableOpacity>

                        <FlatList
                            data={applyTasteCharacteristics ? tasteItems : []}
                            keyExtractor={keyExtractor}
                            renderItem={renderTasteItem}
                            scrollEnabled={false}
                            ItemSeparatorComponent={null}
                        />
                    </ScrollView>
                    <View style={styles.footer}>
                        <Button text={t('chooseWine.apply')} onPress={onApplyPress} inProgress={isApplying} />
                    </View>
                </View>
            )}
            {pickerState ? (
                <UniversalPickerModal
                    visible={!!pickerState}
                    title={pickerState.title}
                    options={pickerState.options}
                    isLoading={pickerState.isLoading}
                    selectionMode={pickerState.selectionMode}
                    emptyText={t('common.nothingFoundTitle')}
                    confirmText={t('common.choose')}
                    onClose={onClosePicker}
                    onConfirm={onConfirmPicker}
                />
            ) : null}
        </ScreenContainer>
    );
});
