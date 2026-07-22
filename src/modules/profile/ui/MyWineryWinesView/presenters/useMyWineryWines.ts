import { useCallback, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { wineryLinkedWinesModel } from '@/entities/winery/models/WineryLinkedWinesModel';
import { wineryWineService } from '@/entities/winery/services/WineryWineService';
import { userModel } from '@/entities/users/UserModel';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';
import RNFS from 'react-native-fs';
import { errorCodes, isErrorWithCode, pick, saveDocuments, types } from '@react-native-documents/picker';
import {
    errorCodes as viewerErrorCodes,
    isErrorWithCode as isViewerErrorWithCode,
    viewDocument,
} from '@react-native-documents/viewer';
import {
    WINERY_WINES_CSV_MIME_TYPE,
    WINERY_WINES_CSV_TEMPLATE_FILE_NAME,
} from '@/modules/profile/constants/wineryWinesCsv';

const LIMIT = 10;
const ALERT_CLOSE_DELAY_MS = 250;

const waitForCsvImportAlertClose = async () => {
    await new Promise<void>(resolve => {
        setTimeout(resolve, ALERT_CLOSE_DELAY_MS);
    });
};

export const useMyWineryWines = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const wineryId = userModel.winery?.id;
    const list = wineryLinkedWinesModel.list;
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isTemplateDownloading, setIsTemplateDownloading] = useState(false);
    const [isCsvImportAlertVisible, setIsCsvImportAlertVisible] = useState(false);
    const [isError, setIsError] = useState(false);

    const loadWines = useCallback(
        async (offset: number, mode: 'initial' | 'refresh' | 'more') => {
            if (!wineryId) {
                setIsError(true);
                setIsLoading(false);
                return;
            }

            if (mode === 'initial') {
                setIsLoading(true);
            } else if (mode === 'refresh') {
                setIsRefreshing(true);
            } else {
                setIsLoadingMore(true);
            }

            try {
                setIsError(false);
                const response = await wineryWineService.getLinkedWines({
                    wineryId,
                    limit: LIMIT,
                    offset,
                });

                if (response.isError || !response.data) {
                    setIsError(true);
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                }
            } catch (error) {
                console.error('useMyWineryWines -> loadWines: ', error);
                setIsError(true);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
                setIsLoadingMore(false);
            }
        },
        [wineryId],
    );

    useFocusEffect(
        useCallback(() => {
            loadWines(0, 'initial');
        }, [loadWines]),
    );

    useEffect(() => {
        return () => {
            wineryLinkedWinesModel.list = null;
        };
    }, []);

    const onRefresh = useCallback(async () => {
        await loadWines(0, 'refresh');
    }, [loadWines]);

    const onEndReached = useCallback(async () => {
        const currentList = wineryLinkedWinesModel.list;

        if (
            !currentList ||
            isLoading ||
            isRefreshing ||
            isLoadingMore ||
            currentList.rows.length >= currentList.count
        ) {
            return;
        }

        await loadWines(currentList.rows.length, 'more');
    }, [isLoading, isLoadingMore, isRefreshing, loadWines]);

    const onPressBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onItemPress = useCallback(
        (item: IWineListItem) => {
            navigation.navigate('WineDetailsView', { wineId: item.id });
        },
        [navigation],
    );

    const onAddWinePress = useCallback(() => {
        navigation.navigate('AddWineryWinesView');
    }, [navigation]);

    const onShowCsvImportAlert = useCallback(() => {
        setIsCsvImportAlertVisible(true);
    }, []);

    const onHideCsvImportAlert = useCallback(() => {
        if (!isImporting && !isTemplateDownloading) {
            setIsCsvImportAlertVisible(false);
        }
    }, [isImporting, isTemplateDownloading]);

    const onImportCsvPress = useCallback(async () => {
        if (!wineryId || isImporting) {
            return;
        }

        try {
            setIsCsvImportAlertVisible(false);
            const [file] = await pick({
                type: types.csv,
                allowMultiSelection: false,
            });

            if (!file.name?.toLowerCase().endsWith('.csv')) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('profile.invalidWinesCsv'),
                );
                return;
            }

            setIsImporting(true);
            const formData = new FormData();
            formData.append('wineryId', String(wineryId));
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.type || 'text/csv',
            } as any);

            const response = await wineryWineService.importWines(formData);

            if (response.isError || !response.data?.success) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            toastService.showSuccess(
                localization.t('common.success'),
                localization.t('profile.winesCsvImported', { count: response.data.importedCount }),
            );
            await loadWines(0, 'refresh');
        } catch (error) {
            if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
                return;
            }

            console.error('useMyWineryWines -> onImportCsvPress: ', error);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            setIsImporting(false);
        }
    }, [isImporting, loadWines, wineryId]);

    const onDownloadCsvTemplatePress = useCallback(async () => {
        if (isTemplateDownloading) {
            return;
        }

        setIsTemplateDownloading(true);

        try {
            const response = await wineryWineService.downloadImportTemplate();

            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const filePath = `${RNFS.CachesDirectoryPath}/${WINERY_WINES_CSV_TEMPLATE_FILE_NAME}`;
            const base64Data = Buffer.from(response.data).toString('base64');
            await RNFS.writeFile(filePath, base64Data, 'base64');

            const sourceUri = `file://${filePath}`;
            setIsCsvImportAlertVisible(false);
            await waitForCsvImportAlertClose();

            const saveResponse = await saveDocuments({
                sourceUris: [sourceUri],
                mimeType: WINERY_WINES_CSV_MIME_TYPE,
                fileName: WINERY_WINES_CSV_TEMPLATE_FILE_NAME,
                copy: true,
            });
            const savedDocument = saveResponse[0];
            const saveError = savedDocument.error;

            if (saveError) {
                toastService.showError(localization.t('common.errorHappened'), saveError);
                return;
            }

            await viewDocument({
                uri: sourceUri,
                mimeType: WINERY_WINES_CSV_MIME_TYPE,
                headerTitle: WINERY_WINES_CSV_TEMPLATE_FILE_NAME,
                presentationStyle: 'fullScreen',
            });
            toastService.showSuccess(
                localization.t('common.success'),
                localization.t('profile.winesCsvTemplateSaved'),
            );
        } catch (error) {
            if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
                return;
            }

            if (isViewerErrorWithCode(error) && error.code === viewerErrorCodes.UNABLE_TO_OPEN_FILE_TYPE) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('profile.winesCsvNoViewer'),
                );
                return;
            }

            console.error('useMyWineryWines -> onDownloadCsvTemplatePress: ', error);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            setIsTemplateDownloading(false);
        }
    }, [isTemplateDownloading]);

    return {
        data: list?.rows || [],
        isLoading,
        isLoadingMore,
        isImporting,
        isTemplateDownloading,
        isCsvImportAlertVisible,
        isError,
        onRefresh,
        onEndReached,
        onPressBack,
        onItemPress,
        onAddWinePress,
        onImportCsvPress,
        onShowCsvImportAlert,
        onHideCsvImportAlert,
        onDownloadCsvTemplatePress,
    };
};
