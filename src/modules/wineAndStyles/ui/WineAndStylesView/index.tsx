import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { TabView } from 'react-native-tab-view';
import { TabBar } from '../components/TabBar';
import { useWineAndStylesTabs } from '../../presenters/useEventsListTabs';
import { useWineAndStylesView } from '../../presenters/useWineAndStylesView';
import { size } from '@/utils';
import { userModel } from '@/entities/users/UserModel';

export const WineAndStylesView = () => {
    const { t } = useUiContext();

    const { screenIndex, handleIndexChange } = useWineAndStylesTabs();
    const { routes, renderScene } = useWineAndStylesView();
    const hasPremium = userModel.user?.hasPremium || false;

    const handleIndexChangeWithPremiumCheck = (index: number) => {
        const isTasteProfileTab = routes[index]?.key === 'muTasteProfile';
        if (isTasteProfileTab && !hasPremium) {
            return;
        }
        handleIndexChange(index);
    };

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('wineAndStyles.wineAndStyles')} isCentered={false} />}
        >
         <TabView
                lazy
                swipeEnabled={hasPremium}
                renderTabBar={props => <TabBar tabBarProps={props} handleIndexChange={handleIndexChangeWithPremiumCheck} hasPremium={hasPremium} />}
                navigationState={{ index: screenIndex, routes }}
                renderScene={renderScene}
                onIndexChange={handleIndexChangeWithPremiumCheck}
                initialLayout={{ width: size.width }}
            />
        </ScreenContainer>
    );
};
