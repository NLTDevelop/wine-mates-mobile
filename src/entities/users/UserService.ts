import { IRequester, IResponse, requester } from "../../libs/requester";
import { ILinks, links } from "../../Links";
import { UserSignInDto } from "./dto/UserSignIn.dto";
import { IUser } from "./IUser";
import { userModel } from "./UserModel";


class UserService {
    constructor(private _requester: IRequester, private links: ILinks) { }

    signIn = async (body: UserSignInDto): Promise<IResponse<IUser>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: this.links.auth,
                data: body,
            });
            if (!response.isError) {
                userModel.token = response.data?.access.token;
            }
            return response;
        } catch (error) {
            console.warn('UserService -> signIn: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const userService = new UserService(requester, links);
