'use client';
import { ExtraLargeSpinner } from '@root/components/Spinner';
import { COOKIES, setCookie } from '@root/services/cookies';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SsoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token: string | null = searchParams.get('token');

  if (token) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 15 * 60 * 1000);
    setCookie(COOKIES.ACCESS_TOKEN, token, {
      expires: expirationDate,
    });

    setTimeout(() => {
      router.replace('/dashboard');
    }, 200);
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <ExtraLargeSpinner />
    </div>
  );
}
