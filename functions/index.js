/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// Firebase Functions v2
// Firebase Functions v2
const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Express
const express = require("express");
const cors = require("cors");

// Firestore (Admin SDK)
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// Inicializa o Admin
admin.initializeApp();

// Firestore DB
const db = getFirestore();

// Configurações globais (controle de custo)
setGlobalOptions({ maxInstances: 10 });

// Cria o servidor Express
const app = express();
//app.use(cors());
app.use(cors({ origin: true }));
app.use(express.json());

// Importa as suas rotas e passa o Firestore
const createRoutes = require("./routes.js");
app.use("/", createRoutes(db));

// Rota teste (opcional)
app.get("/test", (req, res) => {
  res.json({ ok: true, msg: "Express + Firebase Functions v2 OK!" });
});

// Exporta como Cloud Function
exports.api = onRequest(app);
