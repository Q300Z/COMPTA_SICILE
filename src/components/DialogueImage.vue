<template>
  <v-dialog v-model="dialog" width="auto">
    <template v-slot:activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
        variant="plain"
        density="compact"
        :disabled="!item.value.preuve"
      >
        Preuve
      </v-btn>
    </template>
    <v-card>
      <ImageLoad :item="this.API_URL + this.item.value.preuve" />
      <v-card-actions>
        <v-btn color="primary" block @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAppStore } from "@/store/app";
import { mapState } from "pinia";
import ImageLoad from "./ImageLoad.vue";
export default {
  components: { ImageLoad },
  props: { item: Object },
  computed: {
    ...mapState(useAppStore, ["API_URL"]),
  },
  data() {
    return { dialog: false };
  },
};
</script>
