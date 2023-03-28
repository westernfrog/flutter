import { useState } from "react";
import { useRouter } from "next/router";

export default function SignUp(params) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");

  var emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  var paswdRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,15}$/;

  const handleChange = async (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "password") {
      setPassword(e.target.value);
    } else if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "username") {
      setUserName(e.target.value);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length > 3) {
      setEmailError(false);
      if (email.match(emailRegex)) {
        setEmailError(false);
        if (password.match(paswdRegex)) {
          setPasswordError(false);

          const data = { name, username, email, password };
          const res = await fetch("/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          let response = await res.json();
          console.log(data);
          setName("");
          setEmail("");
          setPassword("");
          setUserName("");

          if (response.success) {
            console.log("Success");

            router.push({
              pathname: "/login",
            });
          } else {
            console.log(response.error);
            setError(response.error);
          }
        } else {
          setPasswordError(true);
          setEmailError(false);
          setNameError(false);
        }
      } else {
        setEmailError(true);
        setPasswordError(false);
        setNameError(false);
      }
    } else {
      setNameError(true);
      setEmailError(false);
      setPasswordError(false);
    }
  };

  return (
    <>
      <form onClick={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          name="name"
          value={name}
          onChange={handleChange}
          required
        />
        <p>{nameError}</p>
        <br />
        <input
          type="text"
          placeholder="username"
          name="username"
          value={username}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          type="email"
          placeholder="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
        />
        <div
          className={`${
            emailError ? "d-grid" : "d-none"
          } fs-8 text-warning ms-1`}
        >
          <small>Please enter a valid email address.</small>
        </div>
        <br />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        />
        <div
          className={`${
            passwordError ? "d-grid" : "d-none"
          } fs-8 text-warning ms-1`}
        >
          <small>
            Your password should be between 5 to 15 characters and must include
            at least one numeric digit and a special character.
          </small>
        </div>
        <br />
        <p>{error}</p>
        <button type="submit">Signup</button>
      </form>
    </>
  );
}
