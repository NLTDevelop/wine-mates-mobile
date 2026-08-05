import { IPublicProfile } from '@/entities/users/types/IPublicProfile';

export interface IPublicProfileRouteParams {
    userId: number;
    initialProfile?: IPublicProfile;
}
