import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [numPosts, setNumPosts] = useState(0);
  const { username } = router.query;

  const fetchData = async () => {
    if (username) {
      const data = { username };
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (res.status === 200) {
        setUserData(response);
      } else {
        setUserData(null);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [username, numPosts]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      const filteredUsers = data.filter(
        (user) => user.username !== currentUser?.username
      );
      setUsers(filteredUsers);
    }

    fetchUsers();
  }, [currentUser]);

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

      setNumPosts(numPosts + 1);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username
            ? { ...user, following: !user.following }
            : user
        )
      );
    }
  };

  const isFollowingUser = (username) => {
    if (userData && userData.following) {
      return userData.following.includes(username);
    }
    return false;
  };

  return (
    <>
      {currentUser ? (
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
                  {currentUser && !isFollowingUser(user.username) && (
                    <button onClick={() => handleFollow(user.username)}>
                      Follow
                    </button>
                  )}
                  {currentUser && isFollowingUser(user.username) && (
                    <button onClick={() => handleFollow(user.username)}>
                      Following
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1>Create an account to see all users</h1>
      )}
    </>
  );
}
