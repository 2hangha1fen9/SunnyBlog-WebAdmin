import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { start, close } from "@/utils/progress";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: () => import("@/views/HomeView.vue"),
        name: "SunnyBlog",
        meta: {
            hidden: true
        }
    },
    {
        path: "/user",
        component: () => import("@/views/AboutView.vue"),
        meta: {
            title: "用户管理",
            icon: "user",
        },
        children: [
            {
                path: "/user/list",
                component: () => import("@/views/AboutView.vue"),
                meta: {
                    title: "用户列表",
                    icon: "list",
                },
            },
            {
                path: "/user/add",
                component: () => import("@/views/AboutView.vue"),
                meta: {
                    title: "添加用户",
                    icon: "useradd",
                },
            },
        ],
    },
    {
        path: "/404",
        component: () => import("@/views/404.vue"),
        meta: {
            hidden: true,
        },
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/404",
        meta: {
            hidden: true,
        },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

//默认路由守卫
router.beforeEach((pre, next) => {
    start();
});
router.afterEach(() => {
    close();
});

export default router;
