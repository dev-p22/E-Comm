

import { setUser } from '@/redux/authSlice';
import { getCurrentUser, loginUser } from '@/services/authServices';
import { LoginType } from '@/zod/authSchema'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export function useLogin() {
    const dispatch = useDispatch();
    const router = useRouter();

  return async function handleLogin(data:LoginType){
     try {
      const res = await loginUser(data);

      if (res.success) {
        try {
          const userResponse = await getCurrentUser();

          if (userResponse.data) {
            dispatch(setUser(userResponse.data));
          }
        } catch (getUserError) {
          console.error("Failed to fetch user info:", getUserError);
        }

        toast.success(res.message || "Login successful!");
        router.push("/");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  }
}

export default useLogin
