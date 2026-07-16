import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { InstagramIcon } from '@assets/icons/InstagramIcon';
import { getStyles } from './styles';
import { useProfileDetails } from './presenters/useProfileDetails';
import { ProfileAvatarExpertiseLevel } from './components/ProfileAvatarExpertiseLevel';
import { ProfileDetailsField } from './components/ProfileDetailsField';
import { Typography } from '@/UIKit/Typography';
import { ProfileGallery } from '@/modules/profile/ui/components/ProfileGallery';

export const ProfileDetailsView = observer(() => {
    const { colors, t, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        avatarUrl,
        fullName,
        expertiseLevel,
        expertiseLabel,
        fields,
        gallery,
        onPressBack,
        onPressEdit,
    } = useProfileDetails(locale);

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

                {gallery.hasPhotos && <ProfileGallery {...gallery} />}

                <View style={styles.fieldsContainer}>
                    <ProfileDetailsField {...fields.fullName} />
                    <ProfileDetailsField {...fields.email} />
                    <ProfileDetailsField {...fields.phone} />
                    <ProfileDetailsField {...fields.country} />
                    <ProfileDetailsField {...fields.city} />
                    <ProfileDetailsField {...fields.birthday} />
                    <ProfileDetailsField {...fields.gender} />
                    <ProfileDetailsField {...fields.occupation} />
                    <ProfileDetailsField {...fields.placeOfWork} />
                    <ProfileDetailsField {...fields.selectedCurrency} />
                    <ProfileDetailsField
                        text={fields.instagram.text}
                        isPlaceholder={fields.instagram.isPlaceholder}
                        label={fields.instagram.label}
                        leftIcon={<InstagramIcon color={colors.text} />}
                    />
                    <ProfileDetailsField {...fields.website} />
                    <ProfileDetailsField {...fields.bio} />
                </View>
            </View>
        </ScreenContainer>
    );
});
