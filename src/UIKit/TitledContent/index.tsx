import { memo, useMemo, ReactNode } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { TitleVariant, Typography } from '@/UIKit/Typography';
import { RoundedButton } from '@/UIKit/TitledContent/components/RoundedButton';

interface IProps {
    title: string;
    children: ReactNode;
    rightComponent?: ReactNode;
    titleVariant?: TitleVariant;
}

const TitledContentComponent = ({ title, children, rightComponent, titleVariant = 'h5' }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography text={title} variant={titleVariant} />
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
