import { useEffect, useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [numPosts, setNumPosts] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/posts");
      const posts = await res.json();
      setPosts(posts);
    }

    fetchPosts();
  }, [numPosts]);

  async function handleCreatePost() {
    setNumPosts(numPosts + 1);
  }

  return (
    <>
      <h1>Latest Posts</h1>
      <textarea name="postText" id="postText" cols="30" rows="3"></textarea>
      <button onClick={handleCreatePost}>Post!</button>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.author}</h3>
          <p>{post.text}</p>
          <small>{new Date(post.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </>
  );
}
