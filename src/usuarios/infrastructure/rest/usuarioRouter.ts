import express from "express";
import UsuarioUseCases from "../../application/usuarioUseCases";
import UsuarioReositoryPostgress from "../db/usuarioPostgres";
import Usuario from "../../domain/usuario";
import { createToken, isAuth } from "../../../context/security/auth";

const usuarioUseCases: UsuarioUseCases = new UsuarioUseCases(new UsuarioReositoryPostgress);

const router = express.Router();

router.post("/registro", async (req,res)=>{

    const usuarioIntroducido = req.body;
    const usuarioNuevo: Usuario = {
        alias:usuarioIntroducido.alias,
        password: usuarioIntroducido.password,
    }

    const usuario: Usuario = await usuarioUseCases.registro(usuarioNuevo);
    res.json("alias: " + usuario.alias);
})

router.post("/login", async (req,res)=>{

    const usuarioAPI = req.body;

    const usuarioLoggeado: Usuario = await usuarioUseCases.login(usuarioAPI);
    if(usuarioLoggeado === null)
        res.status(404).json({mensaje : "Usuario no encontrado"});
    const token = createToken(usuarioLoggeado);
    const usuario={
        alias:usuarioLoggeado.alias
    }
    res.json({usuario, token});
})


export {router as routerUsuarios};