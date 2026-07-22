import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    isImporting: boolean;
    isTemplateDownloading: boolean;
    onClose: () => void;
    onUploadPress: () => void;
    onDownloadTemplatePress: () => void;
}

export const CsvImportAlert = ({
    visible,
    isImporting,
    isTemplateDownloading,
    onClose,
    onUploadPress,
    onDownloadTemplatePress,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <CustomAlert
            visible={visible}
            onClose={onClose}
            header={t('profile.importWinesCsvTitle')}
            content={
                <Typography
                    text={t('profile.importWinesCsvMessage')}
                    variant="body_400"
                    style={styles.message}
                />
            }
            footer={
                <View style={styles.buttons}>
                    <Button
                        text={t('profile.uploadWinesCsv')}
                        onPress={onUploadPress}
                        inProgress={isImporting}
                        disabled={isTemplateDownloading}
                    />
                    <Button
                        text={t('profile.downloadWinesCsvTemplate')}
                        onPress={onDownloadTemplatePress}
                        type="secondary"
                        inProgress={isTemplateDownloading}
                        disabled={isImporting}
                    />
                </View>
            }
        />
    );
};
