/*const { initializeApp } = require("firebase/app");

const express = require("express");
const cors = require("cors");
//const admin = require("firebase-admin");

//const serviceAccount = require("../sitevovolulu-firebase-adminsdk-fbsvc-74a136ab2d.json");
const { getFirestore} = require("firebase/firestore");
const routes = require("./routes");

const firebaseConfig = {
  apiKey: "AIzaSyBNK1B763vxkabhEls5CjeAcmYXi95Q02A",
  authDomain: "sitevovolulu.firebaseapp.com",
  projectId: "sitevovolulu",
  storageBucket: "sitevovolulu.firebasestorage.app",
  messagingSenderId: "983701059293",
  appId: "1:983701059293:web:e10e49413183f585358d34"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const app = express();

app.use(express());
app.use(cors());
app.use(express.json());

app.use("/api", routes(db));

const PORT = process.env.PORT || 4200 ;
app.listen(PORT, () => console.log(`Escutando o servidor na porta ${PORT}`));*/