<template>
  <v-app-bar :elevation="2">
    <v-app-bar-title>Factures</v-app-bar-title>
    <v-btn prepend-icon="mdi-tab" stacked>Manage tab</v-btn>
  </v-app-bar>
  <div class="text-center" v-if="load">
    <v-progress-circular
      indeterminate
      size="80"
      width="10"
      color="primary"
    ></v-progress-circular>
  </div>

  <v-card v-else>
    <v-tabs v-model="tab" bg-color="primary" align-tabs="center" grow>
      <v-tab v-for="item in categorie" :key="item" :value="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item v-for="item in categorie" :key="item" :value="item">
          <Tableaux
            :cat="item"
            @add="modifyDialog"
            @modify="modify"
            @delete="deleteFac"
          />
          <Dialogue />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import Tableaux from "@/components/TableauxFac.vue";
import Dialogue from "@/components/DialogueFac.vue";
import { mapWritableState, mapActions } from "pinia";
import { useAppStore } from "@/store/app.js";

export default {
  components: { Tableaux, Dialogue },
  computed: {
    ...mapWritableState(useAppStore, [
      "categorie",
      "editedIndex",
      "compta",
      "tab",
      "editFac",
      "preuve",
      "type",
      "load",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Ajout" : "Modification";
    },
  },
  methods: {
    ...mapActions(useAppStore, [
      "modifyEditedIndex",
      "removeFacture",
      "modifyDialog",
    ]),

    modify(item) {
      this.modifyDialog();
      this.modifyEditedIndex(this.compta.indexOf(item));
      this.editFac = this.compta[this.editedIndex];
      this.type = "Modification";
    },
    deleteFac(item) {
      this.removeFacture(item);
    },
    dialogueClose() {
      this.modifyDialog();
      this.modifyEditedIndex(-1);
    },
  },
};
</script>
