import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Sortable, { SortableGridDragEndParams, SortableGridRenderItem } from 'react-native-sortables';
import { useUiContext } from '@/UIProvider';
import { IHomeVisibleSection } from '../../types/IHomeVisibleSection';
import { getStyles } from './styles';
import { ChooseWineSection } from '../ChooseWineSection';
import { PeopleTalkingSection } from '../PeopleTalkingSection';
import { HomeEventSection } from '../HomeEventSection';
import { HomeEmptyState } from '../HomeEmptyState';
import { Button } from '@/UIKit/Button';
import { HomePlacementSection } from '../HomePlacementSection';
import { useHomeConfiguredSections } from './presenters/useHomeConfiguredSections';

interface IProps {
    sections: IHomeVisibleSection[];
    hasConfiguredSections: boolean;
    isRefreshing: boolean;
    onRefresh: () => void;
    addEntryText: string;
    configurePlacementText: string;
    saveText: string;
    isPlacementEditMode: boolean;
    canConfigurePlacement: boolean;
    isSaving: boolean;
    onAddEntryPress: () => void;
    onConfigurePlacementPress: () => void;
    onSavePlacementPress: () => void;
    onReorderPlacementSections: (params: SortableGridDragEndParams<IHomeVisibleSection>) => void;
}

const PLACEMENT_CAROUSEL_HORIZONTAL_OFFSET = 56;

export const HomeConfiguredSections = ({
    sections,
    hasConfiguredSections,
    isRefreshing,
    onRefresh,
    addEntryText,
    configurePlacementText,
    saveText,
    isPlacementEditMode,
    canConfigurePlacement,
    isSaving,
    onAddEntryPress,
    onConfigurePlacementPress,
    onSavePlacementPress,
    onReorderPlacementSections,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        autoScrollActivationOffset,
        autoScrollMaxVelocity,
        dragActivationDelay,
        rowGap,
        scrollableRef,
    } = useHomeConfiguredSections();
    const shouldShowConfigurePlacementButton = canConfigurePlacement && sections.length > 1;

    const keyExtractor = useCallback((item: IHomeVisibleSection) => item.key, []);

    const renderItem = useCallback(({ item }: ListRenderItemInfo<IHomeVisibleSection>) => {
        if (item.key === 'choose_wine') {
            return <ChooseWineSection title={item.title} />;
        }

        if (item.key === 'events' && item.events) {
            return <HomeEventSection title={item.title} events={item.events} />;
        }

        if (item.key === 'people_talking' && item.peopleTalking) {
            return <PeopleTalkingSection title={item.title} data={item.peopleTalking} />;
        }

        return <View />;
    }, []);

    const renderPlacementItem: SortableGridRenderItem<IHomeVisibleSection> = useCallback(({ item }) => {
        if (item.key === 'choose_wine') {
            return (
                <HomePlacementSection onRemovePress={item.onRemovePress}>
                    <ChooseWineSection title={item.title} />
                </HomePlacementSection>
            );
        }

        if (item.key === 'events' && item.events) {
            return (
                <HomePlacementSection onRemovePress={item.onRemovePress}>
                    <HomeEventSection
                        title={item.title}
                        events={item.events}
                        carouselHorizontalOffset={PLACEMENT_CAROUSEL_HORIZONTAL_OFFSET}
                    />
                </HomePlacementSection>
            );
        }

        if (item.key === 'people_talking' && item.peopleTalking) {
            return (
                <HomePlacementSection onRemovePress={item.onRemovePress}>
                    <PeopleTalkingSection
                        title={item.title}
                        data={item.peopleTalking}
                        carouselHorizontalOffset={PLACEMENT_CAROUSEL_HORIZONTAL_OFFSET}
                    />
                </HomePlacementSection>
            );
        }

        return <View />;
    }, []);

    if (isPlacementEditMode) {
        return (
            <Sortable.PortalProvider>
                <Animated.ScrollView
                    ref={scrollableRef}
                    contentContainerStyle={styles.placementContentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.placementListContainer}>
                        {hasConfiguredSections ? (
                            <Sortable.Grid
                                activeItemOpacity={0.96}
                                activeItemScale={1.02}
                                activeItemShadowOpacity={0.18}
                                autoScrollActivationOffset={autoScrollActivationOffset}
                                autoScrollMaxVelocity={autoScrollMaxVelocity}
                                columns={1}
                                data={sections}
                                dimensionsAnimationType="none"
                                dragActivationDelay={dragActivationDelay}
                                inactiveItemOpacity={0.78}
                                inactiveItemScale={1}
                                itemEntering={null}
                                itemExiting={null}
                                itemsLayoutTransitionMode="reorder"
                                keyExtractor={keyExtractor}
                                overDrag="vertical"
                                renderItem={renderPlacementItem}
                                reorderTriggerOrigin="touch"
                                rowGap={rowGap}
                                scrollableRef={scrollableRef}
                                strategy="insert"
                                onDragEnd={onReorderPlacementSections}
                            />
                        ) : (
                            <HomeEmptyState />
                        )}
                    </View>
                    <View style={styles.placementFooter}>
                        <Button
                            text={saveText}
                            type="main"
                            onPress={onSavePlacementPress}
                            inProgress={isSaving}
                            disabled={isSaving}
                        />
                    </View>
                </Animated.ScrollView>
            </Sortable.PortalProvider>
        );
    }

    return (
        <FlatList
            data={sections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={HomeEmptyState}
            ListFooterComponent={
                <View style={styles.footer}>
                    <Button text={addEntryText} type="main" onPress={onAddEntryPress} />
                    {shouldShowConfigurePlacementButton && (
                        <Button
                            text={configurePlacementText}
                            type="secondary"
                            onPress={onConfigurePlacementPress}
                        />
                    )}
                </View>
            }
            ListFooterComponentStyle={styles.listFooterContainer}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    tintColor={colors.primary}
                    colors={[colors.primary]}
                />
            }
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        />
    );
};
