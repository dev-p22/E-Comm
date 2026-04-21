import { useLogoutUserMutation } from "@/lib/mutation";


function useLogout() {
  const { mutate, isPending } = useLogoutUserMutation();

  return { logout: mutate, isPending };
}

export default useLogout;
