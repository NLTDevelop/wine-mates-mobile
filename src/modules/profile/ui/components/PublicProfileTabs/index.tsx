import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IPublicProfileTabItem } from '@/modules/profile/types/IPublicProfileTabItem';
import { PublicProfileTabItem } from '@/modules/profile/ui/components/PublicProfileTabItem';
import { getStyles } from './styles';

interface IProps {
    items: IPublicProfileTabItem[];
}

export const PublicProfileTabs = ({ items }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <PublicProfileTabItem item={items[0]} />
            <PublicProfileTabItem item={items[1]} />
            <PublicProfileTabItem item={items[2]} />
            <PublicProfileTabItem item={items[3]} />
        </View>
    );
};
