import { useFavoriteWineLists } from './useFavoriteWineLists';

export const useSavedWines = () => {
    const { lists, isLoading, loadLists } = useFavoriteWineLists();

    return { isLoading, lists, isError: false, getSavedWines: loadLists };
};
