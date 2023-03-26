import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation({ username }) {
  const router = useRouter();

  const handleProfileClick = async (e) => {
    e.preventDefault();
    if (username) {
      router.push({
        pathname: "/profile",
        query: { username },
      });
    }
  };

  const handleAllUsers = async (e) => {
    e.preventDefault();
    if (username) {
      router.push({
        pathname: "/users",
        query: { username },
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      router.push("/");
    }, 200);
  };

  return (
    <>
      <Link href={"/login"}>Login</Link>
      <br />
      <Link href={"/signup"}>Sign up</Link>
      <br />
      <Link href={"/search"}>Search</Link>
      <br />
      <Link href={"/users"} onClick={handleAllUsers}>
        All Users
      </Link>
      <br />
      <Link href={"/profile"} onClick={handleProfileClick}>
        Profile
      </Link>
      <br />
      {username && <button onClick={logout}>Log out</button>}
    </>
  );
}
