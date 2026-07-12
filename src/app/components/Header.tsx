'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="flex items-center justify-between bg-gray-800 bg-opacity-70 backdrop-blur-sm p-4 border-b border-gray-700">
      <h2 className="text-lg font-semibold text-gray-200">
        Logistics Operations Platform
      </h2>
      {session ? (
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-300">{session.user?.name ?? session.user?.email}</span>
          <button
            onClick={() => signOut()}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <span className="text-sm text-gray-400">Not signed in</span>
      )}
    </header>
  );
}
