//const express = require("express");
//const { doc, getDoc, getDocs } = require("firebase/firestore");
//import { getDocs, doc } from "firebase/firestore"; // ERRADO no backend
const express = require("express");

function routes(db) {
  const router = express.Router();

  const produtosCollection = db.collection("produtos");
  const bebidasCollection = db.collection("bebidas");
  const disponiveisCollection = db.collection("disponiveis");
  const combosCollection = db.collection("combos");

  // =================== DISPONIVEIS ===================
  router.get("/disponiveis", async (req, res) => {
    try {
      const snapshot = await disponiveisCollection.get();
      const prod_disp = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ prod_disp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // =================== PRODUTOS ===================
  router.get("/produto", async (req, res) => {
    try {
      const snapshot = await produtosCollection.get();
      const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ produtos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/produto/:id", async (req, res) => {
    try {
      const docSnap = await produtosCollection.doc(req.params.id).get();
      if (!docSnap.exists) return res.status(404).json({ error: "Produto não encontrado" });
      res.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // =================== BEBIDAS ===================
  router.get("/bebidas", async (req, res) => {
    try {
      const snapshot = await bebidasCollection.get();
      const bebidas_disp = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ bebidas_disp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/bebidas/:id", async (req, res) => {
    try {
      const docSnap = await bebidasCollection.doc(req.params.id).get();
      if (!docSnap.exists) return res.status(404).json({ error: "Bebida não encontrada" });
      res.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // =================== COMBOS ===================
  router.get("/combos", async (req, res) => {
    try {
      const snapshot = await combosCollection.get();
      const combos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ combos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/combos/:id", async (req, res) => {
    try {
      const docSnap = await combosCollection.doc(req.params.id).get();
      if (!docSnap.exists) return res.status(404).json({ error: "Combo não encontrado" });
      res.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = routes;
