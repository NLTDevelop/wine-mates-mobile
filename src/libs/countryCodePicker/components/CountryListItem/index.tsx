import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Flag from 'react-native-round-flags';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { ICountry } from '../../types/ICountry';

//TODO: Check after world-countries lib next updates
const FLAG_ALIASES: Record<string, string> = {
    UM: 'US', // Віддалені острови США → 🇺🇸
    DM: 'LC', // Домініка → 🇱🇨
    EH: 'MA', // Західна Сахара → 🇲🇦
    CG: 'CD', // Конго-Браззавіль → 🇨🇩
    XK: 'RS', // Косово → 🇷🇸
    BV: 'NO', // Острів Буве → 🇳🇴
    HM: 'AU', // Острови Герд і Макдоналд → 🇦🇺
    BL: 'FR', // Сен-Бертелемі → 🇫🇷
    MF: 'FR', // Сен-Мортен → 🇫🇷
    GF: 'FR', // Французька Гвіана → 🇫🇷
};

interface IProps {
    item: ICountry;
    handleCountryPress: (item: ICountry) => void;
    showCountryCode: boolean;
}

export const CountryListItem = memo(({ item, handleCountryPress, showCountryCode }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const firstLetter = item.name?.[0]?.toUpperCase() || '?';

    //TODO: Check after world-countries lib next updates
    const renderFlag = () => {
        if (item.cca2 === 'BY') {
            return (
                <View style={[styles.flag, styles.placeholderFlag]}>
                    <Typography variant="h6" text={firstLetter} style={styles.placeholderText} />
                </View>
            );
        }

        const code = FLAG_ALIASES[item.cca2] || item.cca2;

        try {
            return <Flag code={code} style={styles.flag} />;
        } catch {
            return (
                <View style={[styles.flag, styles.placeholderFlag]}>
                    <Typography variant="h6" text={firstLetter} style={styles.placeholderText} />
                </View>
            );
        }
    };

    return (
        <TouchableOpacity onPress={() => handleCountryPress(item)} style={styles.container}>
            <View style={styles.mainContainer}>
                {renderFlag()}
                <Typography variant="h5" text={item.name} style={styles.name} />
            </View>
            {showCountryCode && <Typography variant="h6" text={item.callingCode} style={styles.text} />}
        </TouchableOpacity>
    );
});

CountryListItem.displayName = 'CountryListItem';
