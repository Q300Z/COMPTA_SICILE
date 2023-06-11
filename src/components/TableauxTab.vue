<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    :headers="headers"
    :items="currentCat"
    items-per-page="5"
    return-object
    v-model="selected"
    multi-sort
    hover
  >
    <template v-slot:top>
      <v-text-field
        v-model="newCategorie"
        label="Ajout d'une catégorie"
        class="pa-4"
        elevation="2"
        variant="outlined"
        density="compact"
        clearable
      >
        <template v-slot:append>
          <v-btn
            stacked
            @click="saveTab"
            elevation="0"
            variant="outlined"
            density="compact"
          >
            Add
          </v-btn>
        </template>
      </v-text-field>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="modify(item.raw, newCategorie)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="removeCat(item.raw)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { useAppStore } from "@/store/app.js";
export default {
  created() {},
  computed: {
    ...mapWritableState(useAppStore, ["categorie"]),
    currentCat() {
      return this.categorie.map((cat) => ({ titre: cat }));
    },
  },
  methods: {
    ...mapActions(useAppStore, ["facturesFiltred", "modifyCat", "removeCat"]),
    saveTab() {
      if (!this.categorie.includes(this.newCategorie))
        this.categorie.push(this.newCategorie);
      else console.error("Catégorie déjà existant");
      this.dialog = !this.dialog;
    },
    modify(currentCategorie, newCategorie) {
      this.modifyCat(currentCategorie, newCategorie);
    },
  },
  data() {
    return {
      search: "",
      headers: [
        { title: "Titre", align: "center", key: "titre", class: "text-wrap" },
        { title: "Actions", align: "center", key: "actions", sortable: false },
      ],
      selected: [],
      newCategorie: "",
      type: "Ajout",
      icon_mod: "mdi-pencil",
      icon_cancel: "mdi-close",
      icon_current: "mdi-pencil",
    };
  },
};
</script>
