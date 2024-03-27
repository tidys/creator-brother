<template>
  <div class="panel">
    <CCButton @click="onClickBtn" :enable="searchEnabled">{{ searchText }}</CCButton>
    <div class="container ccui-scrollbar">
      <div class="brothers">
        <Brother v-for="(item, index) in brothers" :key="index" :url="item"> </Brother>
      </div>
    </div>
    <iframe src="http://192.168.1.134:7456" @load="onLoad" @error="onError"></iframe>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, provide, nextTick } from "vue";
import PluginConfig from "../../cc-plugin.config";
import ccui from "@xuyanfeng/cc-ui";
import Brother from "./brother.vue";
import { Ping } from "./ping";
const { CCInput, CCButton } = ccui.components;

export default defineComponent({
  name: "index",
  components: { CCButton, Brother },
  setup(props, { emit }) {
    onMounted(() => {});
    const defaultSearchText = "search creator brother";
    const searchText = ref<string>(defaultSearchText);
    const count = ref(0);
    const searchEnabled = ref<boolean>(true);
    const brothers = ref<string[]>([]);
    return {
      searchText,
      searchEnabled,
      brothers,
      count,
      onLoad(a) {
        const iframe = a.target as HTMLIFrameElement;
        console.log("onLoad");
      },
      onError(a) {
        console.log("onError");
      },
      async onClickBtn() {

        
        return;
        if (!searchEnabled.value) {
          console.log(`wait ...`);
          return;
        }
        console.log("onClickBtn");
        searchEnabled.value = false;
        brothers.value.length = 0;
        const ping = new Ping();
        const arr = await ping.searchAll({
          process: (url: string) => {
            searchText.value = url;
          },
          find: (url: string) => {
            brothers.value.push(url);
          },
        });
        searchText.value = defaultSearchText;
        searchEnabled.value = true;
      },
    };
  },
});
</script>

<style scoped lang="less">
.panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .container {
    flex: 1;
    width: 100%;
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;
    .brothers {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
