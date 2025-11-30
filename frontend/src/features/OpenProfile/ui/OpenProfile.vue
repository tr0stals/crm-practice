<script lang="ts" setup>
import "../style.scss";
import Button from "@/shared/ui/Button/ui/Button.vue";

const props = defineProps<{
    handleClick: () => void;
}>();
</script>
<template>
    <div class="openProfile">
        <Button :extra-classes="['openProfile__button']" :handle-click="props.handleClick" >Перейти в профиль</Button>
    </div>
</template>
