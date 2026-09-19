<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="logo">TaskFlow</span>
      </div>
      <nav class="nav">
        <RouterLink to="/dashboard" class="nav-link" active-class="active">Dashboard</RouterLink>
        <RouterLink to="/solicitudes" class="nav-link" active-class="active">Solicitudes</RouterLink>
        <RouterLink to="/monitor" class="nav-link" active-class="active">Monitor</RouterLink>
      </nav>
    </aside>

    <div class="main-wrapper">
      <header class="topbar">
        <span class="page-title">{{ tituloPagina }}</span>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { RouterLink, RouterView } from 'vue-router';

  const route = useRoute();

  const mapa = {
    dashboard: 'Dashboard',
    solicitudes: 'Solicitudes',
    'nueva-solicitud': 'Nueva solicitud',
    'detalle-solicitud': 'Detalle de solicitud',
    monitor: 'Monitor'
  };

  const tituloPagina = computed(() => mapa[route.name] || 'TaskFlow');
</script>

<style scoped>
  .layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 220px;
    background: #0f172a;
    color: #fff;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .sidebar-header {
    padding: 1.25rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logo {
    font-size: 1.3rem;
    font-weight: 800;
    color: #60a5fa;
  }

  .nav {
    padding: 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.65rem 1rem;
    border-radius: 8px;
    color: #cbd5e1;
    font-size: 0.95rem;
    transition: background-color 0.2s, color 0.2s;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .nav-link.active {
    background: var(--color-primary);
    color: #fff;
  }

  .main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .topbar {
    padding: 1rem 1.5rem;
    background: #fff;
    border-bottom: 1px solid var(--color-border);
  }

  .page-title {
    font-size: 1.15rem;
    font-weight: 700;
  }

  .content {
    flex: 1;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    .layout {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      height: auto;
      position: static;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .nav {
      flex-direction: row;
      overflow-x: auto;
    }

    .sidebar-header {
      border-bottom: none;
    }

    .nav-link {
      white-space: nowrap;
    }
  }
</style>