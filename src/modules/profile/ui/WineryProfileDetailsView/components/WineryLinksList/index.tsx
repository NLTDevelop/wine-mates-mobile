import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineryLinkItem } from '@/modules/profile/types/IWineryLinkItem';
import { WineryLinkItem } from './components/WineryLinkItem';
import { getStyles } from './styles';

interface IProps {
    label: string;
    items: IWineryLinkItem[];
}

export const WineryLinksList = ({ label, items }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const renderItem = useCallback<ListRenderItem<IWineryLinkItem>>(({ item }) => {
        return <WineryLinkItem item={item} />;
    }, []);
    const keyExtractor = useCallback((item: IWineryLinkItem) => item.id, []);

    return (
        <>
            <Typography text={label} variant="body_500" style={styles.label} />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                scrollEnabled={false}
                contentContainerStyle={styles.list}
            />
        </>
    );
};
