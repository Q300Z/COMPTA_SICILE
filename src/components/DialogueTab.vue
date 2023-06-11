<template>
  <div class="text-center">
    <v-btn prepend-icon="mdi-tab" stacked @click="dialog = !dialog"
      >Manage tab</v-btn
    >
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      style="width: 500px"
    >
      <v-card>
        <v-card-title>Ajout d'une catégorie de Facture</v-card-title>
        <v-container>
          <Tableaux />
        </v-container>
        <v-card-actions>
          <v-divider></v-divider>
          <v-btn color="primary" variant="text" @click="saveTab()">Save</v-btn>
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Tableaux from "./TableauxTab.vue";

export default {
  components: { Tableaux },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
