import { MobXRepository } from "@/repository/MobXRepository";

export interface IAppStateModel {
  network: boolean;
}

class AppStateModel implements IAppStateModel {
  private networkRepository = new MobXRepository(true);

  public get network() {
    return this.networkRepository.data ?? true;
  }

  public set network(data: boolean) {
    this.networkRepository.save(data);
  }
}

export const appStateModel = new AppStateModel();
