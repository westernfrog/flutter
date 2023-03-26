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

  const [postComments, setPostComments] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username) {
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
    } else {
      router.push({
        pathname: "/login",
      });
    }
  };

  const [commentValues, setCommentValues] = useState([]);

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
      // Find the comments for the current post and add the new comment
      const commentsForPost = postComments[postId] || [];
      setPostComments({
        ...postComments,
        [postId]: [...commentsForPost, comment],
      });
      // Clear the comment value for the current post
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

  const logout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      router.push("/");
    }, 200);
  };
  return (
    <>
      {username ? (
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
        </>
      ) : (
        <>
          <Link href={"/login"}>Login</Link>
          <br />
          <Link href={"/signup"}>Create a account</Link>
        </>
      )}
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
              <button type="submit">Comment</button>
            </form>
          </div>
          {postComments[post._id] &&
            postComments[post._id].map((comment) =>
              comment.comments.map((c) => (
                <p key={c._id}>
                  {c.author}: {c.comment}
                </p>
              ))
            )}
        </div>
      ))}
    </>
  );
}
