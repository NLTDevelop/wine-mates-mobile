import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { observer } from 'mobx-react-lite';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { useSavedWines } from '../../presenters/useSavedWines';
import { Button } from '@/UIKit/Button';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { useRefresh } from '@/hooks/useRefresh';
import { Loader } from '@/UIKit/Loader';
import { SavedWineListItem } from '../components/SavedWineListItem';
import { ISavedWinesListItem } from '@/entities/wine/types/ISavedWinesListItem';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CreateListBottomSheet } from '../components/CreateListBottomSheet';
import { useCreateListBottomSheet } from '../../presenters/useCreateListBottomSheet';

const MOCK_DATA: ISavedWinesListItem[] = [
    {
        id: 1,
        listName: 'Weekend picks',
        wines: [
            {
                id: 101,
                name: 'Cabernet Sauvignon Reserve',
                vintage: 2018,
                grapeVariety: 'Cabernet Sauvignon',
                producer: 'Oak Valley',
                createdAt: '2024-01-10T12:00:00Z',
                userId: 42,
                review_average: '4.6',
                review_count: 18,
                description: 'Structured red with blackberry, cedar, and long finish.',
                user: { firstName: 'Emma', lastName: 'Stone', image_url: '' },
                image: {
                    name: 'pinot-noir.jpg',
                    originalName: 'pinot-noir.jpg',
                    mimetype: 'image/jpeg',
                    size: 152000,
                    smallUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=200',
                    mediumUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=400',
                    originalUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=800',
                },
            },
            {
                id: 102,
                name: 'Chardonnay Estate',
                vintage: 2020,
                grapeVariety: 'Chardonnay',
                producer: 'Golden Hills',
                createdAt: '2024-02-05T09:00:00Z',
                userId: 42,
                review_average: '4.3',
                review_count: 9,
                description: 'Bright citrus, apple, and subtle oak.',
                user: { firstName: 'Emma', lastName: 'Stone', image_url: '' },
                image: {
                    name: 'pinot-noir.jpg',
                    originalName: 'pinot-noir.jpg',
                    mimetype: 'image/jpeg',
                    size: 152000,
                    smallUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=200',
                    mediumUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=400',
                    originalUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=800',
                },
            },
        ],
    },
    {
        id: 2,
        listName: 'For gifts',
        wines: [
            {
                id: 201,
                name: 'Pinot Noir Signature',
                vintage: 2019,
                grapeVariety: 'Pinot Noir',
                producer: 'Silver Crest',
                createdAt: '2024-03-12T15:30:00Z',
                userId: 7,
                review_average: '4.8',
                review_count: 23,
                description: 'Silky tannins with cherry and forest floor notes.',
                user: { firstName: 'Liam', lastName: 'Brown', image_url: '' },
                image: {
                    name: 'pinot-noir.jpg',
                    originalName: 'pinot-noir.jpg',
                    mimetype: 'image/jpeg',
                    size: 152000,
                    smallUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=200',
                    mediumUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=400',
                    originalUrl: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=800',
                },
            },
            {
                id: 202,
                name: 'Riesling Classic',
                vintage: 2021,
                grapeVariety: 'Riesling',
                producer: 'Riverbend',
                createdAt: '2024-04-01T18:45:00Z',
                userId: 7,
                review_average: '4.1',
                review_count: 7,
                description: 'Crisp stone fruit, lime zest, and floral aroma.',
                user: { firstName: 'Liam', lastName: 'Brown', image_url: '' },
                image: {
                    name: 'riesling.jpg',
                    originalName: 'riesling.jpg',
                    mimetype: 'image/jpeg',
                    size: 138000,
                    smallUrl: 'https://images.unsplash.com/photo-1528697203043-733dafdaa316?w=200',
                    mediumUrl: 'https://images.unsplash.com/photo-1528697203043-733dafdaa316?w=400',
                    originalUrl: 'https://images.unsplash.com/photo-1528697203043-733dafdaa316?w=800',
                },
            },
        ],
    },
];

export const SavedWinesView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isLoading, wines, isError, getSavedWines } = useSavedWines();
    const { refreshControl } = useRefresh(getSavedWines);
    const  { createListModalRef, listName, setListName, onClose, onOpen, onCreate } = useCreateListBottomSheet();

    const keyExtractor = useCallback((item: ISavedWinesListItem) => `${item.id}`, []);
    const renderItem = useCallback(
        ({ item }: { item: ISavedWinesListItem }) => <SavedWineListItem title={item.listName} data={item.wines} />, []);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getSavedWines}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('savedWine.savedWine')} isCentered={false} />}
            >
                {isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <FlatList
                            data={wines || MOCK_DATA}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            refreshControl={refreshControl}
                            // onEndReached={onEndReached}
                            contentContainerStyle={styles.containerStyle}
                            // ListFooterComponent={isLoading && wines?.length ? <ListFooterLoader /> : null}
                        />
                        <Button
                            text={t('savedWine.createList')}
                            onPress={onOpen}
                            type="secondary"
                            LeftAccessory={
                                <View style={styles.plusIconContainer}>
                                    <PlusIcon />
                                </View>
                            }
                            containerStyle={styles.button}
                        />
                    </View>
                )}
                <CreateListBottomSheet
                    modalRef={createListModalRef}
                    value={listName}
                    onChangeValue={setListName}
                    onCreate={onCreate}
                    onClose={onClose}
                />
            </ScreenContainer>
        </WithErrorHandler>
    );
});
