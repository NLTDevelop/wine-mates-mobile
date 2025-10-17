import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SignInFooter } from '@/modules/registration/ui/components/SignInFooter';
import { Button } from '@/UIKit/Button';
import { CustomInput } from '@/UIKit/CustomInput';
import { usePersonalDetails } from '../../presenters/usePersonalDetails';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { observer } from 'mobx-react';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

export const PersonalDetailsView = observer(() => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { form, onChangeFirstName, onChangeLastName, onChangeBirthDay, onChangeOccupation, handleNextPress, onChangeWineryName,
        isError } = usePersonalDetails();

    return (
        <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Typography text={t('registration.personalDetails')} variant="h3" style={styles.title} />
                    <Typography
                        text={t(`wineLevel.${registerUserModel.user?.wineExperienceLevel}`)}
                        variant="body_500"
                        style={styles.role}
                    />
                    <View style={styles.formContainer}>
                        <View>
                            <CustomInput
                                autoCapitalize="none"
                                value={form.firstName}
                                onChangeText={onChangeFirstName}
                                placeholder={t('registration.firstName')}
                                containerStyle={styles.input}
                                error={isError.status}
                            />
                            <Typography
                                variant="subtitle_12_400"
                                text={t('registration.firstNameExample')}
                                style={styles.exampleText}
                            />
                        </View>
                        <CustomInput
                            autoCapitalize="none"
                            value={form.lastName}
                            onChangeText={onChangeLastName}
                            placeholder={t('registration.lastName')}
                            containerStyle={styles.input}
                            error={isError.status}
                        />
                        {registerUserModel.user?.wineExperienceLevel === WineExperienceLevelEnum.EXPERT && (
                            <CustomInput
                                autoCapitalize="none"
                                value={form.occupation}
                                onChangeText={onChangeOccupation}
                                placeholder={t('registration.occupation')}
                                containerStyle={styles.input}
                                error={isError.status}
                            />
                        )}
                        {registerUserModel.user?.wineExperienceLevel === WineExperienceLevelEnum.CREATOR && (
                            <CustomInput
                                autoCapitalize="none"
                                value={form.wineryName}
                                onChangeText={onChangeWineryName}
                                placeholder={t('registration.wineryName')}
                                containerStyle={styles.input}
                                error={isError.status}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.footer}>
                    <Button text={t('common.continue')} onPress={handleNextPress} type="secondary" />
                    <SignInFooter />
                </View>
            </View>
        </ScreenContainer>
    );
});
