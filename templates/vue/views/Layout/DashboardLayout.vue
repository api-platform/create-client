<template>
  <div class="container-fluid">
    <div class="row flex-nowrap">
        <side-bar />
        <div class="col py-3">
          <router-view></router-view>
        </div>
    </div>
</div>
</template>

<script>
import SideBar from "../../components/SideBar.vue";
export default {
  components: {
    SideBar
},
};
</script>
