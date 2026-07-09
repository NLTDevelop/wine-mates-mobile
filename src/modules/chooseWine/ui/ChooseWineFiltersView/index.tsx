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
import { UniversalPickerBottomModal } from '@/UIKit/UniversalPickerBottomModal';
import { UserIcon } from '@assets/icons/UserIcon';
import { PeopleIcon } from '@assets/icons/PeopleIcon';
import { useChooseWineFilters } from '../../presenters/useChooseWineFilters';
import { PickerButton } from '@/UIKit/PickerButton';
import { getStyles } from './styles';
import { TasteFilterItem } from './components/TasteFilterItem';
import { IChooseWineTasteFilterItem } from '../../types/IChooseWineTasteFilterItem';
import { RatingFilter } from './components/RatingFilter';
import { QuickFilterSection } from './components/QuickFilterSection';

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
        selectedAromaText,
        selectedFlavorText,
        isTypeDisabled,
        isColorDisabled,
        isAromaDisabled,
        isFlavorDisabled,
        isAgeDisabled,
        isFemaleGenderDisabled,
        isMaleGenderDisabled,
        femaleGenderTitle,
        femaleGenderWineCountText,
        maleGenderTitle,
        maleGenderWineCountText,
        ageMin,
        ageMax,
        allowedAgeMin,
        allowedAgeMax,
        ratingMin,
        ratingMax,
        allowedRatingMin,
        allowedRatingMax,
        userRating,
        userRatingHintText,
        isExpertRatingDisabled,
        isLoverRating,
        constants,
        visibleTasteItems,
        quickCountryItems,
        quickRegionItems,
        quickGrapeItems,
        quickVintageItems,
        applyWineCountText,
        shouldShowTasteCharacteristicsToggle,
        applyTasteCharacteristics,
        onSelectMyselfMode,
        onSelectFriendMode,
        onSelectFemale,
        onSelectMale,
        onAgeRangeChange,
        onExpertRatingRangeChange,
        onUserRatingChange,
        onUserRatingEnd,
        onToggleTasteCharacteristics,
        onOpenTypePicker,
        onOpenColorPicker,
        onOpenAromaPicker,
        onOpenFlavorPicker,
        onClosePicker,
        onConfirmPicker,
        onApplyPress,
        onResetPress,
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
            headerComponent={
                <HeaderWithBackButton
                    title={t('common.filters')}
                    rightComponent={
                        <TouchableOpacity onPress={onResetPress} style={styles.resetButton}>
                            <Typography text={t('common.reset')} variant="body_500" style={styles.resetText} />
                        </TouchableOpacity>
                    }
                />
            }
            containerStyle={styles.screen}
        >
            {isInitialLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color={colors.primary} size={'large'} />
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
                                <Typography
                                    variant="subtitle_16_700"
                                    text={t('chooseWine.myself')}
                                    style={styles.modeTitle}
                                />
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
                                <Typography
                                    variant="subtitle_16_700"
                                    text={t('chooseWine.friend')}
                                    style={styles.modeTitle}
                                />
                                <Typography
                                    variant="subtitle_10_400"
                                    text={t('chooseWine.friendDescription')}
                                    style={styles.modeDescription}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.segmentRow}>
                            <TouchableOpacity
                                onPress={onSelectFemale}
                                disabled={isFemaleGenderDisabled}
                                style={[
                                    styles.segmentButton,
                                    filters.gender === 'female' ? styles.segmentButtonActive : undefined,
                                    isFemaleGenderDisabled ? styles.segmentButtonDisabled : undefined,
                                ]}
                            >
                                <View style={styles.segmentTextRow}>
                                    <Typography
                                        variant="h6"
                                        numberOfLines={1}
                                        style={[
                                            styles.segmentText,
                                            isFemaleGenderDisabled ? styles.segmentTextDisabled : undefined,
                                        ]}
                                    >
                                        {femaleGenderTitle}
                                        {femaleGenderWineCountText ? (
                                            <>
                                                {' '}
                                                <Typography
                                                    variant="subtitle_12_500"
                                                    style={[
                                                        styles.segmentWineCountText,
                                                        isFemaleGenderDisabled ? styles.segmentTextDisabled : undefined,
                                                    ]}
                                                >
                                                    {femaleGenderWineCountText}
                                                </Typography>
                                            </>
                                        ) : null}
                                    </Typography>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onSelectMale}
                                disabled={isMaleGenderDisabled}
                                style={[
                                    styles.segmentButton,
                                    filters.gender === 'male' ? styles.segmentButtonActive : undefined,
                                    isMaleGenderDisabled ? styles.segmentButtonDisabled : undefined,
                                ]}
                            >
                                <View style={styles.segmentTextRow}>
                                    <Typography
                                        variant="h6"
                                        numberOfLines={1}
                                        style={[
                                            styles.segmentText,
                                            isMaleGenderDisabled ? styles.segmentTextDisabled : undefined,
                                        ]}
                                    >
                                        {maleGenderTitle}
                                        {maleGenderWineCountText ? (
                                            <>
                                                {' '}
                                                <Typography
                                                    variant="subtitle_12_500"
                                                    style={[
                                                        styles.segmentWineCountText,
                                                        isMaleGenderDisabled ? styles.segmentTextDisabled : undefined,
                                                    ]}
                                                >
                                                    {maleGenderWineCountText}
                                                </Typography>
                                            </>
                                        ) : null}
                                    </Typography>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <Typography variant="h6" text={t('chooseWine.age')} style={styles.sectionLabel} />
                        <RangeSlider
                            min={constants.AGE_MIN}
                            max={constants.AGE_MAX}
                            minValue={ageMin}
                            maxValue={ageMax}
                            allowedMin={allowedAgeMin}
                            allowedMax={allowedAgeMax}
                            onChange={onAgeRangeChange}
                            isDisabled={isAgeDisabled}
                        />

                        <PickerButton
                            label={t('chooseWine.colorWine')}
                            text={selectedColorText}
                            placeholder={t('chooseWine.colorWine')}
                            onPress={onOpenColorPicker}
                            isDisabled={isColorDisabled}
                        />
                        <PickerButton
                            label={t('chooseWine.typeWine')}
                            text={selectedTypeText}
                            placeholder={t('chooseWine.typeWine')}
                            onPress={onOpenTypePicker}
                            isDisabled={isTypeDisabled}
                        />
                        <PickerButton
                            label={t('chooseWine.aroma')}
                            text={selectedAromaText}
                            placeholder={t('chooseWine.aroma')}
                            onPress={onOpenAromaPicker}
                            isDisabled={isAromaDisabled}
                        />
                        <PickerButton
                            label={t('chooseWine.taste')}
                            text={selectedFlavorText}
                            placeholder={t('chooseWine.taste')}
                            onPress={onOpenFlavorPicker}
                            isDisabled={isFlavorDisabled}
                        />

                        <RatingFilter
                            isLoverRating={isLoverRating}
                            ratingMin={constants.RATING_MIN}
                            ratingMax={constants.RATING_MAX}
                            userRating={userRating}
                            userRatingHintText={userRatingHintText}
                            expertRatingMin={ratingMin}
                            expertRatingMax={ratingMax}
                            allowedExpertRatingMin={allowedRatingMin}
                            allowedExpertRatingMax={allowedRatingMax}
                            isExpertRatingDisabled={isExpertRatingDisabled}
                            onExpertRatingRangeChange={onExpertRatingRangeChange}
                            onUserRatingChange={onUserRatingChange}
                            onUserRatingEnd={onUserRatingEnd}
                        />

                        <QuickFilterSection title={t('chooseWine.country')} items={quickCountryItems} />
                        <QuickFilterSection title={t('chooseWine.region')} items={quickRegionItems} />
                        <QuickFilterSection title={t('chooseWine.grapeVariety')} items={quickGrapeItems} />

                        <QuickFilterSection title={t('chooseWine.vintage')} items={quickVintageItems} />

                        {shouldShowTasteCharacteristicsToggle && (
                            <TouchableOpacity onPress={onToggleTasteCharacteristics} style={styles.checkboxRow}>
                                <Checkbox
                                    isChecked={applyTasteCharacteristics}
                                    onPress={onToggleTasteCharacteristics}
                                />
                                <Typography
                                    variant="h6"
                                    text={t('chooseWine.applyTasteCharacteristics')}
                                    style={styles.checkboxText}
                                />
                            </TouchableOpacity>
                        )}

                        <FlatList
                            data={visibleTasteItems}
                            keyExtractor={keyExtractor}
                            renderItem={renderTasteItem}
                            scrollEnabled={false}
                            ItemSeparatorComponent={null}
                        />
                    </ScrollView>
                    <View style={styles.footer}>
                        <Button
                            text={t('chooseWine.apply')}
                            onPress={onApplyPress}
                            inProgress={isApplying}
                            CenterAccessory={
                                <View style={styles.applyTextRow}>
                                <Typography
                                    variant="body_500"
                                    numberOfLines={1}
                                    style={styles.applyText}
                                >
                                    {t('chooseWine.apply')}
                                    {applyWineCountText ? (
                                        <>
                                            {' '}
                                            <Typography
                                                variant="subtitle_12_500"
                                                style={styles.applyWineCountText}
                                            >
                                                {applyWineCountText}
                                            </Typography>
                                        </>
                                    ) : null}
                                </Typography>
                            </View>
                            }
                        />
                    </View>
                </View>
            )}
            {pickerState ? (
                <UniversalPickerBottomModal
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
