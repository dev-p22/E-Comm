
import { auth } from '@/lib/firebase';
import { useDeleteProductMutation } from '@/lib/mutation';
import React from 'react'

function useDeleteProduct(id:string) {
    const { mutate } = useDeleteProductMutation();
  return async function handleDeleteProduct(){
            
             
                const token = await auth?.currentUser?.getIdToken() ?? "";
            
                mutate({id , token });


              };
  }


export default useDeleteProduct
