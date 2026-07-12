import MainLayout from "../layouts/MainLayout.jsx";
import Welcome from "../components/Welcome.jsx";
import Button from "../components/Button.jsx";

const Home = () => {
  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        <Welcome name="Mohit" />

        <Button>Login</Button>

        <Button>Register</Button>

        <Button>Create Post</Button>
      </div>
    </MainLayout>
  );
};

export default Home;