const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const serviceAccount = require("../sitevovolulu-firebase-adminsdk.json");
const routes = require("./routes");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes(db));

const PORT = process.env.PORT || 4200 ;
app.listen(PORT, () => console.log(`Escutando o servidor na porta ${PORT}`));