import Button from "../../ui/Button";
import { useLogout } from "./useLogout";

function Logout() {
  const { logout, isPending } = useLogout();
  return (
    <div>
      <Button disabled={isPending} onClick={logout}>
        Logout
      </Button>
    </div>
  );
}

export default Logout;
