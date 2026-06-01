import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IHomeVisibleSection } from '../../types/IHomeVisibleSection';
import { getStyles } from './styles';
import { ChooseWineSection } from '../ChooseWineSection';
import { PeopleTalkingSection } from '../PeopleTalkingSection';
import { HomeEventSection } from '../HomeEventSection';
import { HomeEmptyState } from '../HomeEmptyState';
import { Button } from '@/UIKit/Button';

interface IProps {
    sections: IHomeVisibleSection[];
    isRefreshing: boolean;
    onRefresh: () => void;
    addEntryText: string;
    onAddEntryPress: () => void;
}

export const HomeConfiguredSections = ({
    sections,
    isRefreshing,
    onRefresh,
    addEntryText,
    onAddEntryPress,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

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

    return (
        <FlatList
            data={sections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={HomeEmptyState}
            ListFooterComponent={
                <View style={styles.footer}>
                    <Button text={addEntryText} type="main" onPress={onAddEntryPress} />
                </View>
            }
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
