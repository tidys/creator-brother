<template>
  <div class="brother" @click="onClick">
    {{ url }}
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "brother",
  props: {
    url: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const url1 = ref<string>("");
    return {
      url1,
      onClick() {
        window.open(props.url);
      },
    };
  },
});
</script>
<style lang="less" scoped>
.brother {
  width: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    background-color: #5e5e5e;
  }
}
</style>
