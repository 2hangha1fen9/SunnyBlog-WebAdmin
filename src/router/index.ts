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
        path: '/article',
        component: Layout,
        redirect: '/article/list',
        meta: {
            title: '文章',
            icon: 'article'
        },
        children: [
            {
                path: '/article/list',
                component: () => import("@/views/Article/ArticleList.vue"),
                meta: {
                    title: '文章列表',
                    icon: 'articlelist',
                }
            }
        ]
    },
    {
        path: '/permission',
        component: Layout,
        redirect: '/user/list',
        meta: {
            title: '权限',
            icon: 'auth'
        },
        children: [
            {
                path: "/user/list",
                component: () => import("@/views/Permission/UserList.vue"),
                meta: {
                    title: "用户管理",
                    icon: "userlist",
                },
            },
            {
                path: "/permission/rolelist",
                component: () => import('@/views/Permission/RoleList.vue'),
                meta: {
                    title: '角色管理',
                    icon: 'rolelist'
                }
            },
            {
                path: "/permission/authlist",
                component: () => import('@/views/Permission/AuthList.vue'),
                meta: {
                    title: '权限管理',
                    icon: 'authlist'
                }
            }
        ]
    },
    {
        path: '/maintin',
        component: Layout,
        redirect: '/maintin/apollo',
        meta: {
            title: '系统维护',
            icon: 'maintin'
        },
        children: [
            {
                path: '/maintin/apollo',
                component: () => import('@/views/Maintin/Iframe.vue'),
                props: {
                    url: 'http://localhost:8080/apollo'
                },
                meta: {
                    title: '配置中心',
                    icon: 'apollo'
                }
            },
            {
                path: '/maintin/consul',
                component: () => import('@/views/Maintin/Iframe.vue'),
                props: {
                    url: 'http://localhost:8500/ui/'
                },
                meta: {
                    title: '注册中心',
                    icon: 'consul'
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
