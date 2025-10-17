import { MobXRepository } from "@/repository/MobXRepository";
import { IRegisterUser } from "./types/IRegisterUser";

export interface IRegisterUserModel {
  user: IRegisterUser | null;
  clear: () => void;
}

class RegisterUserModel implements IRegisterUserModel {
  private userRepository = new MobXRepository<IRegisterUser | null>(null);

  public get user() {
    return this.userRepository.data;
  }

  public set user(user: IRegisterUser | null) {
    this.userRepository.save(user);
  }

  public clear() {
    this.user = null;
  }
}

export const registerUserModel = new RegisterUserModel();
