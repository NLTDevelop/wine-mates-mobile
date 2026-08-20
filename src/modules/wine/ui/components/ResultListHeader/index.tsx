import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { declOfWord } from '@/utils';
import { ResultHeader } from '../ResultHeader';
import { GlassWithWineIcon } from '@assets/icons/GlassWithWineIcon';
import { TasteCharacteristicItem } from '@/UIKit/TasteCharacteristicItem';
import { IStatistic, IVintagesItem, IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { StatisticCard } from '../StatisticCard';
import { FoodPairing } from '@/UIKit/FoodPairing';
import { TastingNote } from '../TastingNote';
import { wineReviewsListModel } from '@/entities/wine/models/WineReviewsListModel';
import { WineSnackCuisinePickerModal } from '@/UIKit/WineSnackCuisinePickerModal';
import { Button } from '@/UIKit/Button';
import { useResultListHeader } from './presenters/useResultListHeader';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';

interface IProps {
    data: IWineDetails;
    vintages: IVintagesItem[];
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
    isAllVintagesSelected: boolean;
    fromScanner?: boolean;
    hasReviews?: boolean;
    isResultHeaderFooterVisible: boolean;
    showTastingAuthor: boolean;
    hasPremiumContentAccess: boolean;
    onWineImagePress?: () => void;
    hideResultHeader?: boolean;
}


export const ResultListHeader = ({
    data,
    vintages,
    onVintageChange,
    onFavoritePress,
    hasCurrentVintageData,
    isAllVintagesSelected,
    fromScanner,
    hasReviews,
    isResultHeaderFooterVisible,
    showTastingAuthor,
    hasPremiumContentAccess,
    onWineImagePress,
    hideResultHeader = false,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        colorShadeItems,
        tasteCharacteristics,
        isVintageTasted,
        isFoodPairingVisible,
        aiUsage,
        snacks,
        isGeneratingSnacks,
        isCuisineModalVisible,
        isLoadingCuisines,
        cuisineOptions,
        cuisineSelectButtonText,
        onOpenCuisinePickerPress,
        onCloseCuisinePicker,
        onConfirmCuisineSelection,
        onGenerateSnacksPress,
        onSubscribePress,
    } = useResultListHeader(data, vintages);

    return (
        <View>
            {!hideResultHeader ? (
                <ResultHeader
                    item={data}
                    vintages={vintages}
                    onVintageChange={onVintageChange}
                    onFavoritePress={onFavoritePress}
                    hasCurrentVintageData={hasCurrentVintageData}
                    isAllVintagesSelected={isAllVintagesSelected}
                    fromScanner={fromScanner}
                    isResultHeaderFooterVisible={isResultHeaderFooterVisible}
                    showTastingAuthor={showTastingAuthor}
                    hasPremiumContentAccess={hasPremiumContentAccess}
                    onWineImagePress={onWineImagePress}
                />
            ) : null}

            {isVintageTasted && (
                <>
                    <View style={styles.tasted}>
                        <Typography text={t('wine.tasted')} style={styles.tastedText} />
                        <GlassWithWineIcon />
                    </View>
                </>
            )}

            {colorShadeItems.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.colors')} variant="h4" />
                        <Typography text={t('wine.mostSelectedColor')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.mapListContainer}>
                        {colorShadeItems.map(item => (
                            <StatisticCard
                                key={item.id}
                                backgroundColor={item.colorHex}
                                label={item.label}
                                count={item.count}
                            />
                        ))}
                    </View>
                </>
            )}

            {data.statistics.topAromas?.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.aromas')} variant="h4" />
                        <Typography text={t('wine.mostSelected')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.mapListContainer}>
                        {data.statistics.topAromas.map((item: IStatistic) => (
                            <StatisticCard
                                key={item.id}
                                backgroundColor={item.colorHex || colors.background_grey}
                                label={item.name}
                                count={`(${declOfWord(
                                    Number(item.userCount),
                                    t('scanner.reviewCount') as unknown as Array<string>,
                                )})`}
                            />
                        ))}
                    </View>
                </>
            )}

            {data.statistics.topFlavors.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.tastes')} variant="h4" />
                        <Typography text={t('wine.mostSelected')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.mapListContainer}>
                        {data.statistics.topFlavors.map((item: IStatistic) => (
                            <StatisticCard
                                key={item.id}
                                backgroundColor={item.colorHex || colors.background_grey}
                                label={item.name}
                                count={`(${declOfWord(
                                    Number(item.userCount),
                                    t('scanner.reviewCount') as unknown as Array<string>,
                                )})`}
                            />
                        ))}
                    </View>
                </>
            )}

            {tasteCharacteristics.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.details')} variant="h4" />
                        <Typography text={t('wine.mostSelected')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.slidersListContainer}>
                        {tasteCharacteristics.map((item: IWineTasteCharacteristic) => (
                            <TasteCharacteristicItem
                                key={`${item.id}-${item.selectedIndex ?? 0}-${data.vintage ?? 'none'}`}
                                item={item}
                                value={Math.max((item.selectedIndex ?? 0) - 1, 0)}
                                isPremiumUser={hasPremiumContentAccess}
                                disabled={true}
                            />
                        ))}
                    </View>
                </>
            )}

            {data.aiTastingNote ? <TastingNote note={data.aiTastingNote} /> : null}

            {isFoodPairingVisible ? (
                <View style={styles.limitContainer}>
                    {aiUsage?.left === 0 ? (
                        <>
                            <Typography text={t('wine.foodPairingAttempts.label3')} />
                            <Typography text={t('wine.foodPairingAttempts.label4')} />
                            <Button
                                text={t('aiAttempts.subscribe')}
                                onPress={onSubscribePress}
                                containerStyle={styles.subscribeButton}
                            />
                        </>
                    ) : (
                        <Typography variant="h6">
                            {t('wine.foodPairingAttempts.label1')}{' '}
                            <Typography
                                text={`${aiUsage?.left}/${aiUsage?.total}`}
                                variant="h5"
                                style={styles.limitCountText}
                            />{' '}
                            {t('wine.foodPairingAttempts.label2')}
                        </Typography>
                    )}
                </View>
            ) : null}

            <FoodPairing
                generatedSnacks={data.aiSnacks}
                snacks={snacks}
                isGenerating={isGeneratingSnacks}
                onGeneratePress={onGenerateSnacksPress}
                cuisineSelectButtonText={cuisineSelectButtonText}
                onCuisineSelectPress={onOpenCuisinePickerPress}
                isLocked={!hasPremiumContentAccess && isFoodPairingVisible}
                showDescription
                isDetailedTastingRequired={!isFoodPairingVisible}
            />

            {(hasReviews || (wineReviewsListModel.list && wineReviewsListModel.list.rows.length > 0)) && (
                <Typography text={t('wine.reviews')} variant="h3" style={styles.title} />
            )}

            {isFoodPairingVisible && isCuisineModalVisible ? (
                <WineSnackCuisinePickerModal
                    visible={isCuisineModalVisible}
                    options={cuisineOptions}
                    isLoading={isLoadingCuisines}
                    isConfirming={isGeneratingSnacks}
                    onClose={onCloseCuisinePicker}
                    onConfirm={onConfirmCuisineSelection}
                />
            ) : null}
        </View>
    );
};
