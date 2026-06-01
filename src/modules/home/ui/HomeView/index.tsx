import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { ActivityIndicator, View } from 'react-native';
import { useHomeView } from '../../presenters/useHomeView';
import { HomeSectionsBottomSheet } from './components/HomeSectionsBottomSheet';
import { HomeConfiguredSections } from './components/HomeConfiguredSections';
import { observer } from 'mobx-react-lite';

export const HomeView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        visibleSectionItems,
        hasVisibleSections,
        sectionOptions,
        isLoading,
        isRefreshing,
        isSaving,
        isSectionsModalVisible,
        onRefresh,
        onOpenSectionsModal,
        onCloseSectionsModal,
        onSaveSections,
    } = useHomeView();

    return (
        <ScreenContainer edges={[]} scrollEnabled={false}>
            <View style={styles.container}>
                {isLoading && !hasVisibleSections ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator color={colors.primary} size="large" />
                    </View>
                ) : (
                    <HomeConfiguredSections
                        sections={visibleSectionItems}
                        isRefreshing={isRefreshing}
                        onRefresh={onRefresh}
                        addEntryText={t('home.addEntry')}
                        onAddEntryPress={onOpenSectionsModal}
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
    );
});
