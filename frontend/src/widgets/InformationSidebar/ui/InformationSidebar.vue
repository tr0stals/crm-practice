<script setup lang="ts">
import "../style.scss";
import close from "../../../../public/assets/profileSidebar-closeIcon.svg"

const props = defineProps<{
    onClose: () => void;
}>();
</script>
<template>
    <div class="informationSidebar">
        <img @click="props.onClose" class="informationSidebar__closeIcon" :src="close" alt="closeIcon"/>
        <slot />
    </div>
</template>
