import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const useGoogleConfig = () => {
    GoogleSignin.configure({
        webClientId: '69205747975-0elufoa5sbvgnta84775dgaqdigk6rip.apps.googleusercontent.com',
        iosClientId: '69205747975-2claj5bq8pt35tdgiuvhbjgp3oel7mpe.apps.googleusercontent.com',
        offlineAccess: false,
    });
};
