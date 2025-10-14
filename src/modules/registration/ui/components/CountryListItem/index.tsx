import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Flag from 'react-native-round-flags';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { Country } from '@/modules/registration/presenters/usePhoneInputField';

interface IProps {
  item: Country;
  handleCountryPress: (item: Country) => void;
}

export const CountryListItem = memo(({ item, handleCountryPress }: IProps) => {
  const { colors } = useUiContext();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <TouchableOpacity onPress={() => handleCountryPress(item)} style={styles.container}>
      <View style={styles.mainContainer}>
        <Flag code={item.cca2} style={styles.flag} />
        <Typography variant="h5" text={item.name} style={styles.name}/>
      </View>
      <Typography variant="h6" text={item.callingCode} style={styles.text} />
    </TouchableOpacity>
  );
});

CountryListItem.displayName = 'CountryListItem';
