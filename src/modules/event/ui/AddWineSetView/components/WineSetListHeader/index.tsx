import { RefObject, useMemo } from 'react';
import { ListRenderItem, TextInput, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useUiContext } from '@/UIProvider';
import { SearchBar } from '@/UIKit/SearchBar';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { IWineSearchResultViewItem } from '@/modules/event/types/IWineSetViewItem';
import { WineSearchResultRow } from '../WineSearchResultRow';
import { getStyles } from './styles';
import { useWineSetListHeader } from './presenters/useWineSetListHeader';

interface IProps {
    searchInputRef: RefObject<TextInput | null>;
    searchQuery: string;
    onChangeSearchQuery: (value: string) => void;
    wineSearchResultItems: IWineSearchResultViewItem[];
    shouldShowScannerButton: boolean;
    maxVisibleSearchResults: number;
    tastingTypeLabel: string;
    onOpenScannerPress: () => void;
    onFocusSearchInput: () => void;
    onOpenTastingTypeModal: () => void;
    onCloseSearchList: () => void;
}

export const WineSetListHeader = ({
    searchInputRef,
    searchQuery,
    onChangeSearchQuery,
    wineSearchResultItems,
    shouldShowScannerButton,
    maxVisibleSearchResults,
    tastingTypeLabel,
    onOpenScannerPress,
    onFocusSearchInput,
    onOpenTastingTypeModal,
    onCloseSearchList,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        isSearchSectionVisible,
        isSearchResultsVisible,
        isSearchResultsScrollable,
    } = useWineSetListHeader({
        wineSearchResultItems,
        shouldShowScannerButton,
        maxVisibleSearchResults,
    });

    const searchResultKeyExtractor = (item: IWineSearchResultViewItem) => `${item.id}`;

    const renderWineSearchResult: ListRenderItem<IWineSearchResultViewItem> = function renderWineSearchResult({ item }) {
        return <WineSearchResultRow title={item.title} subtitle={item.subtitle} onPress={item.onPress} />;
    };

    const renderSearchResultDivider = function renderSearchResultDivider() {
        return <View style={styles.searchResultDivider} />;
    };

    return (
        <View style={styles.container}>
            <SearchBar
                ref={searchInputRef}
                value={searchQuery}
                onChangeText={onChangeSearchQuery}
                onFocus={onFocusSearchInput}
                onBlur={onCloseSearchList}
                placeholder={t('common.search')}
                containerStyle={styles.searchBar}
            />
            {isSearchSectionVisible && (
                <View style={styles.searchResultsContainer}>
                    {isSearchResultsVisible ? (
                        <FlatList
                            data={wineSearchResultItems}
                            keyExtractor={searchResultKeyExtractor}
                            renderItem={renderWineSearchResult}
                            scrollEnabled={isSearchResultsScrollable}
                            nestedScrollEnabled
                            directionalLockEnabled
                            keyboardShouldPersistTaps="always"
                            ItemSeparatorComponent={renderSearchResultDivider}
                            style={styles.searchResultsList}
                        />
                    ) : (
                        <View style={styles.emptySearchContainer}>
                            <Typography
                                variant="body_400"
                                text={t('common.nothingFoundTitle')}
                                style={styles.emptySearchText}
                            />
                            <Button
                                text={t('event.searchWineWithScanner')}
                                onPress={onOpenScannerPress}
                                type="secondary"
                            />
                        </View>
                    )}
                </View>
            )}
            <TouchableOpacity style={styles.tastingTypeButton} onPress={onOpenTastingTypeModal}>
                <Typography variant="h6" text={tastingTypeLabel} style={styles.tastingTypeButtonText} />
                <ArrowDownIcon />
            </TouchableOpacity>
        </View>
    );
};
