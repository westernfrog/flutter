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
  const handleSubmit = async () => {
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

          setTimeout(() => {
            router.push("/flutter");
          }, 200);
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
      <input
        type="email"
        placeholder="email"
        name="email"
        value={email}
        onChange={handleChange}
        required
      />
      <p>{emailError}</p>
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
      <p>{passwordError}</p>
      <br />
      <p>{error}</p>
      <button onClick={handleSubmit}>Login</button>
    </>
  );
}
