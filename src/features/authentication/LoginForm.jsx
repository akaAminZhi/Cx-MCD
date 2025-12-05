import { useState } from "react";

import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import { login } from "../../services/apiAuth";
import { useLogin } from "./useLogin";
function LoginForm() {
  const [email, setEmail] = useState("zhimin@test.com");
  const [password, setPassword] = useState("111111");
  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }
  const { login, isPending: isLoging } = useLogin({ email, password });
  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoging}
        />
      </FormRowVertical>
      <FormRowVertical>
        <button className="flex bg-blue-600 text-white justify-center items-center  px-2 py-2 rounded-md">
          <div className="flex gap-2 ">
            {isLoging && (
              <div className="mt-1 w-4 h-4 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            )}
            <span className="text-4xl font-semibold">
              {isLoging ? "Login...." : "Login"}
            </span>
          </div>
        </button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
