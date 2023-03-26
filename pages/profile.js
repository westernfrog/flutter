import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function Profile() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
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
        setUserData(response); // Store the user data in the state variable
      } else {
        setUserData(null);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  return (
    <div>
      {userData ? (
        <div>
          <p>Name: {userData.name}</p>
          <p>Username: {username}</p>
          <p>Email: {userData.email}</p>
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
}

export default Profile;
