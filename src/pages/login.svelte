<script>
  import { login } from "../services/api";

  let username = "";
  let password = "";
  let error = "";

  async function handleLogin() {
    try {
      const res = await login(username, password);
      console.log("Logged in:", res.user);
    } catch (e) {
      error = "Login failed";
    }
  }
</script>
