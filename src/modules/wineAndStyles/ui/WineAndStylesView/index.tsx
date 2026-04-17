import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { TabView } from 'react-native-tab-view';
import { TabBar } from '../components/TabBar';
import { useWineAndStylesTabs } from '../../presenters/useEventsListTabs';
import { useWineAndStylesView } from '../../presenters/useWineAndStylesView';
import { size } from '@/utils';

export const WineAndStylesView = () => {
    const { t } = useUiContext();
    const { routes, renderScene } = useWineAndStylesView();
    const { screenIndex, onIndexChange, hasPremium } = useWineAndStylesTabs({ routes });

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('wineAndStyles.wineAndStyles')} isCentered={false} />}
        >
            <TabView
                lazy
                swipeEnabled={hasPremium}
                renderTabBar={props => (
                    <TabBar tabBarProps={props} onIndexChange={onIndexChange} hasPremium={hasPremium} />
                )}
                navigationState={{ index: screenIndex, routes }}
                renderScene={renderScene}
                onIndexChange={onIndexChange}
                initialLayout={{ width: size.width }}
            />
        </ScreenContainer>
    );
};
