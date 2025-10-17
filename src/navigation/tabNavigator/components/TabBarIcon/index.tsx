import { useEffect, useMemo, useRef, useState } from 'react';
import { getStyle } from './styles';
import { useUiContext } from '../../../../UIProvider';
import LottieView, { AnimationObject } from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';

interface IProps {
    source: AnimationObject;
}

export const TabBarIcon = ({ source }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyle(colors), [colors]);
    const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
    const animationRef = useRef<LottieView>(null);
    const isScreenFocused = useIsFocused();

    useEffect(() => {
        if (isScreenFocused) {
            animationRef.current?.play();
        } else {
            animationRef.current?.reset();
        }
    }, [isScreenFocused, isAnimationLoaded]);

    const onAnimationLoaded = () => {
        if (!isAnimationLoaded) {
            setIsAnimationLoaded(true);
        }
    };

    return (
        <LottieView
            ref={animationRef}
            onAnimationLoaded={onAnimationLoaded}
            speed={1.6}
            loop={false}
            source={source}
            style={styles.animation}
            renderMode={'SOFTWARE'}
        />
    );
};
