import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';
import { IPublicProfileTabItem } from '@/modules/profile/types/IPublicProfileTabItem';
import { scaleHorizontal } from '@/utils';

const TAB_MIN_WIDTH = 100;

interface IProps {
    items: IPublicProfileTabItem[];
}

export const usePublicProfileTabs = ({ items }: IProps) => {
    const tabsScrollRef = useRef<ScrollView>(null);
    const activeTabIndex = useMemo(() => items.findIndex(item => item.isSelected), [items]);

    const onScrollToActiveTab = useCallback(() => {
        if (activeTabIndex < 0) {
            return;
        }

        const offset = Math.max(0, (activeTabIndex - 1) * scaleHorizontal(TAB_MIN_WIDTH));
        tabsScrollRef.current?.scrollTo({ x: offset, animated: true });
    }, [activeTabIndex]);

    useEffect(() => {
        const frameId = requestAnimationFrame(onScrollToActiveTab);

        return () => cancelAnimationFrame(frameId);
    }, [onScrollToActiveTab]);

    const onContentSizeChange = useCallback(() => {
        onScrollToActiveTab();
    }, [onScrollToActiveTab]);

    return {
        tabsScrollRef,
        onContentSizeChange,
    };
};
