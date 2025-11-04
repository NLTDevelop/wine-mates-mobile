import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { ColorButton } from '../components/ColorButton';
import { useWineLook } from '../../presenters/useWineLook';
import { SimpleSlider } from '../components/SimpleSlider';
import { ShadeSelector } from '../components/ShadeSelector';
import { CloseButton } from '../components/CloseButton';

interface IColor {
    color: string;
    colorName: string;
}

export const WineLookView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, perlage, setPerlage, mousse, setMousse, shade, setShade } = useWineLook();

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('wine.look')} rightComponent={<CloseButton onPress={() => {}}/>}/>}
            scrollEnabled
        >
            <View style={styles.container}>
                <View>
                    <Typography text={t('wine.lookDescription')} variant="body_400" style={styles.title} />
                    <Typography text={t('wine.selectColor')} variant="h4" style={styles.label} />
                    <View style={styles.colorsContainer}>
                        {data.colors.map((item: IColor, index: number) => (
                            <ColorButton key={index} color={item} isActive={false} onPress={() => {}} />
                        ))}
                    </View>
                    <Typography text={t('wine.selectShade')} variant="h4" style={styles.label} />
                    <ShadeSelector value={shade} onChange={setShade} selectedColor={data.colors[3].color}/>

                    <Typography text={t('wine.result')} variant="h4" style={styles.label} />
                    <View style={[styles.resultColor, { backgroundColor: data.colors[3].color }]} />

                    <Typography text={t('wine.selectMousse')} variant="h4" style={styles.label} />
                    <SimpleSlider value={mousse} onChange={setMousse} />

                    <Typography text={t('wine.selectPerlage')} variant="h4" style={styles.label} />
                    <SimpleSlider value={perlage} onChange={setPerlage}/>
                </View>
                <Button text={t('wine.letsSmell')} onPress={() => {}} containerStyle={styles.button} />
            </View>
        </ScreenContainer>
        // </WithErrorHandler>
    );
};
