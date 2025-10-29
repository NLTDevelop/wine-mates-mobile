import { IStorage, storage } from "@/libs/storage";
import { MobXRepository } from "@/repository/MobXRepository";
import { IFeatures } from "./types/IFeature";

export interface IFeaturesModel {
  features: IFeatures[] | null;
  clear: () => void;
}

class FeaturesModel implements IFeaturesModel {
  private featuresRepository = new MobXRepository<IFeatures[] | null>(null);

  constructor(private _storage: IStorage) {
    this.load();
  }

  private load = () => {
    const featuresData = this._storage.get('STORAGE_FEATURES');
    if (featuresData) {
      this.features = featuresData;
    }
  };

  private persistFeatures = (data: IFeatures[] | null) => {
    if (data) {
      this._storage.set('STORAGE_FEATURES', data);
    } else {
      this._storage.remove('STORAGE_FEATURES');
    }
  };

  public get features() {
    return this.featuresRepository.data || null;
  }

  public set features(features: IFeatures[] | null) {
    this.featuresRepository.save(features);
    this.persistFeatures(features);
  }

  public clear() {
    this.features = null;
  }
}

export const featuresModel = new FeaturesModel(storage);
