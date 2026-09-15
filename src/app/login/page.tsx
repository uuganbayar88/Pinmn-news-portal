import { AuthScreen } from '@/components/auth-screen';
export const metadata = { title: 'Нэвтрэх', robots: { index: false, follow: false } };
export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
