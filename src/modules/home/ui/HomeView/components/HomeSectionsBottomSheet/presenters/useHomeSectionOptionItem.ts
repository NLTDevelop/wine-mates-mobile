import { ChatIcon } from '@assets/icons/ChatIcon';
import { EventIcon } from '@assets/icons/EventIcon';
import { GlassWithWineIcon } from '@assets/icons/GlassWithWineIcon';
import { HomeSectionKey } from '@/entities/homeSections/types/HomeSectionKey';

export const useHomeSectionOptionItem = (key: HomeSectionKey) => {
    if (key === 'events') {
        return {
            Icon: EventIcon,
        };
    }

    if (key === 'people_talking') {
        return {
            Icon: ChatIcon,
        };
    }

    return {
        Icon: GlassWithWineIcon,
    };
};
