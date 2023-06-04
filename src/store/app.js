// Utilities
import { defineStore } from "pinia";
import api from "@/api/factures.js";

export const useAppStore = defineStore("app", {
  state: () => ({
    API_URL: "http://localhost:3001",
    compta: [],
    categorie: ["Bouffe", "Transport", "Menage"],
    editedIndex: -1,
    editFac: {
      categorie: "Bouffe",
    },
    preuve: [],
    tab: "Bouffe",
    dialog: false,
    type: "Ajout",
    load: false,
  }),
  actions: {
    dateNow() {
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1; // Months start at 0!
      let day = today.getDate();

      if (day < 10) day = "0" + day;
      if (month < 10) month = "0" + month;

      return day + "/" + month + "/" + year;
    },
    /**
     * Ajout d'une facture
     */
    async addFacture() {
      if (this.editedIndex === -1) {
        this.editFac["date"] = this.dateNow();
        const data = await api.createFac(this.editFac, this.preuve);
        if (data) {
          this.editFac["_id"] = data.data._id;
          this.editFac["preuve"] = data.data.preuve;

          this.compta.push(this.editFac);

          this.modifyDialog();
        }
      } else {
        console.log(this.editFac);
        const updatedData = await api.modifyFac(this.editFac, this.preuve);
        if (updatedData) {
          this.compta[this.editedIndex] = this.editFac;
          this.compta[this.editedIndex]["preuve"] = updatedData.data.preuve;

          this.modifyDialog();
        }
      }
    },
    /**
     * Supprime une facture
     * @param {Number} id
     */
    async removeFacture(fac) {
      const deletedData = await api.deleteFac(fac._id);
      console.log(deletedData.message);
      if (deletedData) {
        this.compta = this.compta.filter((item) => item._id !== fac._id);
      }
    },
    /**
     *
     * @param {Object} filtre
     * @returns Retourne la liste des factures
     */
    facturesFiltred(filtre) {
      if (this.compta) {
        this.getFacture();
      }
      return this.compta.filter((facture) => facture.categorie === filtre);
    },

    modifyEditedIndex(id) {
      this.editedIndex = id;
    },
    modifyEdited(item) {
      this.editFac = item;
    },
    modifyTab(tab) {
      this.tab = tab;
    },
    modifyDialog() {
      this.dialog = !this.dialog;
      this.editFac = { categorie: this.tab };
      this.preuve = null;
    },
    async getFacture() {
      this.compta = await api.getAllFac();
      if (!this.compta) {
        this.load = true;
      }
    },
  },
});
