import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Typography } from '@/UIKit/Typography';
import { Avatar } from '@/UIKit/Avatar';
import { PhoneInputField } from '@/libs/countryCodePicker/components/PhoneInputField';
import { EditIcon } from '@assets/icons/EditIcon';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { WineLoverIcon } from '@assets/icons/WineLoverIcon.tsx';
import { WineExpertIcon } from '@assets/icons/WineExpertIcon.tsx';
import { WinemakerIcon } from '@assets/icons/WinemakerIcon.tsx';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum.ts';
import { scaleHorizontal } from '@/utils';
import { getStyles } from './styles';
import { useProfileDetails } from './presenters/useProfileDetails';

const EXPERTISE_SIZE = scaleHorizontal(16);

export const ProfileDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        avatarUrl,
        fullName,
        expertiseLevel,
        expertiseLabel,
        phoneCca2,
        phoneNationalNumber,
        email,
        country,
        city,
        birthdayDisplayText,
        gender,
        occupation,
        placeOfWork,
        instagramLink,
        website,
        bio,
        onPressBack,
        onPressEdit,
        onPhoneChange,
        onCountryCodeChange,
    } = useProfileDetails();

    const fullNameText = fullName || t('settings.fullName');
    const emailText = email || t('settings.email');
    const countryText = country || t('settings.country');
    const cityText = city || t('settings.city');
    const birthdayText = birthdayDisplayText || t('registration.birthday');
    const genderText = gender || t('settings.gender');
    const occupationText = occupation || t('settings.occupation');
    const placeOfWorkText = placeOfWork || t('settings.placeOfWork');
    const instagramText = instagramLink || t('settings.instagram');
    const websiteText = website || t('settings.website');
    const bioText = bio || t('settings.bio');
    const phoneText = phoneNationalNumber || '';

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
            headerComponent={(
                <HeaderWithBackButton
                    title={t('settings.profileSettings')}
                    onPressBack={onPressBack}
                    rightComponent={(
                        <Pressable onPress={onPressEdit} style={styles.editButton}>
                            <EditIcon width={20} height={20} color={colors.text} />
                        </Pressable>
                    )}
                />
            )}
        >
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Avatar
                        size={72}
                        avatarUrl={avatarUrl}
                        fullname={fullName}
                    />
                    <View style={styles.roleContainer}>
                        <Typography text={expertiseLabel} variant="subtitle_12_500" style={styles.roleText} />
                        {expertiseLevel === WineExperienceLevelEnum.LOVER && <WineLoverIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />}
                        {expertiseLevel === WineExperienceLevelEnum.EXPERT && <WineExpertIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />}
                        {expertiseLevel === WineExperienceLevelEnum.CREATOR && <WinemakerIcon width={EXPERTISE_SIZE} height={EXPERTISE_SIZE} />}
                    </View>
                </View>

                <View style={styles.fieldsContainer}>
                    <View style={styles.field}>
                        <Typography text={fullNameText} variant="h6" style={fullName ? styles.fieldText : styles.placeholderText} />
                    </View>
                    <View style={styles.field}>
                        <Typography text={emailText} variant="h6" style={email ? styles.fieldText : styles.placeholderText} />
                    </View>

                    <PhoneInputField
                        value={phoneText}
                        onChangeText={onPhoneChange}
                        onChangeCountryCode={onCountryCodeChange}
                        editable={false}
                        initialCca2={phoneCca2}
                        placeholder={t('settings.phoneNumber')}
                    />

                    <View style={styles.field}>
                        <Typography text={countryText} variant="h6" style={country ? styles.fieldText : styles.placeholderText} />
                    </View>
                    <View style={styles.field}>
                        <Typography text={cityText} variant="h6" style={city ? styles.fieldText : styles.placeholderText} />
                    </View>
                    <View style={styles.field}>
                        <Typography text={birthdayText} variant="h6" style={birthdayDisplayText ? styles.fieldText : styles.placeholderText} />
                    </View>
                    <View style={styles.field}>
                        <Typography text={genderText} variant="h6" style={gender ? styles.fieldText : styles.placeholderText} />
                    </View>
                    <View style={styles.field}>
                        <Typography text={occupationText} variant="h6" style={occupation ? styles.fieldText : styles.placeholderText} />
                    </View>
                    <View style={styles.field}>
                        <Typography text={placeOfWorkText} variant="h6" style={placeOfWork ? styles.fieldText : styles.placeholderText} />
                    </View>

                    <View style={styles.fieldRow}>
                        <View style={styles.instagramAccessory}>
                            <InstagramIcon color={colors.text} />
                        </View>
                        <Typography text={instagramText} variant="h6" style={instagramLink ? styles.fieldText : styles.placeholderText} />
                    </View>

                    <View style={styles.field}>
                        <Typography text={websiteText} variant="h6" style={website ? styles.fieldText : styles.placeholderText} />
                    </View>
                    <View style={styles.field}>
                        <Typography text={bioText} variant="h6" style={bio ? styles.fieldText : styles.placeholderText} />
                    </View>
                </View>
            </View>
        </ScreenContainer>
    );
});
