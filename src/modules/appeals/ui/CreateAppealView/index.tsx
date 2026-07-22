import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { CustomInput } from '@/UIKit/CustomInput';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { Gallery } from '@/UIKit/Gallery';
import { useCreateAppeal } from './presenters/useCreateAppeal';
import { getStyles } from './styles';

export const CreateAppealView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        isEditing,
        subject,
        description,
        gallery,
        onAddPhoto,
        isLoading,
        isSubmitDisabled,
        onSubjectChange,
        onDescriptionChange,
        onSubmitPress,
    } = useCreateAppeal();

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
            isKeyboardAvoiding
            headerComponent={
                <HeaderWithBackButton title={t(isEditing ? 'appeals.editTitle' : 'appeals.createTitle')} isCentered />
            }
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.container}>
                <CustomInput
                    label={t('appeals.subject')}
                    value={subject}
                    onChangeText={onSubjectChange}
                    placeholder={t('appeals.subjectPlaceholder')}
                    maxLength={200}
                    containerStyle={styles.field}
                />
                <CustomInput
                    label={t('appeals.description')}
                    value={description}
                    onChangeText={onDescriptionChange}
                    placeholder={t('appeals.descriptionPlaceholder')}
                    multiline
                    maxLength={4000}
                    inputContainerStyle={styles.descriptionInput}
                    containerStyle={styles.field}
                />
                <Gallery title={t('appeals.attachments')} {...gallery} onAddPhoto={onAddPhoto} containerStyle={styles.gallery}/>
                <Typography text={t('appeals.photoHint')} variant="subtitle_12_400" style={styles.photoHint} />
                <Button
                    text={t(isEditing ? 'common.save' : 'appeals.submit')}
                    onPress={onSubmitPress}
                    inProgress={isLoading}
                    disabled={isSubmitDisabled}
                    containerStyle={styles.submitButton}
                />
            </View>
        </ScreenContainer>
    );
};
