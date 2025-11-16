const express = require("express");
const { collection, doc, getDoc, getDocs } = require("firebase/firestore");

function routes(db) {
  const router = express.Router();

  const produtosCollection = collection(db, "produtos");
  const bebidasCollection = collection(db, "bebidas");
  const disponiveisCollection = collection(db, "disponiveis");
  const combosCollection = collection(db, "combos");

  // =================== DISPONIVEIS ===================
  async function getDisp() {
    try {
      const snapshot = await getDocs(disponiveisCollection);
      const prod_disp = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return prod_disp;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  router.get("/disponiveis", async (req, res) => {
    try {
      const data = await getDisp();
      res.json({ prod_disp: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // =================== PRODUTOS ===================
  // Retorna todos os produtos
  router.get("/produto", async (req, res) => {
    try {
      const snapshot = await getDocs(produtosCollection);
      const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ produtos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.get("/bebidas", async (req, res) => {
     try {
      const snapshot = await getDocs(bebidasCollection);
      const bebidas_disp = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ bebidas_disp});
    } catch (error) {
      throw new Error(error.message);
    }
  })
  router.get("/bebidas/:id", async (req, res) => {
    try {
      const docRef = doc(db, "bebidas", req.params.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Bebidas não encontrado" });
      }

      res.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Retorna um produto específico pelo id
  router.get("/produto/:id", async (req, res) => {
    try {
      const docRef = doc(db, "produtos", req.params.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // =================== COMBOS ===================
  router.get("/combos", async (req, res) => {
    try {
      const snapshot = await getDocs(combosCollection);
      const combos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ combos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/combos/:id", async (req, res) => {
    try {
      const docRef = doc(db, "combos", req.params.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Combo não encontrado" });
      }

      res.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = routes;
