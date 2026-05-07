import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Container, Card } from "react-bootstrap";

export default function DashBoard() {
  const { user } = useContext(AuthContext);

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-5 shadow text-center" style={{ width: "500px" }}>
        <h2>Welcome to your Dashboard!</h2>
        <p className="text-muted mt-3">
          You are successfully logged in as: <br />
          <strong>{user?.email}</strong>
        </p>
        <p className="mt-4">
          <em>This is a boilerplate protected route. Build your features here!</em>
        </p>
      </Card>
    </Container>
  );
}