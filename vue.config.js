const { defineConfig } = require("@vue/cli-service")
const path = require("path")

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    lintOnSave: false,
    transpileDependencies: true,
    devServer: {
        proxy: {
            "/apollo": {
                target: "http://10.4.7.99:8070",
                ws: true,
                changeOrigin: true,
            },
        },
    },
    pluginOptions: {
        //sass样式加载
        "style-resources-loader": {
            preProcessor: "sass",
            patterns: [],
        },
    },
    chainWebpack(config) {
        // set svg-sprite-loader 图标加载器
        config.module.rule("svg").exclude.add(resolve("src/icons")).end()
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            })
            .end()
    },
})
