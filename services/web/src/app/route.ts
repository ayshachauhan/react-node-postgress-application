import { redirect } from 'next/navigation';

export const GET = () => {
  // todo: add auth logic here
  redirect('/dashboard');
};
