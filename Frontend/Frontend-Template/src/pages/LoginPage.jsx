import { useState } from "react";
import { loginUser } from "../services/UserService";
import { jwtDecode } from "jwt-decode";
import { Container, Card, Form, Button, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = await loginUser(credentials);

      if (!token || token === "Fail") {
        showToast("Invalid Credentials", "danger");
        return;
      }

      // Decode JWT (email + role)
      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: decoded.sub,
          role: decoded.role
        })
      );

      showToast("Login Successful ", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      showToast(err || "Login Failed", "danger"
        
      );
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>

        <Form onSubmit={handleLogin}>
          <Form.Control
            className="mb-2"
            placeholder="Email"
            type="email"
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />

          <Form.Control
            className="mb-3"
            placeholder="Password"
            type="password"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />

          <Button type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>

      {/* Toast */}
      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        delay={2000}
        autohide
        bg={toast.type}
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        <Toast.Body className="text-white">
          {toast.msg}
        </Toast.Body>
      </Toast>
    </Container>
  );
}