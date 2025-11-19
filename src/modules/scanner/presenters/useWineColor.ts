import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useEffect, useState } from 'react';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { IWineColor } from '@/entities/wine/types/IWineColors';

export const useWineColor = (typeId: number | null | undefined) => {
    const [colorsData, setColorsData] = useState<IDropdownItem[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchColors = async () => {
            if (!typeId) {
                if (isMounted) setColorsData([]);
                return;
            }

            try {
                const response = await wineService.getColors({ wineTypeId: String(typeId) });

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    if (isMounted) setColorsData([]);
                    return;
                }

                if (isMounted) {
                    setColorsData(
                        response.data.map((color: IWineColor) => {
                            const label = color.nameEn || color.name;
                            return { label, value: label, id: color.id };
                        }),
                    );
                }
            } catch {
                if (isMounted) {
                    setColorsData([]);
                }
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            }
        };

        fetchColors();

        return () => {
            isMounted = false;
        };
    }, [typeId]);

    return { colorsData };
};

