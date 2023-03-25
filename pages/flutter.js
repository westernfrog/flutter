import Link from "next/link";
import { useRouter } from "next/router";

export default function Flutter(params) {
  const router = useRouter();
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
      <Link href={"/users"}>All Users</Link>
      <br />
      <button onClick={logout}>Log out</button>
      <br />
      <br />
      <h2>Share anything</h2>
      <textarea name="" id="" cols="30" rows="3"></textarea>
      <br />
      <button>Post!</button>
    </>
  );
}
