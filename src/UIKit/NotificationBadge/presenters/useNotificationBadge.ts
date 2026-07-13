export const useNotificationBadge = (count: number) => {
    const showBadge = count > 0;
    const displayCount = count > 99 ? '99+' : count.toString();

    return {
        showBadge,
        displayCount,
    };
};
