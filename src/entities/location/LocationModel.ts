import { MobXRepository } from '@/repository/MobXRepository';
import { IUserLocation } from './types/IUserLocation';

export interface ILocationModel {
    userLocation: IUserLocation | null;
    hasPermission: boolean;
    isLoading: boolean;
    setUserLocation: (location: IUserLocation | null) => void;
    setHasPermission: (hasPermission: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    clear: () => void;
}

class LocationModel implements ILocationModel {
    private userLocationRepository = new MobXRepository<IUserLocation | null>(null);
    private hasPermissionRepository = new MobXRepository<boolean>(false);
    private isLoadingRepository = new MobXRepository<boolean>(true);

    public get userLocation() {
        return this.userLocationRepository.data;
    }

    public set userLocation(value: IUserLocation | null) {
        this.userLocationRepository.save(value);
    }

    public get hasPermission() {
        return this.hasPermissionRepository.data || false;
    }

    public set hasPermission(value: boolean) {
        this.hasPermissionRepository.save(value);
    }

    public get isLoading() {
        return this.isLoadingRepository.data ?? true;
    }

    public set isLoading(value: boolean) {
        this.isLoadingRepository.save(value);
    }

    public setUserLocation(location: IUserLocation | null) {
        this.userLocation = location;
    }

    public setHasPermission(hasPermission: boolean) {
        this.hasPermission = hasPermission;
    }

    public setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    public clear() {
        this.userLocation = null;
        this.hasPermission = false;
        this.isLoading = true;
    }
}

export const locationModel = new LocationModel();
