import { useRemoveFromCartMutation } from '@/lib/mutation'


function useRemoveFromCart() {
    const {mutate , isPending} = useRemoveFromCartMutation()
  return {removeFromCart : mutate , isPending}
}

export default useRemoveFromCart
