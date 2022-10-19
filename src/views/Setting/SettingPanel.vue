<template>
    <section>
        <div class="row-panel">
            <NoticeConfig />
            <FooterConfig />
        </div>
        <div class="row-panel">
            <CommentConfig />
            <ScoreConfig />
        </div>
    </section>
</template>

<script setup lang="ts">
import CommentConfig from "./components/CommentConfig.vue"
import ScoreConfig from "./components/ScoreConfig.vue"
import NoticeConfig from "./components/NoticeConfig.vue"
import FooterConfig from "./components/FooterConfig.vue"
</script>

<style scoped>
.setting-card {
    margin: 0px 10px 10px 0px;
    flex-grow: 1;
    width: 50%;
}
.row-panel {
    display: flex;
    width: 100%;
    justify-content: space-between;
}
.row-panel >>> .config-submit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}
</style>
