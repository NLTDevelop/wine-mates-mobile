import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Avatar } from '@/UIKit/Avatar';
import { Typography } from '@/UIKit/Typography';
import { Gallery } from '@/UIKit/Gallery';
import { ProfileDetailsField } from '@/modules/profile/ui/ProfileDetailsView/components/ProfileDetailsField';
import { useWineryProfileDetails } from './presenters/useWineryProfileDetails';
import { getStyles } from './styles';
import { WineryLinksList } from './components/WineryLinksList';

export const WineryProfileDetailsView = observer(() => {
    const { colors, t, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { name, mainPhotoUrl, fields, linkItems, gallery, onPressBack, onPressEdit } =
        useWineryProfileDetails(locale);

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
                <View style={styles.mainPhotoContainer}>
                    <Avatar size={96} avatarUrl={mainPhotoUrl} fullname={name} />
                    <Typography text={name} variant="h4" style={styles.name} />
                </View>
                {gallery.hasPhotos && <Gallery title={t('settings.photoGallery')} {...gallery} />}
                <View style={styles.fields}>
                    <ProfileDetailsField {...fields.name} />
                    <ProfileDetailsField {...fields.foundedYear} />
                    <ProfileDetailsField {...fields.description} />
                    <ProfileDetailsField {...fields.wineryCountry} />
                    <ProfileDetailsField {...fields.region} />
                    <ProfileDetailsField {...fields.userCountry} />
                    <ProfileDetailsField {...fields.phone} />
                    <ProfileDetailsField {...fields.birthday} />
                    {!!linkItems.length && <WineryLinksList label={t('settings.wineryLinks')} items={linkItems} />}
                </View>
            </View>
        </ScreenContainer>
    );
});
