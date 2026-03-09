import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: Check auth state here — redirect to /(app)/home if already signed in
  return <Redirect href="/welcome" />;
}
