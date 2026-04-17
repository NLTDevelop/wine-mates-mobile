import React, { memo, Ref, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    children: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}

const TooltipComponent = ({ children, content, disabled = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <Popover
            from={(sourceRef, showPopover) => (
                <TouchableOpacity
                    onPress={disabled ? undefined : showPopover}
                    activeOpacity={0.7}
                    ref={sourceRef as Ref<View>}
                >
                    {children}
                </TouchableOpacity>
            )}
            placement={PopoverPlacement.BOTTOM}
            popoverStyle={styles.tooltipContainer}
            backgroundStyle={styles.popoverBackground}
            statusBarTranslucent
        >
            {content}
        </Popover>
    );
};

export const Tooltip = memo(TooltipComponent);
Tooltip.displayName = 'Tooltip';
