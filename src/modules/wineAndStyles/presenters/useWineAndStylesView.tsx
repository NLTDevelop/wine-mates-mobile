import { useCallback, useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { MyWine } from '../ui/components/MyWine';
import { MyTasteProfile } from '../ui/components/MyTasteProfile';

export const useWineAndStylesView = () => {
    const { t } = useUiContext();

    const routes = useMemo(() => [
        { key: 'myWine', title: t('wineAndStyles.myWine') },
        { key: 'muTasteProfile', title: t('wineAndStyles.myTasteProfile') },
    ], [t]);

    const renderScene = useCallback(({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case 'myWine':
                return <MyWine />;
            case 'muTasteProfile':
                return <MyTasteProfile />;
            default:
                return null;
        }
    }, []);

    return { routes, renderScene };
};
