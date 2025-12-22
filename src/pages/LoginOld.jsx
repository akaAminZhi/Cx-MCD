import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
function Login() {
  return (
    <main className="min-h-[100vh] grid grid-cols-[50rem] content-center justify-center gap-6 bg-gray-50">
      <Logo></Logo>
      <LoginForm></LoginForm>
    </main>
  );
}

export default Login;
