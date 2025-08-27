import { useRoute } from "@react-navigation/native";

export const useOTP = () => {
    const { email } = useRoute().params as { email: string };


    return {email};
};