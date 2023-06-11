<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    :headers="headers"
    :items="facturesFiltred(cat)"
    :search="search"
    items-per-page="5"
    return-object
    v-model="selected"
    multi-sort
    class="elevation-1"
    hover
  >
    <template v-slot:top>
      <v-text-field
        v-model="search"
        label="Search..."
        class="pa-4"
        elevation="2"
        variant="outlined"
        density="comfortable"
      >
        <template v-slot:append>
          <v-btn
            stacked
            @click="$emit('add')"
            elevation="2"
            variant="outlined"
            density="comfortable"
            >Add</v-btn
          >
        </template></v-text-field
      >
    </template>
    <template v-slot:item.preuve="{ item }">
      <DialogueImage :item="item" />
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="$emit('modify', item.raw)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="$emit('delete', item.raw)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions } from "pinia";
import { useAppStore } from "@/store/app.js";
import DialogueImage from "./DialogueImage.vue";
export default {
  components: { DialogueImage },
  props: { cat: String },
  mounted() {},
  methods: {
    ...mapActions(useAppStore, ["facturesFiltred"]),
    ...mapActions(useAppStore, ["addFacture"]),
  },
  data() {
    return {
      search: "",
      headers: [
        { title: "Date", align: "end", key: "date" },
        { title: "Titre", align: "end", key: "titre", class: "text-wrap" },
        { title: "Prix (€)", align: "end", key: "prix" },
        { title: "Preuve", align: "center", key: "preuve", sortable: false },
        { title: "Actions", align: "end", key: "actions", sortable: false },
      ],
      selected: [],
    };
  },
};
</script>
