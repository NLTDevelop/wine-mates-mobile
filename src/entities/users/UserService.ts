import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { UserSignInDto } from './dto/UserSignIn.dto';
import { IUser } from './types/IUser';
import { userModel } from './UserModel';
import { ResetPasswordRequestDto } from './dto/ResetPasswordRequest.dto';
import { ResetPasswordVerifyDto } from './dto/ResetPasswordVerify.dto';
import { ResetPasswordConfirmDto } from './dto/ResetPasswordConfirm.dto';
import { IRegisterUser } from './types/IRegisterUser';
import { ProvidersSignIn } from './dto/ProvidersSignIn.dto';
import { localization } from '@/UIProvider/localization/Localization';
import { EmailValidation } from './dto/EmailValidation.dto';

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
                userModel.token = response.data?.accessToken;
            }
            return response;
        } catch (error) {
            console.warn('UserService -> signIn: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    validateEmail = async (body: EmailValidation): Promise<IResponse<string>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.auth}/validate-email`,
                data: body,
            });
            return response;
        } catch (error) {
            console.warn('UserService -> validateEmail: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    googleSignIn = async (body: ProvidersSignIn): Promise<IResponse<IUser>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.auth}/google`,
                data: body,
            });
            if (!response.isError) {
                userModel.token = response.data?.accessToken;
            }
            return response;
        } catch (error) {
            console.warn('UserService -> googleSignIn: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    appleSignIn = async (body: ProvidersSignIn): Promise<IResponse<IUser>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.auth}/apple`,
                data: body,
            });
            if (!response.isError) {
                userModel.token = response.data?.accessToken;
            }
            return response;
        } catch (error) {
            console.warn('UserService -> appleSignIn: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    signUp = async (body: IRegisterUser): Promise<IResponse<IUser>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.auth}/sign-up`,
                data: body,
            });

            if (!response.isError) {
                userModel.token = response.data?.accessToken;
            }
            return response;
        } catch (error) {
            console.warn('UserService -> signUp: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    resetPasswordRequest = async (body: ResetPasswordRequestDto): Promise<IResponse<{}>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.resetPassword}`,
                data: body,
            });

            return response;
        } catch (error) {
            console.warn('UserService -> resetPasswordRequest: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    verifyResetCode = async (body: ResetPasswordVerifyDto): Promise<IResponse<IUser>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.resetPassword}/verify`,
                data: body,
            });

            return response;
        } catch (error) {
            console.warn('UserService -> verifyResetCode: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    confirmPasswordReset = async (body: ResetPasswordConfirmDto, token: string): Promise<IResponse<{}>> => {
        try {
            const response = await this._requester.request({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': localization.locale,
                    'Authorization': `Bearer ${token}`,
                },
                method: 'POST',
                url: `${this._links.resetPassword}/confirm`,
                data: body,
            });

            return response;
        } catch (error) {
            console.warn('UserService -> confirmPasswordReset: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const userService = new UserService(requester, links);
