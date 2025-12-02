import { wineService } from '@/entities/wine/WineService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useEffect, useState } from 'react';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { IWineColor } from '@/entities/wine/types/IWineColors';

export const useWineRegion = (countryId: number | null | undefined) => {
    const [regions, setRegions] = useState<IDropdownItem[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchRegions = async () => {
            if (!countryId) {
                if (isMounted) setRegions([]);
                return;
            }

            try {
                const response = await wineService.getRegions(countryId);

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    if (isMounted) setRegions([]);
                    return;
                }

                if (isMounted) {
                    setRegions(
                        response.data.map((color: IWineColor) => {
                            const label = color.name;
                            return { label, value: label, id: color.id };
                        }),
                    );
                }
            } catch {
                if (isMounted) {
                    setRegions([]);
                }
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            }
        };

        fetchRegions();

        return () => {
            isMounted = false;
        };
    }, [countryId]);

    return { regions };
};

