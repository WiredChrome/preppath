'use client';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/sign-out", { method: "POST" });
    router.push("/auth/sign-in");
  }

  return (
    <button onClick={handleLogout} className="btn h-[80%] btn-danger hover:bg-stone-800 hover:text-white cursor-pointer pl-2 pr-2 border-2 rounded-md backdrop-blur-lg">
      Sign Out
    </button>
  );
}