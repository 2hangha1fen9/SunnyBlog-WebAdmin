import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { start, close } from "@/utils/progress";
import Layout from '@/layout/Layout.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: Layout,
        name: "SunnyBlog",
        meta: {
            title: 'SunnyBlog',
            hidden: true
        },
        children: [
            {
                path: '/',
                component: () => import('@/views/HomeView.vue'),
            }
        ]
    },
    {
        path: "/user",
        component: Layout,
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
        path: '/login',
        component: () => import('@/views/Login.vue'),
        meta: {
            title: 'SunnyBlog统一认证',
            hidden: true
        }
    },
    {
        path: "/404",
        component: () => import("@/views/404.vue"),
        meta: {
            title: '404',
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

export default router;
