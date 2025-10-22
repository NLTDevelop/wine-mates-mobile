import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const useGoogleConfig = () => {
    GoogleSignin.configure({
        webClientId: '96389565889-nt0tdrbkv0jq0bda90pj3ubjceqcug7p.apps.googleusercontent.com',
        iosClientId: '96389565889-q3d53db8ep1de1tn2omj47d4csgmjfhg.apps.googleusercontent.com',
        offlineAccess: false,
    });
};
