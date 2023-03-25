import { useState } from "react";

export default function Search(params) {
  const [username, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const handleChange = async (e) => {
    if (e.target.name == "username") {
      setUserName(e.target.value);
    }
  };
  const handleSubmit = async () => {
    if (username) {
      const data = { username };
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (res.status === 200) {
        setUserData(response); // Store the user data in the state variable
      } else {
        setUserData(null);
      }
    }
  };
  return (
    <>
      <input
        type="text"
        name="username"
        value={username}
        onChange={handleChange}
        required
      />
      <br />
      <button onClick={handleSubmit}>Search</button>
      {userData && (
        <>
          <p>User found:</p>
          <ul>
            <li>Name: {userData.name}</li>
            <li>Email: {userData.email}</li>
            <li>Followers: {userData.followers}</li>
            <li>Following: {userData.following}</li>
          </ul>
        </>
      )}
    </>
  );
}
