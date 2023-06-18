<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app-bar :elevation="2">
    <v-app-bar-title>Factures</v-app-bar-title>
    <DialogueTab v-if="load" />
  </v-app-bar>
  <div class="text-center" v-if="load">
    <v-progress-circular
      indeterminate
      size="80"
      width="10"
      color="primary"
    ></v-progress-circular
    ><br />
    <v-btn color="primary" class="ma-5" @click="getFacture">Refresh</v-btn>
  </div>

  <v-card v-else elevation="0">
    <DialogueTab v-if="categorie.length <= 0" class="ma-10"></DialogueTab>
    <v-tabs v-model="tab" bg-color="primary" align-tabs="center" grow v-else>
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
import DialogueTab from "@/components/DialogueTab.vue";
import { mapWritableState, mapActions } from "pinia";
import { useAppStore } from "@/store/app.js";

export default {
  created() {
    this.getFacture();
  },
  components: { Tableaux, Dialogue, DialogueTab },
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
      "getFacture",
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
