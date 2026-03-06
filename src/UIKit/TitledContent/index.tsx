import { memo, useMemo, ReactNode } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { TitleVariant, Typography } from '@/UIKit/Typography';
import { RoundedButton } from '@/UIKit/TitledContent/components/RoundedButton';

interface IProps {
    title: string;
    children: ReactNode;
    leftComponent?: ReactNode;
    rightComponent?: ReactNode;
    titleVariant?: TitleVariant;
}

const TitledContentComponent = ({ title, children, leftComponent, rightComponent, titleVariant = 'h5' }: IProps) => {
    const { colors } = useUiContext();
    const hasLeft = !!leftComponent;
    const hasRight = !!rightComponent;
    const styles = useMemo(() => getStyles(colors, hasLeft, hasRight), [colors, hasLeft, hasRight]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {leftComponent && <View>{leftComponent}</View>}
                <Typography text={title} variant={titleVariant} style={styles.title} />
                {rightComponent && <View>{rightComponent}</View>}
            </View>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const MemoizedTitledContent = memo(TitledContentComponent);

export const TitledContent = Object.assign(MemoizedTitledContent, {
    RoundedButton,
});
