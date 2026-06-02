import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { getStyles } from './styles';
import { useProfileDetails } from './presenters/useProfileDetails';
import { ProfileAvatarExpertiseLevel } from './components/ProfileAvatarExpertiseLevel';
import { ProfileDetailsField } from './components/ProfileDetailsField';
import { Typography } from '@/UIKit/Typography';

export const ProfileDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        avatarUrl,
        fullName,
        expertiseLevel,
        expertiseLabel,
        phoneCca2,
        phoneText,
        fields,
        onPressBack,
        onPressEdit,
        onPhoneChange,
        onCountryCodeChange,
    } = useProfileDetails();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
            headerComponent={
                <HeaderWithBackButton
                    title={t('settings.profileSettings')}
                    onPressBack={onPressBack}
                    rightComponent={
                        <TouchableOpacity onPress={onPressEdit} style={styles.editButton}>
                            <Typography text={t('settings.edit')} variant="body_500" style={styles.editButtonText} />
                        </TouchableOpacity>
                    }
                />
            }
        >
            <View style={styles.container}>
                <ProfileAvatarExpertiseLevel
                    avatarUrl={avatarUrl}
                    fullName={fullName}
                    expertiseLabel={expertiseLabel}
                    expertiseLevel={expertiseLevel}
                />

                <View style={styles.fieldsContainer}>
                    <ProfileDetailsField text={fields.fullName.text} isPlaceholder={fields.fullName.isPlaceholder} />
                    <ProfileDetailsField text={fields.email.text} isPlaceholder={fields.email.isPlaceholder} />
                    <PhoneInputField
                        value={phoneText}
                        onChangeText={onPhoneChange}
                        onChangeCountryCode={onCountryCodeChange}
                        editable={false}
                        initialCca2={phoneCca2}
                        placeholder={t('settings.phoneNumber')}
                    />
                    <ProfileDetailsField text={fields.country.text} isPlaceholder={fields.country.isPlaceholder} />
                    <ProfileDetailsField text={fields.city.text} isPlaceholder={fields.city.isPlaceholder} />
                    <ProfileDetailsField text={fields.birthday.text} isPlaceholder={fields.birthday.isPlaceholder} />
                    <ProfileDetailsField text={fields.gender.text} isPlaceholder={fields.gender.isPlaceholder} />
                    <ProfileDetailsField text={fields.occupation.text} isPlaceholder={fields.occupation.isPlaceholder} />
                    <ProfileDetailsField
                        text={fields.placeOfWork.text}
                        isPlaceholder={fields.placeOfWork.isPlaceholder}
                    />
                    <ProfileDetailsField
                        text={fields.selectedCurrency.text}
                        isPlaceholder={fields.selectedCurrency.isPlaceholder}
                    />
                    <ProfileDetailsField
                        text={fields.instagram.text}
                        isPlaceholder={fields.instagram.isPlaceholder}
                        leftIcon={<InstagramIcon color={colors.text} />}
                    />
                    <ProfileDetailsField text={fields.website.text} isPlaceholder={fields.website.isPlaceholder} />
                    <ProfileDetailsField text={fields.bio.text} isPlaceholder={fields.bio.isPlaceholder} />
                </View>
            </View>
        </ScreenContainer>
    );
});
