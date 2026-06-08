import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { Keyboard, Pressable, View } from 'react-native';
import {FlatListIndicator} from '@fanchenbao/react-native-scroll-indicator';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { SelectedParameters } from '../../../../UIKit/SelectedParameters';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { SmellListItem } from '../../../../UIKit/SmellListItem';
import { CustomInput } from '@/UIKit/CustomInput';
import { useAddItem } from '../../presenters/useAddItem';
import { AddButton } from '../components/AddButton';
import { useAnimatedItemAdd } from '../../presenters/useAnimatedItemAdd';
import { IWineTasteGroup } from '@/entities/wine/types/IWineTatseGroup';
import { SelectModal } from '../../../../UIKit/SelectModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { scaleVertical } from '@/utils';
import { SelectedItemsList } from '@/UIKit/SelectedItemsList';
import { useTastingTasteSelectModal } from './presenters/useTastingTasteSelectModal';
import { useTastingWineTaste } from './presenters/useTastingWineTaste';
import { wineModel } from '@/entities/wine/models/WineModel';

export const TastingWineTasteView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isVisible, onShowModal, onHide, selectData, groupId } = useTastingTasteSelectModal();
    const { data, selected, isError, getTastes, isLoading, onItemPress: originalOnItemPress, onSelectedItemPress, onAddCustomTaste: originalOnAddCustomTaste,
        onPressNext, isSaving, isSelectedParametersVisible } = useTastingWineTaste(onHide);

    const [onItemPress, selectedListRef] = useAnimatedItemAdd(originalOnItemPress);
    const [onAddCustomTaste] = useAnimatedItemAdd(originalOnAddCustomTaste);

    const { text, setText, onAddPress } = useAddItem(onAddCustomTaste);

    const visibleGroups = useMemo(() => data.filter(group => group.flavors.length > 0), [data]);
    const createOnGroupPress = useCallback((group: IWineTasteGroup) => {
        return () => {
            onShowModal(group);
        };
    }, [onShowModal]);
    const keyExtractor = useCallback((item: IWineTasteGroup, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(({ item }: { item: IWineTasteGroup }) => (
        <SmellListItem item={item} onPress={createOnGroupPress(item)} />
    ), [createOnGroupPress]);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getTastes} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.taste')} />}
            >
                {!wineModel.tastes || wineModel.tastes.length === 0 || isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <KeyboardAwareScrollView
                            style={styles.mainContainer}
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled
                            bottomOffset={scaleVertical(24)}
                            showsVerticalScrollIndicator={false}
                        >
                            <Pressable style={styles.scrollContent} onPress={Keyboard.dismiss}>
                                <Typography text={t('wine.tasteDescription')} variant="body_400" style={styles.title} />

                                {visibleGroups.length > 0 && (
                                    <FlatListIndicator
                                        flatListProps={{
                                            data: visibleGroups,
                                            keyExtractor,
                                            renderItem,
                                            style: styles.list,
                                            contentContainerStyle: styles.contentContainer,
                                            nestedScrollEnabled: true,
                                        }}
                                        indStyle={styles.indicator}
                                    />
                                )}
                                <CustomInput
                                    value={text}
                                    onChangeText={setText}
                                    maxLength={40}
                                    placeholder={t('wine.addCustomTaste')}
                                    RightAccessory={<AddButton onPress={onAddPress} disabled={!text}/>}
                                    containerStyle={styles.input}
                                />
                                {selected.length > 0 && <SelectedItemsList ref={selectedListRef} data={selected} onPress={onSelectedItemPress} />}
                                {isSelectedParametersVisible ? <SelectedParameters /> : null}
                            </Pressable>
                        </KeyboardAwareScrollView>
                        <Button
                            text={t('wine.letsTaste')}
                            onPress={onPressNext}
                            inProgress={isSaving}
                            containerStyle={styles.button}
                            RightAccessory={<NextLongArrowIcon />}
                            disabled={!selected.length}
                        />
                    </View>
                )}
                <SelectModal
                    isVisible={isVisible}
                    onHide={onHide}
                    onItemPress={onItemPress}
                    data={selectData}
                    subgroupId={null}
                    groupId={groupId}
                />
            </ScreenContainer>
        </WithErrorHandler>
    );
});
