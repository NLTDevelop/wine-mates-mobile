import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { View } from 'react-native';

/*import { Typography } from '@/UIKit/Typography';
import { ScrollView, View } from 'react-native';
import { WineOfTheDay } from '@/modules/home/components/WineOfTheDay';*/

export const HomeView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer edges={[]} scrollEnabled={false}>

            {/*TODO: make available at future
            <ScrollView style={styles.container}>

                <View style={styles.content}>
                    <WineOfTheDay />
                </View>

            </ScrollView>*/}

            <View style={styles.container}>
                <Typography text={'Home Screen'} variant="h3"/>
            </View>

        </ScreenContainer>
        // </WithErrorHandler>
    );
};
