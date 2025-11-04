import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { useSelectedParameters } from '@/modules/scanner/presenters/useSelectedParameters';

interface IProps {
    details: {
        typeOfWine: string;
        wineryName: string;
        grapeVariety: string;
        vintage: string;
    };
}

export const SelectedParameters = ({ details }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isOpened, onPress } = useSelectedParameters();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={onPress}>
                <Typography variant="h4" text={t('wine.selectedParameters')} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
            {isOpened && (
                <>
                    <View style={styles.row}>
                        <Typography variant="h6" text={`${t('wine.typeOfWine')}: `} style={styles.label} />
                        <Typography variant="h5" text={details.typeOfWine} style={styles.text} />
                    </View>
                    <View style={styles.row}>
                        <Typography variant="h6" text={`${t('wine.wineryName')}: `} style={styles.label} />
                        <Typography variant="h5" text={details.wineryName} style={styles.text} />
                    </View>
                    <View style={styles.row}>
                        <Typography variant="h6" text={`${t('wine.grapeVariety')}: `} style={styles.label} />
                        <Typography variant="h5" text={details.grapeVariety} style={styles.text}/>
                    </View>
                    <View style={styles.row}>
                        <Typography variant="h6" text={`${t('wine.vintage')}: `} style={styles.label} />
                        <Typography variant="h5" text={details.vintage} style={styles.text}/>
                    </View>
                </>
            )}
        </View>
    );
};
