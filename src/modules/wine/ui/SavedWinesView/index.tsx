import { useCallback, useEffect, useMemo } from 'react';
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
import { IFavoriteWineList } from '@/entities/wine/types/IFavoriteWineList';
import { CreateListBottomSheet } from '../components/CreateListBottomSheet';
import { useCreateListBottomSheet } from '../../presenters/useCreateListBottomSheet';
import { useDeleteFavoriteList } from '../../presenters/useDeleteFavoriteList';
import { DeleteListAlert } from './components/DeleteListAlert';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    FavoriteWineListView: {
        listId: number;
        listName: string;
    };
};

export const SavedWinesView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { isLoading, lists, isError, getSavedWines } = useSavedWines();
    const { refreshControl } = useRefresh(getSavedWines);
    const { createListModalRef, listName, setListName, onClose, onOpen, onCreate, isCreating } = useCreateListBottomSheet();
    const { onDeleteList, isDeleting, isAlertVisible, selectedList, onCloseAlert, onConfirmDelete } = useDeleteFavoriteList();

    useEffect(() => {
        getSavedWines();
    }, [getSavedWines]);

    const onListPress = useCallback(
        (id: number, name: string) => {
            navigation.navigate('FavoriteWineListView', { listId: id, listName: name });
        },
        [navigation],
    );

    const keyExtractor = useCallback((item: IFavoriteWineList, index: number) => `${item.id || index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: IFavoriteWineList }) => (
            <SavedWineListItem
                listId={item.id}
                title={item.name}
                onPress={() => onListPress(item.id, item.name)}
                onLongPress={() => onDeleteList(item.id, item.name)}
            />
        ),
        [onListPress, onDeleteList],
    );

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
                            data={lists || []}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            refreshControl={refreshControl}
                            contentContainerStyle={styles.containerStyle}
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
                    isCreating={isCreating}
                />
                {selectedList && (
                    <DeleteListAlert
                        visible={isAlertVisible}
                        onClose={onCloseAlert}
                        onConfirm={onConfirmDelete}
                        listName={selectedList.name}
                        isLoading={isDeleting}
                    />
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
