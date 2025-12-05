<script>
  import Router from 'svelte-spa-router';

  // الصفحات
  import Home from './pages/Home.svelte';
  import Login from './pages/login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import Demo from './pages/Demo.svelte';
  import History from './pages/History.svelte';

  // تعريف الروتس
  const routes = {
    '/': Home,
    '/login': Login,
    '/register': Register,
    '/dashboard': Dashboard,
    '/demo': Demo,
    '/history': History
  };
</script>

<!-- Navbar بسيطة للتنقّل -->
<nav
  style="
    display:flex;
    gap:1rem;
    padding:0.75rem 1.5rem;
    border-bottom:1px solid #ddd;
    align-items:center;
  "
>
  <a href="#/">Home</a>
  <a href="#/login">Login</a>
  <a href="#/register">Register</a>
  <a href="#/dashboard">Dashboard</a>
  <a href="#/demo">Demo</a>
  <a href="#/history">History</a>
</nav>

<main style="padding:1.5rem;">
  <Router {routes} />
</main>
