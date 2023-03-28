import { useState } from "react";
import { useRouter } from "next/router";

export default function Login(params) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.match(emailRegex)) {
      setEmailError(false);
      if (password.match(paswdRegex)) {
        setPasswordError(false);

        const data = { email, password };
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let response = await res.json();

        setEmail("");
        setPassword("");

        if (response.success) {
          localStorage.setItem("token", response.token);
          console.log("Success");

          router.push({
            pathname: "/flutter",
          });
        } else {
          console.log(response.error);
          setError(response.error);
        }
      } else {
        setPasswordError(true);
        setEmailError(false);
        setError("");
      }
    } else {
      setEmailError(true);
      setPasswordError(false);
      setError("");
    }
  };
  return (
    <>
      <form onClick={handleSubmit}>
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
          autoComplete="off"
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
        <button type="submit">Login</button>
      </form>
    </>
  );
}
