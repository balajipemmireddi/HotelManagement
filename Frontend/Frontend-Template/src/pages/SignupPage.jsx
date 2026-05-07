import { useState } from "react";
import { registerUser } from "../services/UserService";
import { Container, Card, Form, Button, Toast } from "react-bootstrap";

export default function Signup() {

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await registerUser(user);

      showToast("Signup Successful", "success");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err) {
      showToast(err || "Signup Failed", "danger");
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Signup</h3>

        <Form onSubmit={handleSignup}>

          <Form.Control
            className="mb-2"
            placeholder="First Name"
            name="firstName"
            onChange={handleChange}
            required
          />

          <Form.Control
            className="mb-2"
            placeholder="Last Name"
            name="lastName"
            onChange={handleChange}
          />

          <Form.Control
            className="mb-2"
            placeholder="Email"
            type="email"
            name="email"
            onChange={handleChange}
            required
          />

          <Form.Control
            className="mb-3"
            placeholder="Password"
            type="password"
            name="password"
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-100">
            Register
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