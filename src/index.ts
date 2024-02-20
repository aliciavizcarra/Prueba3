import dotenv from "dotenv";
import express from "express";
import { routerUsuarios } from "./usuarios/infrastructure/rest/usuarioRouter";
import { routerEntrenamientos } from "./entrenamientos/infrastructure/rest/entrenamientoRouter";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/usuarios", routerUsuarios)
app.use("/api/", routerEntrenamientos)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});