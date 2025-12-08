<script lang="ts" setup>
import "../style.scss";
import ProfileIcon from "@/shared/ui/ProfileIcon";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";

const authorizedUser = useAuthorizedUserStore();
const userName = `${authorizedUser.user?.lastName} ${authorizedUser.user?.firstName}`;
const userMobilePhone = authorizedUser?.user?.employeeData?.peoples?.phone;
const userEmail = authorizedUser?.user?.employeeData?.peoples?.email;
const userProfession = authorizedUser?.user?.professionTitle;
</script>
<template>
  <div class="profileSidebar">
    <div class="profileSidebar__topContent">
      <div class="profileSidebar__profileInfo">
        <ProfileIcon />
        <p
          class="profileSidebar__text profileSidebar__text--marginTop profileSidebar__text--semiWidth"
        >
          {{ userName }}
        </p>
        <p
          class="profileSidebar__text profileSidebar__text--profession"
        >
          {{ userProfession || 'Профессия' }}
        </p>
      </div>
    </div>
    <div class="profileSidebar__bottomContent">
      <p class="profileSidebar__text">
        Телефон: {{ userMobilePhone }}
      </p>
      <p class="profileSidebar__text">
        Email: {{ userEmail }}
      </p>
      <slot name="editButton" />
    </div>
  </div>
</template>
