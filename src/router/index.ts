import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
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
        redirect: '/user/list',
        meta: {
            title: "用户",
            icon: "user",
        },
        children: [
            {
                path: "/user/list",
                component: () => import("@/views/User/UserList.vue"),
                meta: {
                    title: "用户列表",
                    icon: "list",
                },
            },
            {
                path: "/user/add",
                component: () => import("@/views/User/AddUser.vue"),
                meta: {
                    title: "添加用户",
                    icon: "useradd",
                },
            }
        ],
    },
    {
        path: '/auth',
        component: Layout,
        redirect: '/auth/list',
        meta: {
            title: '权限',
            icon: 'auth'
        },
        children: [
            {
                path: "/auth/list",
                component: () => import('@/views/Login.vue'),
                meta: {
                    title: '权限列表',
                    icon: 'list'
                }
            }
        ]
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
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
