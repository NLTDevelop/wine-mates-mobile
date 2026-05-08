interface IProps {
    isLoading: boolean;
    groupsCount: number;
}

export const useWineSmellViewContentState = ({ isLoading, groupsCount }: IProps) => {
    const shouldShowLoader = isLoading;
    const shouldShowEmptyState = !isLoading && groupsCount === 0;
    const shouldShowContent = !isLoading && groupsCount > 0;

    return {
        shouldShowLoader,
        shouldShowEmptyState,
        shouldShowContent,
    };
};
