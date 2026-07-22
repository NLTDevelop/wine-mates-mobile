import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IEditableProfileLink } from '@/modules/profile/types/IEditableProfileLink';
import { EditableProfileLinkItem } from '../EditableProfileLinkItem';
import { getStyles } from './styles';

interface IProps {
    items: IEditableProfileLink[];
    onAdd: () => void;
}

export const EditableProfileLinks = ({ items, onAdd }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const renderItem = useCallback<ListRenderItem<IEditableProfileLink>>(({ item }) => {
        return <EditableProfileLinkItem item={item} />;
    }, []);
    const keyExtractor = useCallback((item: IEditableProfileLink) => item.id, []);

    return (
        <>
            <Typography text={t('settings.socialMediaLinks')} variant="body_500" style={styles.label} />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                scrollEnabled={false}
                contentContainerStyle={styles.list}
            />
            <TouchableOpacity onPress={onAdd} style={styles.addButton}>
                <Typography text={t('settings.addWineryLink')} variant="body_500" style={styles.addButtonText} />
            </TouchableOpacity>
        </>
    );
};
