<script setup lang="ts"></script>
<template>
  <aside class="sidebar">
    <div class="logo">А ПРАКТИКУМ</div>
    <NavigationSidebar :sections-list="sectionsList" />
    <RelatedTablesSidebar
      :related-tables="relatedTables[navigationStore.currentSection] || []"
    />
  </aside>
</template>
