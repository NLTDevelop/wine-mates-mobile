import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IProfileLinkItem } from '@/modules/profile/types/IProfileLinkItem';
import { ProfileLinkItem } from '@/modules/profile/ui/components/ProfileLinkItem';
import { getStyles } from './styles';

interface IProps {
    label: string;
    items: IProfileLinkItem[];
}

export const ProfileLinksList = ({ label, items }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const renderItem = useCallback<ListRenderItem<IProfileLinkItem>>(({ item }) => {
        return <ProfileLinkItem item={item} />;
    }, []);
    const keyExtractor = useCallback((item: IProfileLinkItem) => item.id, []);

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
