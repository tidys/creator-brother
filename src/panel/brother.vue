<template>
  <div class="brother" @click="onClick">
    <div style="color: white; width: 25px">
      {{ index + 1 }}
    </div>
    <div style="margin-left: 8px">
      {{ url }}
    </div>
  </div>
</template>
<script lang="ts">
import CCP from "cc-plugin/src/ccp/entry-render";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "brother",
  props: {
    url: {
      type: String,
      default: "",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const url1 = ref<string>("");
    return {
      url1,
      onClick() {
        if (CCP.Adaptation.Env.isWeb) {
          window.open(props.url);
        } else if (CCP.Adaptation.Env.isPlugin) {
          CCP.Adaptation.Shell.openUrl(props.url);
        }
      },
    };
  },
});
</script>
<style lang="less" scoped>
.brother {
  width: 100%;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  margin-left: 3px;
  margin-top: 1px;
  margin-bottom: 1px;
  &:hover {
    background-color: #5e5e5e;
  }
}
</style>
