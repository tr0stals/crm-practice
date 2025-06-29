import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";
import { useAuthStore } from "@/shared/store/auth.store";
import AuthView from "@/views/AuthView/ui/AuthView.vue";
import ErrorView from "@/views/ErrorView/ui/ErrorView.vue";
import Dashboard from "@/views/Dashboard/ui/Dashboard.vue";
import EmployeesTreeView from '@/views/Pages/EmployeesTreeView.vue'
import DepartmentsTreeView from '@/views/Pages/DepartmentsTreeView.vue'
import OrganizationsTreeView from '@/views/Pages/OrganizationsTreeView.vue'
import ComponentsTreeView from '@/views/Pages/ComponentsTreeView.vue'
import CurrentTasksTreeView from '@/views/Pages/CurrentTasksTreeView.vue'
import LicenseTypesTreeView from '@/views/Pages/LicenseTypesTreeView.vue'
import OrderRequestsTreeView from '@/views/Pages/OrderRequestsTreeView.vue'
import PcbOrdersTreeView from '@/views/Pages/PcbOrdersTreeView.vue'
import UsersTreeView from '@/views/Pages/UsersTreeView.vue'
import WarehouseComponentsTreeView from '@/views/Pages/WarehouseComponentsTreeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: AuthView,
    meta: { public: true },
  },
  {
    // TODO: перебрасывать пользователя на главную страницу (а не дашборд)
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/employees',
    component: EmployeesTreeView
  },
  {
    path: '/departments',
    component: DepartmentsTreeView
  },
  {
    path: '/organizations',
    component: OrganizationsTreeView
  },
  {
    path: '/components',
    component: ComponentsTreeView
  },
  {
    path: '/current-tasks',
    component: CurrentTasksTreeView
  },
  {
    path: '/license_types',
    component: LicenseTypesTreeView
  },
  {
    path: '/order_requests',
    component: OrderRequestsTreeView
  },
  {
    path: '/pcb_orders',
    component: PcbOrdersTreeView
  },
  {
    path: '/users',
    component: UsersTreeView
  },
  {
    path: '/warehouse_components',
    component: WarehouseComponentsTreeView
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.token) {
      next("/login");
    } else if (to.meta.public && authStore.token) {
      next("/dashboard");
    } else {
      next();
    }
  }
);

export default router;
