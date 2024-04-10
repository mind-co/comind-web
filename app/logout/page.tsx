'use client'
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/authprovider';

const LogoutPage = () => {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      auth.clearAuth(); // Assuming clearAuth is the method to clear the authentication context
      router.push('/'); // Redirect to the home page after logout
    }
  }, [auth, router]);

  return (
    <div className="comind-center-column">
      <h1 className="instruction">Logging out...</h1>
    </div>
  );
};

export default LogoutPage;
