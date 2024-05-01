import { redirect } from 'next/navigation';

// Example authentication check function
async function isAuthenticated(req) {
  console.log(req);
  // This should include actual logic to check user authentication status
  // For demonstration, this returns false to always trigger the redirect
  return true;
}

export const GET = async ({ req }) => {
  // Check if the user is authenticated
  const auth = await isAuthenticated(req);

  if (!auth) {
    return redirect('/login');
  }

  return redirect('/dashboard');
};
