
'use server'
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { signIn} from "@/lib/auth";
import { getSession } from "next-auth/react";

export const loginUser = async (data: any) => {
 

  try {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, 
    });
  
  
    return res;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials.");
  }
};


