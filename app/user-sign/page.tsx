'use client';
import { useRouter } from 'next/navigation'
export default function LogoutButton() {

    const router = useRouter()

    async function handleLogout(){
        await fetch('/api/sign-out', { method: 'POST' })
        router.push('/auth/sign-in')
    }


  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Sign Out
    </button>
  );
}