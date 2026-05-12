import { IGuestTabItem } from '@/modules/event/ui/EventDetailsView/types/IGuestRoute';
import { memo, useMemo } from 'react';
import { GuestsTabItemView } from '../guestsTabItemView';
import { View } from 'react-native';
import { getStyles } from './styles';

interface IProps {
    tabs: IGuestTabItem[];
}

const GuestTabViewComponent = ({ tabs }: IProps) => {
    const styles = useMemo(() => getStyles(), []);

    const tabItems = useMemo(() => {
        return tabs.map(tab => (
            <GuestsTabItemView key={tab.value} tabName={tab.label} onPress={tab.onPress} isActive={tab.isActive} />
        ));
    }, [tabs]);

    return <View style={styles.container}>{tabItems}</View>;
};

export const GuestTabsView = memo(GuestTabViewComponent);
