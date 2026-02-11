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

    const { screenIndex, handleIndexChange } = useWineAndStylesTabs();
    const { routes, renderScene } = useWineAndStylesView();

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('wineAndStyles.wineAndStyles')} isCentered={false} />}
        >
         <TabView
                lazy
                renderTabBar={props => <TabBar tabBarProps={props} handleIndexChange={handleIndexChange} />}
                navigationState={{ index: screenIndex, routes }}
                renderScene={renderScene}
                onIndexChange={handleIndexChange}
                initialLayout={{ width: size.width }}
            />
        </ScreenContainer>
    );
};
