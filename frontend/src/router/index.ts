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
import useFetch from "@/shared/lib/useFetch";
import { defaultEndpoint } from "@/shared/api/axiosInstance";
import SuperAdmin from "@/views/SuperAdmin/ui/SuperAdmin.vue";
import RegisterForm from "@/features/RegisterForm/ui/RegisterForm.vue";
import { watch } from "vue";
import LoginForm from "@/features/LoginForm/ui/LoginForm.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: LoginForm,
    meta: { public: true },
  },
  {
    path: "/",
    name: "SuperAdmin",
    component: SuperAdmin,
    meta: { public: true },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterForm,
    meta: { public: true },
  },
  {
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
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();

    // если токен хранится в localStorage
    const token = authStore.token || localStorage.getItem("token");

    if (to.meta.public) {
      // но если пользователь уже залогинен и идёт на /login или /register — отправляем на /dashboard
      if (
        token &&
        (to.path === "/login" || to.path === "/register" || to.path === "/")
      ) {
        return next("/dashboard");
      }
      return next();
    }

    if (to.meta.requiresAuth && !token) {
      return next("/login");
    }

    next();
  }
);

export default router;
