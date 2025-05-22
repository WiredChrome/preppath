import {ReactNode} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import {LogoutButton} from '@/components/ui/LogoutButton';


const RootLayout = async ({ children }: {children: ReactNode }) => {
    const user = await isAuthenticated();


    if (!user) redirect("/auth/sign-in");
    console.log(user)
    return (
        <div className="root-layout">
            <nav className='flex justify-between'>
                <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Logo" width={38} height={32} />
                <h2 className="text-primary-100">PrepPath</h2>
                </Link>

                <div className='flex gap-5 justify-center items-center'>
                    <LogoutButton />
                    <Image className='rounded-full' src="/profile.svg" alt="Logo" width={60} height={60} />
                </div>

            </nav>
            {children}
        </div>
    )
}

export default RootLayout