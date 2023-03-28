import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function CreatePost({ username, ...props }) {
  const router = useRouter();
  const [text, setText] = useState("");

  const handleFormChange = async (e) => {
    setText(e.target.value);
  };

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
        props.setNumPosts(props.numPosts);
      } else {
        console.error("Failed to create post");
      }
    } else {
      router.push({
        pathname: "/login",
      });
    }
  };
  return (
    <>
      <br />
      <h2>Share anything</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={handleFormChange}
          placeholder="What's on your mind?"
          rows={3}
        />
        <input type="hidden" name="username" value={username} />
        <button type="submit">Post!</button>
      </form>
      <br />
    </>
  );
}
