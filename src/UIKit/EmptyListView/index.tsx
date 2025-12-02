import { ReactElement, useMemo } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '../../UIProvider';
import { Typography } from '../Typography';
import { observer } from 'mobx-react-lite';

interface IProps {
    text?: string;
    description?: string;
    image?: ReactElement;
    BottomElement?: ReactElement;
    isLoading?: boolean;
    isNothingFound?: boolean;
}

export const EmptyListView = observer(({ text, description, image, BottomElement, isLoading, isNothingFound }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        isLoading
            ? <View style={styles.container}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
            : isNothingFound
                ? <View style={styles.container}>
                    <Image source={require('@assets/images/nothing_found.png')} style={styles.image} />
                    <Typography variant='h5' style={styles.title} >{t('common.nothingFoundTitle')}</Typography>
                    <Typography variant='body_500' style={styles.description} >{t('common.nothingFoundDescription')}</Typography>
                </View>
                : <View style={styles.container}>
                    {image}
                    {text && <Typography variant='h5' style={styles.title} >{text}</Typography>}
                    {description && <Typography variant='body_500' style={styles.description} >{description}</Typography>}
                    {BottomElement}
                </View>
    );
});
