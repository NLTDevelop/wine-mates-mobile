import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import CountrySelect, { ICountry } from 'react-native-country-select';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CustomInput } from '@/UIKit/CustomInput';
import { getStyles } from './styles';
import { scaleVertical } from '@/utils';
import * as RNLocalize from 'react-native-localize';

interface IProps {
  value: string;
  onChangeText: (value: string) => void;
}

export const PhoneInputField = ({ value, onChangeText }: IProps) => {
  const { colors, t } = useUiContext();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const deviceCountry = (RNLocalize.getCountry?.() || 'UA').toUpperCase();
  const [visible, setVisible] = useState(false);

  const [country, setCountry] = useState<ICountry | null>(null);

  const fallbackDial = '+380';
  const fallbackFlagUri = `https://flagcdn.com/w160/${deviceCountry.toLowerCase()}.png`;

  const dialCode = country?.cca2 ?? fallbackDial;
  const flagUri = country?.flag ?? fallbackFlagUri;
  console.log(flagUri)

  const handleSelect = (item: ICountry) => {
    setCountry(item);
    setVisible(false);
  };

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '').replace(/^0+/, '');
    onChangeText(digits);
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.countryPill}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.flagCircle}>
        <Typography variant="body_500" style={styles.codeText}>
          {flagUri}
        </Typography>
        </View>
        <Typography variant="body_500" style={styles.codeText}>
          {dialCode}
        </Typography>
        <Typography variant="body_500" style={styles.caret}>
          ▾
        </Typography>
      </TouchableOpacity>

      <CustomInput
        value={value}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        placeholder={t('registration.mobileNumber')}
        containerStyle={{ marginBottom: 0, flex: 1 }}
        inputContainerStyle={{ height: scaleVertical(50) }}
      />

      <CountrySelect
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={handleSelect}
        // только те стили/пропсы, которые поддерживает твоя версия:
        // modalStyle={{ backgroundColor: colors.background }}
        style={{}} // если допустимо
      />
    </View>
  );
};
