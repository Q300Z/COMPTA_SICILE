<template>
  <div class="text-center">
    <v-dialog
      v-model="this.dialog"
      transition="dialog-bottom-transition"
      style="width: 500px"
    >
      <v-card class="px-3 pt-5">
        <v-card-title>{{ this.type }} d'une facture</v-card-title>
        <v-container>
          <v-form>
            <v-text-field
              clearable
              label="Titre de la facture"
              v-model="editFac.titre"
              required
            ></v-text-field>
            <!-- <v-text-field
            label="Date de la facture"
            type="date"
            clearable
            required
          ></v-text-field> -->
            <v-text-field
              label="Prix de la facture"
              type="number"
              suffix="€"
              v-model="editFac.prix"
              required
            ></v-text-field>
            <ImageLoad
              :item="this.API_URL + this.editFac.preuve"
              v-if="this.editFac.preuve"
              max-height="550"
              max-width="250"
            ></ImageLoad>
            <v-file-input
              label="Photo ticket de caisse"
              clearable
              v-model="preuve"
              required
              show-size
              accept="image/png, image/jpeg, image/jpg"
            ></v-file-input>
            <v-select
              label="Type de facture"
              :items="categorie"
              clearable
              v-model="editFac.categorie"
              required
            ></v-select>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-divider></v-divider>
          <v-btn color="primary" variant="text" @click="saveFac()">Save</v-btn>
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import { mapWritableState, mapActions } from "pinia";
import ImageLoad from "./ImageLoad.vue";

export default {
  computed: {
    ...mapWritableState(useAppStore, [
      "categorie",
      "dialog",
      "editFac",
      "tab",
      "preuve",
      "type",
      "API_URL",
    ]),
  },
  watch: {
    tab(newTab) {
      //console.log(newTab);
      this.editFac.categorie = newTab;
    },
  },
  methods: {
    ...mapActions(useAppStore, ["addFacture"]),
    saveFac() {
      this.addFacture();
      this.editFac.categorie = this.tab;
    },
  },
  components: { ImageLoad },
};
</script>
