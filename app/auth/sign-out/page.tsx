'use client';
import {signOut} from '@/lib/actions/auth.action'

export default function LogoutButton() {

    console.log('I am out')
  return (
    <button onClick={() => signOut()} className="btn btn-danger">
      Sign Out
    </button>
  );
}