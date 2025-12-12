import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';

export const useCreateListBottomSheet = () => {
    const [listName, setListName] = useState('');
    const createListModalRef = useRef<BottomSheetModal | null>(null);

    const onClose = useCallback(() => {
        createListModalRef.current?.dismiss();
        setListName('');
    }, []);

    const onOpen = useCallback(() => {
        setListName('');
        createListModalRef.current?.present();
    }, []);

    const onCreate = useCallback(() => {
        // TODO: connect with create list API
        onClose();
    }, [onClose]);

    return { createListModalRef, listName, setListName, onClose, onOpen, onCreate };
};
