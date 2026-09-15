import { AuthScreen } from '@/components/auth-screen';
export const metadata = { title: 'Бүртгүүлэх', robots: { index: false, follow: false } };
export default function RegisterPage() {
  return <AuthScreen mode="register" />;
}
