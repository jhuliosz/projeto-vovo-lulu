const express = require("express");

function routes(db) {
    const router = express.Router();
    const produtosCollection = db.collection("produtos");
    const disponiveisCollection = db.collection("disponiveis");
    const combosCollection = db.collection("combos");


    async function getDisp() {
        try {
            const snapshot = await disponiveisCollection.get();
            const prod_disp = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return { prod_disp };
        } catch (error) {
            return { error: error.message };
        }
    }
    router.get("/disponiveis", async (req, res) => {
        try {
            const data = await getDisp();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    //Metodo GET: Retorna os dados do produto correspondente ao id
    router.get("/produto/:id", async (req, res) => {
        try {
            const doc = await produtosCollection.doc(req.params.id).get();
            if (!doc.exists) return res.status(404).json({ error: "Produto não encontrado" });
            res.json({ id: doc.id, ...doc.data() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    //Metodo GET: Retorna todos os produtos
    router.get("/produto", async (req, res) => {
        try {
            const snapshot = await produtosCollection.get();
            const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.json({ produtos });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    /*router.get("/disponiveis", async (req, res) => {
        try {
            const snapshot = await disponiveisCollection.get();
            const prod_disp = snapshot.docs.map(doc => ({ id: doc.id, prod_id: doc.prod_id }));
            res.json({ prod_disp });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });*/
    router.get("/combos", async (req, res) => {
        try {
            const snapshot = await combosCollection.get();
            const combos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            res.json({ combos });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    router.get("/combos/:id", async (req, res) => {
        try {
            const combo = combosCollection.doc(req.params.id).get();
            if (!combo.exists)
                return res.status(404).json({ error: "Produto não encontrado" });

            res.json({ id: combo.id, ...combo.data() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })

    return router;
}
module.exports = routes;