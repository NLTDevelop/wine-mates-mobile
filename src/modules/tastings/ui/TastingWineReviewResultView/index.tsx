import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { observer } from 'mobx-react-lite';
import { SelectedParameters } from '../../../../UIKit/SelectedParameters';
import { Notes } from '../../../../UIKit/Notes';
import { Loader } from '@/UIKit/Loader';
import { Typography } from '@/UIKit/Typography';
import { FoodPairing } from '@/UIKit/FoodPairing';
import { RateThisWine } from '@/UIKit/RateThisWine';
import { TastingNote } from '@/UIKit/TastingNote';
import { useTastingWineReviewResult } from './presenters/useTastingWineReviewResult';
import { WineSnackCuisinePickerModal } from '@/UIKit/WineSnackCuisinePickerModal';
import { wineModel } from '@/entities/wine/models/WineModel';

export const TastingWineReviewResultView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        onSavePress,
        note,
        isLoading,
        isSaving,
        limits,
        isLoadingLimits,
        getNote,
        setLimits,
        updateNote,
        noteValidationError,
        onNoteEditingChange,
        onInvalidNoteEditingComplete,
        onSubscribePress,
        isSelectedParametersVisible,
        isCuisineModalVisible,
        isLoadingCuisines,
        cuisineOptions,
        cuisineSelectButtonText,
        onOpenCuisinePickerPress,
        onCloseCuisinePicker,
        onConfirmCuisineSelection,
        snacks,
        isGeneratingSnacks,
        onGenerateSnacksPress,
    } = useTastingWineReviewResult();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('wine.review')} />}
            scrollEnabled
            isKeyboardAvoiding
        >
            {isLoadingLimits ? (
                <Loader />
            ) : (
                <View style={styles.container}>
                    <View>
                        <RateThisWine
                            sliderValue={wineModel.review?.rate || 0}
                            starRate={wineModel.review?.starRate || 0}
                            disabled={true}
                            hasChangedRating={wineModel.review?.hasChangedRate || wineModel.review?.hasChangedStarRate || false}
                        />
                        <Notes />
                        <View style={styles.limitContainer}>
                            {limits?.aiUsage.left === 0 ? (
                                <>
                                    <Typography text={t('aiAttempts.label3')} />
                                    <Typography text={t('aiAttempts.label4')} />
                                    <Button
                                        text={t('aiAttempts.subscribe')}
                                        onPress={onSubscribePress}
                                        containerStyle={styles.subscribeButton}
                                    />
                                </>
                            ) : (
                                <Typography variant="h6">
                                    {t('aiAttempts.label1')}{' '}
                                    <Typography
                                        text={`${limits?.aiUsage.left ?? '-'}/${limits?.aiUsage.total ?? '-'}`}
                                        variant="h5"
                                        style={styles.countText}
                                    />{' '}
                                    {t('aiAttempts.label2')}
                                </Typography>
                            )}
                        </View>
                        <FoodPairing
                            setLimits={setLimits}
                            generatedSnacks={wineModel.review?.aiSnacks || undefined}
                            snacks={snacks}
                            isGenerating={isGeneratingSnacks}
                            onGeneratePress={onGenerateSnacksPress}
                            cuisineSelectButtonText={cuisineSelectButtonText}
                            onCuisineSelectPress={onOpenCuisinePickerPress}
                        />
                        <TastingNote
                            note={note}
                            isLoading={isLoading}
                            limits={limits}
                            onGeneratePress={getNote}
                            onUpdateNote={updateNote}
                            noteError={noteValidationError || undefined}
                            onEditingChange={onNoteEditingChange}
                            onInvalidEditComplete={onInvalidNoteEditingComplete}
                        />
                        {isSelectedParametersVisible ? (
                            <SelectedParameters containerStyle={styles.selectedParameters} />
                        ) : null}
                    </View>
                    <Button
                        text={t('common.save')}
                        onPress={onSavePress}
                        containerStyle={styles.button}
                        inProgress={isSaving}
                    />
                </View>
            )}
            {isCuisineModalVisible && (
                <WineSnackCuisinePickerModal
                    visible={isCuisineModalVisible}
                    options={cuisineOptions}
                    isLoading={isLoadingCuisines}
                    isConfirming={isGeneratingSnacks}
                    onClose={onCloseCuisinePicker}
                    onConfirm={onConfirmCuisineSelection}
                />
            )}
        </ScreenContainer>
    );
});
