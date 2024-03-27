<template>
  <div class="panel">
    <div v-if="false">
      <CCButton @click="onTestMe">me</CCButton>
      <CCButton @click="onTestOthers">others</CCButton>
    </div>
    <CCButton @click="onClickBtn" :enable="searchEnabled">{{ searchText }}</CCButton>
    <div class="container ccui-scrollbar">
      <div class="brothers">
        <Brother v-for="(item, index) in brothers" :key="index" :index="index" :url="item"> </Brother>
      </div>
    </div>
    <iframe v-if="false" src="http://192.168.1.134:7456" @load="onLoad" @error="onError"></iframe>
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
      onLoad(a: any) {
        const iframe = a.target as HTMLIFrameElement;
        console.log(iframe.outerHTML);
      },
      onError(a: any) {
        console.log("onError");
      },
      async onTestMe() {
        const ping = new Ping();
        const url = await ping.searchTarget("192.168.1.134");
        console.log(url);
      },
      async onTestOthers() {
        const ping = new Ping();
        const url = await ping.searchTarget("192.168.1.182");
        console.log(url);
      },
      async onClickBtn() {
        if (!searchEnabled.value) {
          console.log(`wait ...`);
          return;
        }
        searchEnabled.value = false;
        brothers.value.length = 0;
        const ping = new Ping();
        ping.timeout = 100;
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
