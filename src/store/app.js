// Utilities
import { defineStore } from "pinia";
import api from "@/api/factures.js";

/**
 * Store d'application
 * @typedef {Object} AppStore - Utilise le store d'application
 * @property {String} API_URL - URL de l'API
 * @property {Array} compta - Liste des factures
 * @property {Array} categorie - Liste des catégories de factures
 * @property {Number} editedIndex - Index de la facture en cours d'édition (-1 si aucune)
 * @property {Object} editFac - Facture en cours d'édition
 * @property {Array} preuve - Preuve(s) associée(s) à la facture en cours d'édition
 * @property {String} tab - Onglet actif
 * @property {Boolean} dialog - Indicateur d'affichage de la boîte de dialogue
 * @property {String} type - Type d'opération ("Ajout" ou "Modification")
 * @property {Boolean} load - Indicateur de chargement
 */

/**
 * Utilise le store d'application
 * @type {AppStore}
 */

export const useAppStore = defineStore("app", {
  state: () => ({
    API_URL: "http://192.168.1.103:3001",
    compta: [],
    categorie: [],
    editedIndex: -1,
    editFac: {},
    preuve: [],
    tab: "",
    dialog: false,
    type: "Ajout",
    load: true,
  }),
  actions: {
    /**
     * Renvoie la date actuelle au format "jour/mois/année"
     * @returns {String} Date actuelle au format "jour/mois/année"
     */
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
     * Ajoute une facture
     * @async
     * @returns {Promise<void>}
     */
    async addFacture() {
      if (this.editedIndex === -1) {
        this.editFac["date"] = this.dateNow();
        const data = await api.createFac(this.editFac, this.preuve);
        console.log(data.messsage);
        if (data) {
          this.editFac["_id"] = data.data._id;
          this.editFac["preuve"] = data.data.preuve;

          this.compta.push(this.editFac);

          this.modifyDialog();
        }
      } else {
        this.modifyFac();
      }
    },

    /**
     * Modifie une facture
     * @async
     * @returns {Promise<void>}
     */
    async modifyFac() {
      const updatedData = await api.modifyFac(this.editFac, this.preuve);
      console.log(updatedData);
      if (updatedData) {
        this.compta[this.editedIndex] = this.editFac;
        this.compta[this.editedIndex]["preuve"] = updatedData.data.preuve;

        this.modifyDialog();
      }
    },

    /**
     * Supprime une facture
     * @async
     * @param {Object} fac - Facture à supprimer
     * @returns {Promise<void>}
     */
    async removeFacture(fac) {
      const deletedData = await api.deleteFac(fac._id);
      console.log(deletedData.message);
      if (deletedData) {
        this.compta = this.compta.filter((item) => item._id !== fac._id);
      }
    },
    /**
     * Supprime une Categorie avec ses factures lié
     * @async
     * @param {Object} fac - Facture à supprimer
     * @returns {Promise<void>}
     */
    removeCat(cat) {
      var factures = this.facturesFiltred(cat.titre);
      factures.forEach(async (fac) => {
        const deletedData = await api.deleteFac(fac._id);
        console.log(deletedData.message);
        this.compta = this.compta.filter((item) => item._id !== fac._id);
      });
      this.categorie = this.supprDoublons(this.compta).sort();
      this.tab = this.categorie[0];
    },
    /**
     * Filtre les factures par catégorie
     * @param {String} filtre - Catégorie de filtrage
     * @returns {Array} Liste des factures filtrées
     */
    facturesFiltred(filtre) {
      return this.compta.filter((facture) => facture.categorie === filtre);
    },
    /**
     * Modifie l'index de la facture en cours d'édition
     * @param {Number} id - Index de la facture
     * @returns {void}
     */
    modifyEditedIndex(id) {
      this.editedIndex = id;
    },
    /**
     * Modifie la facture en cours d'édition
     * @param {Object} item - Facture modifiée
     * @returns {void}
     */
    modifyEdited(item) {
      this.editFac = item;
    },
    /**
     * Modifie l'onglet actif
     * @param {String} tab - Onglet actif
     * @returns {void}
     */
    modifyTab(tab) {
      this.tab = tab;
    },
    /**
     * Modifie l'état de la boîte de dialogue
     * @returns {void}
     */
    modifyDialog() {
      this.dialog = !this.dialog;
      this.editFac = { categorie: this.tab };
      this.preuve = null;
    },
    modifyCat(currentCat, newCat) {
      var factures = this.facturesFiltred(currentCat.titre);
      factures.forEach((fac) => {
        fac.categorie = newCat;
        this.editFac = fac;
        this.editedIndex = -1;
        this.modifyFac();
      });

      var selectedTab = this.categorie.findIndex(
        (cats) => cats === currentCat.titre
      );
      if (selectedTab !== -1) {
        this.categorie[selectedTab] = newCat;
      }

      this.modifyTab(newCat);
    },

    /**
     * Récupère les factures
     * @async
     * @returns {Promise<void>}
     */
    async getFacture() {
      this.compta = await api.getAllFac();
      if (this.compta !== null) {
        this.categorie = this.supprDoublons(this.compta).sort();
      }
      if (this.compta && this.categorie) {
        this.load = false;
      }
    },
    /**
     * Supprime les doublons d'une liste de factures
     * @param {Array} liste - Liste de factures
     * @returns {Array} Liste de catégories sans doublons
     */
    supprDoublons(liste) {
      var categories = []; // Tableau pour stocker les catégories déjà rencontrées

      for (var i = 0; i < liste.length; i++) {
        var categorie = liste[i].categorie;

        if (!categories.includes(categorie)) {
          // Vérifie si la catégorie n'a pas déjà été rencontrée
          categories.push(categorie); // Ajoute la catégorie au tableau des catégories
        }
      }
      return categories;
    },
  },
});
