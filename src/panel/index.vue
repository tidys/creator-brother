<template>
  <div class="panel">
    <div class="title">
      <CCProp name="Your IP"><CCInput :value="ip" @change="onChangeIp"></CCInput></CCProp>
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
import { defineComponent, onMounted, ref, provide, nextTick, toRaw } from "vue";
import PluginConfig from "../../cc-plugin.config";
import ccui from "@xuyanfeng/cc-ui";
import Brother from "./brother.vue";
import { Ping } from "./ping";
import CCP from "cc-plugin/src/ccp/entry-render";
const { CCInput, CCButton, CCProp } = ccui.components;

export default defineComponent({
  name: "index",
  components: { CCButton, Brother, CCInput, CCProp },
  setup(props, { emit }) {
    onMounted(async () => {
      const localIp = await CCP.Adaptation.IP.getLocalIP();
      if (localIp) {
        ip.value = localIp;
      }
    });
    const defaultSearchText = "search creator brother";
    const searchText = ref<string>(defaultSearchText);
    const ip = ref<string>("192.168.1.18");
    const searchEnabled = ref<boolean>(true);
    const brothers = ref<string[]>([]);
    return {
      searchText,
      searchEnabled,
      brothers,
      ip,
      onChangeIp(v: string) {
        ip.value = v;
      },
      onLoad(a: any) {
        const iframe = a.target as HTMLIFrameElement;
        console.log(iframe.outerHTML);
      },
      onError(a: any) {
        console.log("onError");
      },
      async onClickBtn() {
        debugger;
        const href = window.location.href;
        if (href.startsWith("https://")) {
          CCP.Adaptation.Dialog.message({ message: "暂时不支持https进行检测" });
          return;
        }
        if (!searchEnabled.value) {
          console.log(`wait ...`);
          return;
        }
        searchEnabled.value = false;
        brothers.value.length = 0;
        const ping = new Ping();
        const v = toRaw(ip.value);
        const error = ping.checkIp(v);
        if (error) {
          CCP.Adaptation.Dialog.message({ message: error });
          return;
        }
        ping.setBaseIp(v);
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
  .title {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
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
