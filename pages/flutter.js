import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";

export default function Flutter(params) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const [numPosts, setNumPosts] = useState(0);
  const [username, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      setUserName(decoded.username.toString());
    }
  }, []);

  const handleProfileClick = async (e) => {
    e.preventDefault();
    if (username) {
      router.push({
        pathname: "/profile",
        query: { username },
      });
    }
  };

  const handleLike = async () => {
    if (username) {
      const data = { username };
      const res = await fetch(`/api/like/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(res);
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/posts");
      const posts = await res.json();
      setPosts(posts);
    }

    fetchPosts();
  }, [numPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/createPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, username }),
    });
    if (response.ok) {
      setText("");
      setNumPosts(numPosts + 1);
    } else {
      console.error("Failed to create post");
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
      <Link href={"/users"}>All Users</Link>
      <br />
      <Link href={"/profile"} onClick={handleProfileClick}>
        Profile
      </Link>
      <br />
      <button onClick={logout}>Log out</button>
      <br />
      <br />
      <h2>Share anything</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
        />
        <input type="hidden" name="username" value={username} />
        <button type="submit">Post!</button>
      </form>
      <br />
      <h1>Latest Posts</h1>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.author}</h3>
          <p>{post.text}</p>
          <button onClick={handleLike}>❤️</button>
          <span>{post.likes.length}</span>
          <br />
          <br />
          <small>{new Date(post.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </>
  );
}
