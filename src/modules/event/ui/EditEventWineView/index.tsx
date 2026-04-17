import { useMemo } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';

type Route = RouteProp<EventStackParamList, 'EditEventWineView'>;

export const EditEventWineView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const route = useRoute<Route>();

    return (
        <ScreenContainer
            edges={['top']}
            scrollEnabled
            headerComponent={<HeaderWithBackButton title={t('event.editWine')} isCentered={false} />}
        >
            <Typography
                variant="h6"
                text={`${t('event.editWine')} #${route.params.wineId}`}
                style={styles.title}
            />
            <Typography
                variant="body_400"
                text={t('event.editWineStubDescription')}
                style={styles.description}
            />
        </ScreenContainer>
    );
};
