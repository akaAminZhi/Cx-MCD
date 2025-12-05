import { NavLink } from "react-router";
import PageNav from "../components/PageNav";
import Heading from "../ui/Heading";

function Homepage() {
  return (
    <div>
      <PageNav></PageNav>
      <p>Cx Burning!</p>
      <NavLink to={"/app"}>Go to the App</NavLink>
      <button className="bg-amber-300 rounded-xs">Click me </button>
      <Heading Tag="h2">The oaszis</Heading>
    </div>
  );
}

export default Homepage;
