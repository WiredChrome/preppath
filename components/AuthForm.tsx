"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"



import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { auth } from "@/Firebase/client"
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { sign } from "crypto"
import { signIn } from "@/lib/actions/auth.action"





const authFormSchema = (type: FormType) => {
  return z.object({
  name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  })
} 



const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if(type === "sign-up") {
        const { name, email, password } = values;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success('Account created successfully');
        router.push('/auth/sign-in');
      } else {
        const { email, password } = values;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error('User not found');
          return;
        }

        await signIn({
          email, idToken
        })


        toast.success('User signed in successfully');
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      toast.error('There was an error: ${error}')
    }
  }

  const isSignIn = type === "sign-in";
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex-col gap-6 card py-14 px-10">
                <div className="flex-row gap-2 justify-center">
                    <img src="/logo.svg" alt="" height={32} width={38} />
                    <h2 className="text-primary">PrepPath</h2>

                </div>
                <h3>Practice interview</h3>

            

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 form">

                      {!isSignIn && (
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <div>
                              <label htmlFor="name" className="block mb-1">Name</label>
                              <input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                {...field}
                                className="input"
                              />
                            </div>
                          )}
                        />
                      )}
                      <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <div>
                              <label htmlFor="email" className="block mb-1">Email</label>
                              <input
                                id="email"
                                type="email"
                                placeholder="Your mail address"
                                {...field}
                                className="input"
                              />
                            </div>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <div>
                              <label htmlFor="password" className="block mb-1">Password</label>
                              <input
                                id="password"
                                type="password"
                                placeholder="Your password"
                                {...field}
                                className="input"
                              />
                            </div>
                          )}
                      />
                
                      <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Register an Account'}</Button>
                </form>
            </Form>
            <p className="text-center">
              {isSignIn ? 'New to PrepPath?' : 'Already have an account?'}
              
              <Link href={!isSignIn ? '/auth/sign-in' : '/auth/reg'} className="font-bold text-user-primary ml-1">
                {!isSignIn ? "Sign in" : "Register an Account"}
              </Link>

            </p>
        </div>
    </div>
    )
}

export default AuthForm


type SignUpResult = {
  success: true;
  message?: string;
};

function signUp(arg0: { uid: any; name: string; email: string; password: string }): Promise<SignUpResult> {

  return Promise.resolve({ success: true });
}

