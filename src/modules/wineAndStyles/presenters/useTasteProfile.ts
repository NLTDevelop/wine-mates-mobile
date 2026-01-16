import { useCallback, useEffect, useState } from 'react';

export const useTasteProfile = () => {
    const [isLoading, setIsLoading] = useState(false);

    //TODO
    const getData = useCallback(async () => {
        try {
            setIsLoading(true);
            // const response = await wineService.getSavedWines();

            // if (response.isError || !response.data) {
            //     toastService.showError(
            //         localization.t('common.errorHappened'),
            //         response.message || localization.t('common.somethingWentWrong'),
            //     );
            //     setIsError(true);
            // } else {
            //     setWines(response.data);
            //     setIsError(false);
            // }
        } catch (error) {
            console.error('getSavedWines error: ', JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return { isLoading, getData };
};
