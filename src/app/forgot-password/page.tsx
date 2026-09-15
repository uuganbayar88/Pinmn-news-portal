import { AuthScreen } from '@/components/auth-screen';
export const metadata = { title: 'Нууц үг сэргээх', robots: { index: false, follow: false } };
export default function ForgotPage() {
  return <AuthScreen mode="forgot" />;
}
