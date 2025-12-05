<script>
  import Router from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import { onMount } from "svelte";
  import { auth } from "./stores/auth";
  import { get } from "svelte/store";

  // الصفحات
  import Home from "./pages/Home.svelte";
  import Login from "./pages/login.svelte";
  import Register from "./pages/Register.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Demo from "./pages/Demo.svelte";
  import History from "./pages/History.svelte";
  import Navbar from "./components/Navbar.svelte";

  // Load auth token on mount
  onMount(() => {
    auth.load();
  });

  // Guard function for protected routes
  const requireAuth = (detail) => {
    const authenticated = get(auth).isAuthenticated;
    if (!authenticated) {
      // Use replace to avoid history stack issues
      Router.push("/login");
      return false;
    }
    return true;
  };

  // تعريف الروتس
  const routes = {
    "/": Home,
    "/login": Login,
    "/register": Register,
    "/dashboard": wrap({
      component: Dashboard,
      conditions: [requireAuth],
    }),
    "/demo": wrap({
      component: Demo,
      conditions: [requireAuth],
    }),
    "/history": wrap({
      component: History,
      conditions: [requireAuth],
    }),
  };
</script>

<div class="min-h-screen flex flex-col">
  <Navbar />

  <main class="flex-1 w-full max-w-[1200px] mx-auto py-8 px-6">
    <Router {routes} />
  </main>
</div>
