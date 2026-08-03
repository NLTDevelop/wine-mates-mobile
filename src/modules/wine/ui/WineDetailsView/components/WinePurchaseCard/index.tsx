import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { LinearGradient } from 'react-native-linear-gradient';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWinePurchaseCard } from '@/modules/wine/types/IWinePurchaseCard';
import { getStyles } from './styles';
import { useWinePurchaseCard } from './presenters/useWinePurchaseCard';

const IMAGE_GRADIENT_COLORS = ['rgba(0, 0, 0, 0.94)', 'rgba(0, 0, 0, 0.58)', 'rgba(0, 0, 0, 0.04)'];
const PRICE_GRADIENT_COLORS = ['#910D0D', '#410202'];
const GRADIENT_START = { x: 0, y: 0.5 };
const GRADIENT_END = { x: 1, y: 0.5 };

interface IProps {
    item: IWinePurchaseCard;
}

export const WinePurchaseCard = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { logoAspectRatioStyle, onLogoLoad } = useWinePurchaseCard();

    return (
        <TouchableOpacity style={styles.container} onPress={item.onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                {item.imageUrl ? (
                    <FastImage
                        source={{ uri: item.imageUrl }}
                        style={styles.image}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                ) : null}
                <LinearGradient
                    colors={IMAGE_GRADIENT_COLORS}
                    locations={[0, 0.52, 1]}
                    start={GRADIENT_START}
                    end={GRADIENT_END}
                    style={styles.imageGradient}
                />
                <View style={styles.content}>
                    <Typography variant="subtitle_20_700" style={styles.title}>
                        {item.titlePrefix}
                        <Typography variant="subtitle_20_700" style={styles.titleHighlight}>
                            {item.titleHighlight}
                        </Typography>
                    </Typography>
                    <View style={styles.logoContainer}>
                        {item.logoUrl ? (
                            <>
                                <FastImage
                                    source={{ uri: item.logoUrl }}
                                    style={[styles.logo, logoAspectRatioStyle]}
                                    resizeMode={FastImage.resizeMode.contain}
                                    onLoad={onLogoLoad}
                                />
                                <Typography text="X" variant="subtitle_12_400" style={styles.logoDivider} />
                            </>
                        ) : null}
                        <FastImage
                            source={require('@assets/images/app_icon.png')}
                            style={styles.wineMatesLogo}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>
                </View>
            </View>
            {item.priceText ? (
                <View style={styles.priceContainer}>
                    <LinearGradient
                        colors={PRICE_GRADIENT_COLORS}
                        locations={[0, 0.92]}
                        start={GRADIENT_START}
                        end={GRADIENT_END}
                        style={styles.priceGradient}
                    />
                    <Typography
                        text={item.priceText}
                        variant="subtitle_12_500"
                        style={styles.priceText}
                        numberOfLines={1}
                    />
                </View>
            ) : null}
        </TouchableOpacity>
    );
};
