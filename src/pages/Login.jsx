import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../features/authentication/useAuth";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const from = location.state?.from || "/dashboard";

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    try {
      await login();
      // 成功后 isAuthenticated 会变 true，useEffect 会跳转
    } finally {
      // 如果 loginPopup 失败/取消，这里会恢复按钮可点击
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl p-10">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>

        <p className="mt-3 text-base text-slate-600">
          Use your company SSO account to access this application.
        </p>

        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className={[
            "mt-8 w-full rounded-2xl py-3.5 text-2xl font-medium transition",
            isLoggingIn
              ? "bg-slate-400 text-white cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800",
          ].join(" ")}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isLoggingIn && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
                aria-hidden="true"
              />
            )}
            {isLoggingIn ? "Signing in…" : "Sign in with SSO"}
          </span>
        </button>

        <p className="mt-6 text-sm text-slate-500 text-center">
          After sign-in you’ll be redirected back automatically.
        </p>
      </div>
    </div>
  );
}
