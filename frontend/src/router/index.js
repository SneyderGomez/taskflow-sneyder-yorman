import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '../layouts/MainLayout.vue';

import DashboardView from '../views/DashboardView.vue';
import RequestsView from '../views/RequestsView.vue';
import NewRequestView from '../views/NewRequestView.vue';
import RequestDetailView from '../views/RequestDetailView.vue';
import MonitorView from '../views/MonitorView.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: DashboardView },
      { path: 'solicitudes', name: 'solicitudes', component: RequestsView },
      { path: 'solicitudes/nueva', name: 'nueva-solicitud', component: NewRequestView },
      { path: 'solicitudes/:id', name: 'detalle-solicitud', component: RequestDetailView },
      { path: 'monitor', name: 'monitor', component: MonitorView }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;