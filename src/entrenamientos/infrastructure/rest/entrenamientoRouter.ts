import express from "express";
import EntrenamientoUseCases from "../../application/entrenamientosUseCases";
import EntrenamientoRepositoryPostgres from "../db/entrenamientosPostgres";
import { isAuth } from "../../../context/security/auth";

const entrenamientosUseCases: EntrenamientoUseCases = new EntrenamientoUseCases(new EntrenamientoRepositoryPostgres);

const router = express.Router();

router.get("/segmentos/:numPagina", async(req,res)=>{

    try{

        const numPagina = parseInt(req.params.numPagina)
        const segmentosDisponibles = await entrenamientosUseCases.getSegmentosPagina(numPagina);
        res.json(segmentosDisponibles);

    }catch(error){

        console.error(error);
        res.status(500).send(error);

    }  
})

router.get("/entrenamientos", isAuth, async(req,res)=>{

    try{

        const aliasUsuario = req.body.userAlias;
        const entrenamientos = await entrenamientosUseCases.getEntrenamientosUsuario(aliasUsuario);
        res.json(entrenamientos)

    }catch(error){

        console.error(error);
        res.status(500).send(error);

    }  
})

router.get("/entrenamientos/:aliasSeguido", isAuth, async(req,res)=>{

    try{

        const aliasUsuario = req.body.userAlias;
        const aliasSeguido = req.params.aliasSeguido;
        const siguiendo = await entrenamientosUseCases.isFollowing(aliasUsuario,aliasSeguido);


        if(siguiendo){
            const entrenamientos = await entrenamientosUseCases.getEntrenamientosUsuario(aliasSeguido);
            res.json(entrenamientos)
        }else{
            res.json("No has seguido a este usuario para ver sus entrenamientos")
        }
    }catch(error){

        console.error(error);
        res.status(500).send(error);
    }  
})

router.post("/entrenamientos", isAuth, async(req,res)=>{
    
    try{
        const entrenamiento = req.body;
        const aliasUsuario = req.body.userAlias;
        const segmentos: any[] = req.body.segmentos;

        const entrenamientoIntroducido = await entrenamientosUseCases.guardarEntrenamiento(entrenamiento,aliasUsuario,segmentos)

        res.json(entrenamientoIntroducido)

    }catch(error){
        console.error(error);
        res.status(500).send(error);
    }  


})

export {router as routerEntrenamientos}