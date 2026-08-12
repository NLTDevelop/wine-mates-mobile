import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IPublicProfileTabItem } from '@/modules/profile/types/IPublicProfileTabItem';
import { PublicProfileTabItem } from '@/modules/profile/ui/components/PublicProfileTabItem';
import { usePublicProfileTabs } from '@/modules/profile/ui/components/PublicProfileTabs/presenters/usePublicProfileTabs';
import { getStyles } from './styles';

interface IProps {
    items: IPublicProfileTabItem[];
}

export const PublicProfileTabs = ({ items }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { tabsScrollRef, onContentSizeChange } = usePublicProfileTabs({ items });

    return (
        <ScrollView
            ref={tabsScrollRef}
            horizontal
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={onContentSizeChange}
        >
            <PublicProfileTabItem item={items[0]} />
            <PublicProfileTabItem item={items[1]} />
            <PublicProfileTabItem item={items[2]} />
            <PublicProfileTabItem item={items[3]} />
        </ScrollView>
    );
};
