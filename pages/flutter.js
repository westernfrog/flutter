import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Navigation from "@/components/Navigation";
import CreatePost from "@/components/CreatePost";

export default function Flutter(params) {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [numPosts, setNumPosts] = useState(0);
  const [username, setUserName] = useState("");
  const [postComments, setPostComments] = useState({});
  const [commentValues, setCommentValues] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      setUserName(decoded.username.toString());
    }
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      const postRes = await fetch("/api/posts");
      const posts = await postRes.json();

      const commentRes = await fetch("/api/comments");
      const comments = await commentRes.json();
      const postComments = {};
      posts.forEach((post) => {
        postComments[post._id] = comments.filter(
          (comment) => comment._id === post._id
        );
      });

      setPosts(posts);
      setPostComments(postComments);
    }

    fetchPosts();
  }, [numPosts]);

  const handleLike = async (postId, likes) => {
    if (!username) {
      router.push({
        pathname: "/login",
      });
      return;
    }

    const hasLiked = likes.includes(username);

    const updatedLikes = hasLiked
      ? likes.filter((like) => like !== username)
      : [...likes, username];

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, likes: updatedLikes } : post
      )
    );

    const response = await fetch(`/api/like/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        username,
        likes: updatedLikes,
      }),
    });

    if (response.ok) {
      setNumPosts(numPosts + 1);
    } else {
      console.error("Failed to update likes");
    }
  };

  useEffect(() => {
    setCommentValues(posts.map((post) => ({ postId: post._id, value: "" })));
  }, [posts]);

  const handleCommentChange = (postId, value) => {
    setCommentValues((commentValues) =>
      commentValues.map((commentValue) =>
        commentValue.postId === postId
          ? { ...commentValue, value }
          : commentValue
      )
    );
  };

  const handleCommentSubmit = async (postId) => {
    const commentValue = commentValues.find(
      (commentValue) => commentValue.postId === postId
    );
    const { value } = commentValue;

    if (value.trim() === "") {
      return;
    }

    const response = await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: value, username, postId }),
    });

    if (response.ok) {
      setNumPosts(numPosts + 1);
      const comment = await response.json();
      const commentsForPost = postComments[postId] || [];
      setPostComments({
        ...postComments,
        [postId]: [...commentsForPost, comment],
      });

      setCommentValues((commentValues) =>
        commentValues.map((commentValue) =>
          commentValue.postId === postId
            ? { ...commentValue, value: "" }
            : commentValue
        )
      );
    } else {
      console.error("Failed to create comment");
    }
  };

  const handleShowComments = async (e) => {
    setNumPosts(numPosts + 1);
  };

  return (
    <>
      {username ? (
        <>
          <Navigation username={username} />
        </>
      ) : (
        <>
          <Link href={"/login"}>Login</Link>
          <br />
          <Link href={"/signup"}>Create a account</Link>
        </>
      )}
      <CreatePost
        setNumPosts={setNumPosts}
        username={username}
        numPosts={numPosts + 1}
      />

      <h1>Latest Posts</h1>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.author}</h3>
          <p>&gt; {post.text}</p>
          <button onClick={() => handleLike(post._id, post.likes)}>
            {post.likes.includes(username) ? "❤️" : "🤍"}
          </button>
          &nbsp;&nbsp;
          <span>{post.likes.length}</span>
          <br />
          <br />
          <small>{new Date(post.createdAt).toLocaleString()}</small>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit(post._id);
              }}
            >
              <input
                type="text"
                value={
                  commentValues.find(
                    (commentValue) => commentValue.postId === post._id
                  )?.value ?? ""
                }
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                placeholder="Comments"
              />
              <button type="submit" onClick={handleShowComments}>
                Comment
              </button>
            </form>
          </div>
          <p>Comments</p>
          <ul>
            {postComments[post._id] &&
              postComments[post._id].map((comment) =>
                comment.comments
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by creation date in descending order
                  .map((c) => (
                    <li key={c._id}>
                      {c.author}: {c.comment}
                      <br />
                      <p>{new Date(c.createdAt).toLocaleString()}</p>
                    </li>
                  ))
              )}
          </ul>
          <hr />
        </div>
      ))}
    </>
  );
}
