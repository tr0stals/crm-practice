<script lang="ts" setup>
import ImportDatabase from "@/features/ImportDatabase/ui/ImportDatabase.vue";
import "../style.scss";
import ExportDatabase from "@/features/ExportDatabase/ui/ExportDatabase.vue";
import ExportTableButton from "@/features/ExportTableButton/ui/ExportTableButton.vue";
import ImportTableButton from "@/features/ImportTableButton/ui/ImportTableButton.vue";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();
</script>
<template>
  <div class="systemDashboard">
    <ImportDatabase />
    <ExportDatabase />
    <ExportTableButton :onSuccessCallback="onSuccessCallback" />
    <ImportTableButton :onSuccessCallback="onSuccessCallback" />
  </div>
</template>
