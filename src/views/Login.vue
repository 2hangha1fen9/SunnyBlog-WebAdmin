<template>
    <section class="login-container">
        <img id="bgBox" src="https://baotangguo.cn:8081/" />
        <el-form
            :model="loginData"
            :rules="rules"
            size="large"
            ref="loginForm"
            status-icon
            class="login-form"
            @keyup.native.enter="handleLogin(loginForm)"
        >
            <el-form-item>
                <h3>
                    <svg-icon icon-class="sunny" />
                    SunnyBlog统一认证
                </h3>
            </el-form-item>
            <el-form-item prop="username" required>
                <el-input
                    class="input-box"
                    v-model="loginData.username"
                    placeholder="登录名"
                    tabindex="1"
                    min="6"
                    max="20"
                ></el-input>
            </el-form-item>
            <el-form-item prop="password" required>
                <el-input
                    v-model="loginData.password"
                    placeholder="密码"
                    tabindex="1"
                    type="password"
                    min="6"
                    max="20"
                ></el-input>
            </el-form-item>
            <el-button
                type="primary"
                style="width: 100%; margin-bottom: 30px"
                @click="handleLogin(loginForm)"
                >登录</el-button
            >
        </el-form>
    </section>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { loginPayload } from "@/interface/user";
import { start, close } from "@/utils/progress";
import type { FormRules, FormInstance } from "element-plus";
import { login } from "@/api/identity"; //登录api

const router = useRouter();
const route = useRoute();
const store = useStore();
//加载显示
const loading = ref(false);
const redirect = ref();
//表单数据
const loginForm = ref<FormInstance>();
const loginData = reactive<loginPayload>({
    client_id: "web",
    grant_type: "password",
    username: "",
    password: "",
});
//表单验证规则
const rules = reactive<FormRules>({
    username: [
        {
            required: true,
            message: "请输入登录名",
            trigger: "blur",
        },
        {
            min: 6,
            max: 20,
            message: "登录名长度为6~20个字符",
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            message: "请输入密码",
            trigger: "blur",
        },
        {
            min: 6,
            max: 20,
            message: "密码长度为6~20个字符",
            trigger: "blur",
        },
    ],
});

//监控路由重定向
watch(
    route,
    (routes) => {
        redirect.value = routes.query && routes.query.redirect;
    },
    {
        immediate: true,
    }
);

//登录方法
async function handleLogin(form: FormInstance) {
    if (!form) return;
    await form.validate((valid, fields) => {
        if (valid) {
            start();

            //调用登录api
            login(loginData).then((data) => {
                //存入token
                store.dispatch("user/login", data);
                router.push({ path: redirect.value || "/" });
                close();
            });
        } else {
            close();
            console.log(fields);
            return false;
        }
    });
}
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
#bgBox {
    z-index: -1;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 1s, transform 0.25s, filter 0.25s;
}
.login-form {
    width: 300px;
    padding: 30px 20px 10px 20px;
    border-radius: 10px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.25);
    box-shadow: rgb(0 0 0 / 20%) 0 0 10px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    overflow: hidden;
    transition: color 0.25s, background-color 0.25s, box-shadow 0.25s,
        left 0.25s, opacity 0.25s, top 0.25s, width 0.25s;
}
</style>