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
import DepartmentsTreeView from "@/views/Pages/DepartmentsTreeview/ui/DepartmentsTreeView.vue";
import OrganizationsTreeView from "@/views/Pages/OrganizationsTreeview/ui/OrganizationsTreeView.vue";
import ComponentsTreeView from "@/views/Pages/ComponentsTreeview/ui/ComponentsTreeView.vue";
import CurrentTasksTreeView from "@/views/Pages/CurrentTasksTreeview/ui/CurrentTasksTreeView.vue";
import LicenseTypesTreeView from "@/views/Pages/LicenseTypesTreeview/ui/LicenseTypesTreeView.vue";
import OrderRequestsTreeView from "@/views/Pages/OrderRequestsTreeview/ui/OrderRequestsTreeView.vue";
import PcbOrdersTreeView from "@/views/Pages/PcbOrdersTreeview/ui/PcbOrdersTreeView.vue";
import UsersTreeView from "@/views/Pages/UsersTreeview/ui/UsersTreeView.vue";
import WarehouseComponentsTreeView from "@/views/Pages/WarehouseComponentsTreeview/ui/WarehouseComponentsTreeView.vue";
import EmployeesTreeView from "@/views/Pages/EmployeesTreeview/ui/EmployeesTreeview.vue";

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
    path: "/employees",
    component: EmployeesTreeView,
  },
  {
    path: "/departments",
    component: DepartmentsTreeView,
  },
  {
    path: "/organizations",
    component: OrganizationsTreeView,
  },
  {
    path: "/components",
    component: ComponentsTreeView,
  },
  {
    path: "/current-tasks",
    component: CurrentTasksTreeView,
  },
  {
    path: "/license_types",
    component: LicenseTypesTreeView,
  },
  {
    path: "/order_requests",
    component: OrderRequestsTreeView,
  },
  {
    path: "/pcb_orders",
    component: PcbOrdersTreeView,
  },
  {
    path: "/users",
    component: UsersTreeView,
  },
  {
    path: "/warehouse_components",
    component: WarehouseComponentsTreeView,
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
