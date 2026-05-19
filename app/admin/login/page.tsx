import LoginForm from "./LoginForm";
import { clientConfig } from "@/client.config";

export const metadata = {
  title: `Admin Login — ${clientConfig.business.name}`,
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading font-bold text-2xl text-ink mb-1">
            {clientConfig.business.name}
          </h1>
          <p className="text-ink-soft text-sm">Sign in to your admin panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
