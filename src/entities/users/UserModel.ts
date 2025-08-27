import { IStorage, storage } from "../../libs/storage";
import { MobXRepository } from "../../repository/MobXRepository";
import { IUser } from "./IUser";

export interface IUserModel {
  token: string | null;
  user: IUser | null;
  clear: () => void;
}

class UserModel implements IUserModel {
  private tokenRepository = new MobXRepository<string | null>(null);
  private userRepository = new MobXRepository<IUser | null>(null);

  constructor(private _storage: IStorage) {
    this.load();
  }

  private load = () => {
    const userData = this._storage.get('STORAGE_USER');
    if (userData) {
      this.userRepository.save(userData);
    }

    const tokenData = this._storage.get('STORAGE_TOKEN');
    if (tokenData) {
      this.token = tokenData;
    }
  };

  private persistUser = (data: IUser | null) => {
    if (data) {
      this._storage.set('STORAGE_USER', data);
    } else {
      this._storage.remove('STORAGE_USER');
    }
  };

  private persistToken = (data: string | null) => {
    if (data) {
      this._storage.set('STORAGE_TOKEN', data);
    } else {
      this._storage.remove('STORAGE_TOKEN');
    }
  };

  public get token() {
    return this.tokenRepository.data;
  }

  public set token(token: string | null) {
    this.tokenRepository.save(token);
    this.persistToken(token);
  }

  public get user() {
    return this.userRepository.data;
  }

  public set user(user: IUser | null) {
    this.userRepository.save(user);
    this.persistUser(user);
  }

  public clear() {
    this.user = null;
    this.token = null;
  }
}

export const userModel = new UserModel(storage);
