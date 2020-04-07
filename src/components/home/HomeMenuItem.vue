<template>
  <div>
    <template v-for="menu in menus">
      <el-menu-item v-if="!(menu.children && menu.children.length)" :index="menu.href" :key="menu.id">
        <base-icon :icon-class="menu.icon" class="icon-right"></base-icon>
        {{ menu.name }}
      </el-menu-item>
      <el-submenu v-else :index="menu.id" :key="menu.id">
        <template v-slot:title>
          <base-icon :icon-class="menu.icon" class="icon-right"></base-icon>
          {{ menu.name }}
        </template>
        <home-menu-item :menus="menu.children"></home-menu-item>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'home-menu-item',
  props: {
    menus: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-right {
  padding-right: 5px;
}
</style>
