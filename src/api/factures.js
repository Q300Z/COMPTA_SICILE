const API_URL = "http://192.168.1.103:3001";

export default {
  async getAllFac() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données :",
        error
      );
      return null;
    }
  },

  async createFac(newFac, preuve) {
    try {
      const formData = new FormData();
      formData.append("fac", JSON.stringify(newFac));

      if (preuve) {
        formData.append("preuve", preuve[0], preuve[0].name);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout de la facture :",
        error
      );
      return null;
    }
  },

  async modifyFac(editFac, preuve) {
    try {
      const formData = new FormData();
      formData.append("fac", JSON.stringify(editFac));

      if (preuve && preuve.length > 0) {
        formData.append("preuve", preuve[0], preuve[0].name);
      }
      const response = await fetch(API_URL + "/" + editFac["_id"], {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la modification de la facture :",
        error
      );
      return null;
    }
  },

  async deleteFac(id) {
    try {
      const response = await fetch(API_URL + "/" + id, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de la facture :",
        error
      );
      return null;
    }
  },
};
