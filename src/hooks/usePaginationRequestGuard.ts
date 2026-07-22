import { useCallback, useRef } from 'react';

type TPaginationRequestKey = number | string;

export const usePaginationRequestGuard = () => {
    const requestedKeysRef = useRef(new Set<TPaginationRequestKey>());

    const onTryStartPaginationRequest = useCallback((key: TPaginationRequestKey) => {
        if (requestedKeysRef.current.has(key)) {
            return false;
        }

        requestedKeysRef.current.add(key);
        return true;
    }, []);

    const onResetPaginationRequests = useCallback(() => {
        requestedKeysRef.current.clear();
    }, []);

    return {
        onTryStartPaginationRequest,
        onResetPaginationRequests,
    };
};
