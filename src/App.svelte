<script>
  import Router from "svelte-spa-router";

  // الصفحات
  import Home from "./pages/Home.svelte";
  import Login from "./pages/login.svelte";
  import Register from "./pages/Register.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Demo from "./pages/Demo.svelte";
  import History from "./pages/History.svelte";

  import Navbar from "./components/Navbar.svelte";

  // تعريف الروتس
  const routes = {
    "/": Home,
    "/login": Login,
    "/register": Register,
    "/dashboard": Dashboard,
    "/demo": Demo,
    "/history": History,
  };
</script>

<div class="min-h-screen flex flex-col">
  <Navbar />

  <main class="flex-1 w-full max-w-[1200px] mx-auto py-8 px-6">
    <Router {routes} />
  </main>
</div>
