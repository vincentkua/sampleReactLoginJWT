import { useState } from "react";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [jwtToken, setJwtToken] = useState("-");
  const [validationMessage, setValidationMessage] = useState("");

  const handleLogin = () => {
    const logindata = {
      user,
      password,
    };

    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logindata),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Failed Login");
        }
        return res.json();
      })
      .then((data) => {
        if (data.jwtToken) {
          setJwtToken(data.jwtToken); // Store JWT token in state
        }
        alert("Login Success");
      })
      .catch((err) => {
        console.error(err.message);
        alert("Failed to post data");
      });
  };

  const validateJWT = () => {
    if (jwtToken === "-") {
      alert("No JWT token available. Please log in first.");
      return;
    }

    const requestData = {
      user: user, // Send the username as part of the request body
    };

    fetch("http://localhost:8080/api/validateJWT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`, // Send the token in the Authorization header
      },
      body: JSON.stringify(requestData),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("JWT validation failed");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setValidationMessage("JWT is valid!");
        } else {
          setValidationMessage("Invalid or expired JWT.");
        }
      })
      .catch((err) => {
        console.error(err.message);
        setValidationMessage("Error during JWT validation.");
      });
  };

  return (
    <>
      <h4>Sample Login</h4>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "200px",
          gap: "10px",
          border: "1px solid gray",
          padding: "20px",
          backgroundColor: "#b1b1b1",
        }}
      >
        <input
          type="text"
          name="user"
          id="user"
          placeholder="Enter username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>

      <br />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "200px",
          gap: "10px",
          border: "1px solid gray",
          paddingLeft: "20px",
          paddingRight: "20px",
          backgroundColor: "#b1b1b1",
        }}
      >
        <p>JWT Token Received:</p>
        <p
          style={{
            wordWrap: "break-word",
            wordBreak: "break-all",
            marginTop: "0",
          }}
        >
          {jwtToken}
        </p>
        <button onClick={validateJWT}>Login with JWT</button>
        <p>{validationMessage}</p>
      </div>
    </>
  );
};

export default Login;
