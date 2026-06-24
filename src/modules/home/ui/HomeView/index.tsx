import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { ActivityIndicator, View } from 'react-native';
import { useHomeView } from '../../presenters/useHomeView';
import { HomeSectionsBottomSheet } from './components/HomeSectionsBottomSheet';
import { HomeConfiguredSections } from './components/HomeConfiguredSections';
import { observer } from 'mobx-react-lite';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';

export const HomeView = observer(() => {
    const { colors, t, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        visibleSectionItems,
        hasVisibleSections,
        hasConfiguredSections,
        canConfigurePlacement,
        sectionOptions,
        isLoading,
        isRefreshing,
        isSaving,
        isError,
        isSectionsModalVisible,
        isPlacementEditMode,
        getHomeSections,
        onRefresh,
        onOpenSectionsModal,
        onCloseSectionsModal,
        onSaveSections,
        onOpenPlacementConfig,
        onReorderPlacementSections,
        onSavePlacementSections,
    } = useHomeView(locale);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getHomeSections} isLoading={isLoading} showHeader={false}>
            <ScreenContainer edges={[]} scrollEnabled={false}>
                <View style={styles.container}>
                    {isLoading && !hasVisibleSections ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator color={colors.primary} size="large" />
                        </View>
                    ) : (
                        <HomeConfiguredSections
                            sections={visibleSectionItems}
                            hasConfiguredSections={hasConfiguredSections}
                            isRefreshing={isRefreshing}
                            onRefresh={onRefresh}
                            addEntryText={t('home.addEntry')}
                            configurePlacementText={t('home.configurePlacement')}
                            saveText={t('common.save')}
                            isPlacementEditMode={isPlacementEditMode}
                            canConfigurePlacement={canConfigurePlacement}
                            isSaving={isSaving}
                            onAddEntryPress={onOpenSectionsModal}
                            onConfigurePlacementPress={onOpenPlacementConfig}
                            onReorderPlacementSections={onReorderPlacementSections}
                            onSavePlacementPress={onSavePlacementSections}
                        />
                    )}
                </View>
                {isSectionsModalVisible && (
                    <HomeSectionsBottomSheet
                        isVisible={isSectionsModalVisible}
                        items={sectionOptions}
                        onClose={onCloseSectionsModal}
                        onSave={onSaveSections}
                        isSaving={isSaving}
                    />
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
