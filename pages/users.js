import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      setCurrentUser(decoded);
    }
  }, []);

  const handleFollow = async (username) => {
    if (currentUser) {
      const data = { username: currentUser.username };
      const res = await fetch(`/api/follow/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const { message } = await res.json();
      alert(message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username ? { ...user, following: true } : user
        )
      );
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Interact</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.name}</td>
            <td>{user.username}</td>
            <td>
              {currentUser && !user.following && (
                <button onClick={() => handleFollow(user.username)}>
                  Follow
                </button>
              )}
              {currentUser && user.following && <p>Following</p>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
