import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IEditableWineryLink } from '@/modules/profile/types/IEditableWineryLink';
import { EditableWineryLinkItem } from '../EditableWineryLinkItem';
import { getStyles } from './styles';

interface IProps {
    items: IEditableWineryLink[];
    onAdd: () => void;
}

export const EditableWineryLinks = ({ items, onAdd }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const renderItem = useCallback<ListRenderItem<IEditableWineryLink>>(({ item }) => {
        return <EditableWineryLinkItem item={item} />;
    }, []);
    const keyExtractor = useCallback((item: IEditableWineryLink) => item.id, []);

    return (
        <>
            <Typography text={t('settings.wineryLinks')} variant="body_500" style={styles.label} />
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
