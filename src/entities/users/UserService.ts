import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { UserSignInDto } from './dto/UserSignIn.dto';
import { IUser } from './types/IUser';
import { userModel } from './UserModel';
import { ResetPasswordRequestDto } from './dto/ResetPasswordRequest.dto';
import { ResetPasswordVerifyDto } from './dto/ResetPasswordVerify.dto';

class UserService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    signIn = async (body: UserSignInDto): Promise<IResponse<IUser>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.auth}/sign-in`,
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

    resetPasswordRequest = async (body: ResetPasswordRequestDto): Promise<{}> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.resetPassword}`,
                data: body,
            });
            if (!response.isError) {
                userModel.token = response.data?.access.token;
            }
            return response;
        } catch (error) {
            console.warn('UserService -> resetPasswordRequest: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    verifyResetCode = async (body: ResetPasswordVerifyDto): Promise<{}> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.resetPassword}/verify`,
                data: body,
            });
            if (!response.isError) {
                userModel.token = response.data?.access.token;
            }
            return response;
        } catch (error) {
            console.warn('UserService -> verifyResetCode: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    confirmPasswordReset = async (body: UserSignInDto): Promise<{}> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.resetPassword}/confirm`,
                data: body,
            });
            if (!response.isError) {
                userModel.token = response.data?.access.token;
            }
            return response;
        } catch (error) {
            console.warn('UserService -> confirmPasswordReset: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const userService = new UserService(requester, links);
