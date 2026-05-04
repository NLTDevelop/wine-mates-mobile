import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Loader } from '@/UIKit/Loader';
import { Button } from '@/UIKit/Button';
import { IContactsListItem } from '@/entities/contacts/types/IContactsListItem';
import { useRefresh } from '@/hooks/useRefresh';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { getStyles } from './styles';
import { useContactsList } from './presenters/useContactsList';
import { ContactsListItem } from './components/ContactsListItem';
import { ContactInfoModal } from './components/ContactInfoModal';

export const ContactInfoView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        data,
        isLoading,
        getList,
        onAddPress,
        onEditContact,
        isModalVisible,
        contactValue,
        setContactValue,
        onCloseModal,
        onSaveContact,
        isSaving,
        modalTitle,
        isSaveDisabled,
    } = useContactsList();
    const { refreshControl } = useRefresh(getList);

    function keyExtractor(item: IContactsListItem, index: number) {
        return `${item.id}-${index}`;
    }

    function renderItem({ item }: { item: IContactsListItem }) {
        return <ContactsListItem item={item} onEditContact={onEditContact} />;
    }

    return (
        <>
            <ScreenContainer
                edges={['top']}
                withGradient
                scrollEnabled={false}
                headerComponent={<HeaderWithBackButton title={t('contactInfo.contacts')} isCentered />}
            >
                {isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <FlatList
                            data={data}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            refreshControl={refreshControl}
                            style={styles.list}
                            contentContainerStyle={styles.contentContainerStyle}
                            showsVerticalScrollIndicator={false}
                        />
                        <Button
                            type="secondary"
                            onPress={onAddPress}
                            text={t('contactInfo.addContact')}
                            LeftAccessory={
                                <View style={styles.addContainer}>
                                    <PlusIcon />
                                </View>
                            }
                            textStyle={styles.buttonText}
                        />
                    </View>
                )}
            </ScreenContainer>

            {isModalVisible && (
                <ContactInfoModal
                    isVisible={isModalVisible}
                    title={modalTitle}
                    value={contactValue}
                    onChangeValue={setContactValue}
                    onClose={onCloseModal}
                    onSave={onSaveContact}
                    isSaving={isSaving}
                    isSaveDisabled={isSaveDisabled}
                />
            )}
        </>
    );
});
