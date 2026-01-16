import { useCallback, useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { TabView } from 'react-native-tab-view';
import { TabBar } from '../components/TabBar';
import { useWineAndStylesTabs } from '../../presenters/useEventsListTabs';
import { size } from '@/utils';
import { MyWine } from '../components/MyWine';
import { MyTasteProfile } from '../components/MyTasteProfile';

export const WineAndStylesView = () => {
    const { t } = useUiContext();

    const { screenIndex, handleIndexChange } = useWineAndStylesTabs();

    const routes = useMemo(() => [
        { key: 'myWine', title: t('wineAndStyles.myWine') },
        { key: 'muTasteProfile', title: t('wineAndStyles.myTasteProfile') },
    ], [t]);

    const renderScene = useCallback(() => screenIndex ? <MyTasteProfile/> : <MyWine/>, [screenIndex]);

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
