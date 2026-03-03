import { useMemo } from 'react';
import { getStyles } from './styles';
import { ScrollView, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HomeScreenHeader } from '@/modules/home/components/HomeScreenHeader';
import { WineOfTheDay } from '@/modules/home/components/WineOfTheDay';

export const HomeView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer edges={['top']} scrollEnabled={false}>
            <HomeScreenHeader />

            <ScrollView style={styles.container}>

                <View style={styles.content}>
                    <WineOfTheDay />
                </View>

            </ScrollView>

        </ScreenContainer>
        // </WithErrorHandler>
    );
};
