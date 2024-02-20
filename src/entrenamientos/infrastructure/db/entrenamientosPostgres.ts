import executeQuery from "../../../context/pgConnection";
import Entrenamiento from "../../domain/entrenamiento";
import EntrenamientoRepository from "../../domain/entrenamientoRepository";
import Segmento from "../../domain/segmento";

export default class EntrenamientoRepositoryPostgres implements EntrenamientoRepository{


    async insertarSegmentoEnEntrenamiento(idEntrenamiento: number, idSegmento: number, tiempo: number): Promise<any> {
        const consulta = `INSERT INTO entrenamientos_segmentos(
            entrenamiento, segmento, tiempo)
            VALUES (${idEntrenamiento}, ${idSegmento}, ${tiempo});`

        await executeQuery(consulta);   
    }


    async isFollowing(aliasUsuarioLoggeado: string, aliasUsuarioSeguido: string): Promise<boolean> {
        
        const consulta = 
        `SELECT usuario, seguido
        FROM seguidos
        where usuario='${aliasUsuarioLoggeado}' AND seguido='${aliasUsuarioSeguido}'`

        const seguimientoDB: any[] = await executeQuery(consulta);

        if(seguimientoDB.length!== 0){
            return true;
        }else{
            return false;
        }

    }

    async getSegmentosPagina(numPagina: number): Promise<Segmento[]> {
        
        const segmentosDisponibles: Segmento[] = []

        const consulta = `SELECT *
        FROM segmentos
        order by id
        limit 25 offset ${numPagina} * 10`

        const segmentosDB: any[] = await executeQuery(consulta);

        for(const item of segmentosDB){

            const segmento: Segmento = {
                id:item.id,
                nombre: item.nombre,
                distancia: item.distancia
            }

            segmentosDisponibles.push(segmento)
        }

        return segmentosDisponibles;
        
    }


    async getEntrenamientosUsuario(aliasUsuario: string): Promise<Entrenamiento[]> {
        
        const entrenamientos : Entrenamiento[] = []
        const segmentos: Segmento[] = [];

        const consulta = `SELECT 
        entrenamientos.id as entrenamiento_id,
        entrenamientos.usuario as alias,
        entrenamientos.tipo,
        segmentos.id as segmento_id,
        segmentos.nombre,
        segmentos.distancia,
        entrenamientos_segmentos.tiempo as tiempo
        from entrenamientos
        join entrenamientos_segmentos
        on entrenamientos.id=entrenamientos_segmentos.entrenamiento
        join segmentos
        on segmentos.id=entrenamientos_segmentos.segmento
        where entrenamientos.usuario='${aliasUsuario}'`

        const entrenamientosDB: any[] = await executeQuery(consulta);

        for(const item of entrenamientosDB){

            const segmento: any = {
                id:item.segmento_id,
            }

            const segmentoCompleto: any = {
                segmento: segmento,
                tiempo: item.tiempo
            }

            segmentos.push(segmentoCompleto)
        }

        for(const item of entrenamientosDB){

            const entrenamiento: Entrenamiento = {
                id: item.entrenamiento_id,
                usuario: item.alias,
                tipo: item.tipo,
                segmentos: segmentos,
                distancia: await this.getDistancia(item.entrenamiento_id),
                tiempo: await this.getTiempo(item.entrenamiento_id)

            }
            
            entrenamientos.push(entrenamiento)
        }

        return entrenamientos

    }


    async guardarEntrenamiento(entrenamiento: Entrenamiento, aliasUsuario: string, segmentos: any[]): Promise<any> {
        
        const consulta=`INSERT INTO entrenamientos(
            fechahora, usuario, tipo)
            VALUES (now(),'${aliasUsuario}','${entrenamiento.tipo}') returning *;`

        const entrenamientoDB: any[] = await executeQuery(consulta);

        const entrenamiento_id = entrenamientoDB[0].id;

        for(const item of segmentos){
            this.insertarSegmentoEnEntrenamiento(entrenamiento_id,item.segmento.id,item.tiempo)
        }
        
        return this.getEntrenamientobyID(aliasUsuario,entrenamiento_id)

    }

    async getDistancia(idEntrenamiento: number): Promise<number> {
        
        const consulta = `SELECT SUM(distancia) as total
        from segmentos
        where id in(
        select segmento
        from entrenamientos_segmentos
        where entrenamiento=${idEntrenamiento})`

        const distanciaBD: any[] = await executeQuery(consulta);

        const distancia = distanciaBD[0]

        return distancia;

    }

    async getTiempo(idEntrenamiento: number): Promise<any> {
        
        const consulta = `SELECT SUM(tiempo) as total
        from entrenamientos_segmentos
        where entrenamiento=${idEntrenamiento}`

        const tiempoDB: any[] = await executeQuery(consulta);

        const tiempo = tiempoDB[0]

        return tiempo;

    }

    getNumeroEntrenamientos(aliasUsuario: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getEntrenamientobyID(aliasUsuario:string, idEntrenamiento:number): Promise<Entrenamiento>{
       
        let entrenamiento: Entrenamiento = {
            id:undefined,
            usuario: "",
            tipo:"",
            segmentos: [],
            distancia:0,
            tiempo: 0
        }

        const segmentos: Segmento[] = [];

        const consulta = `SELECT 
        entrenamientos.id as entrenamiento_id,
        entrenamientos.usuario as alias,
        entrenamientos.tipo,
        segmentos.id as segmento_id,
        segmentos.nombre,
        segmentos.distancia,
        entrenamientos_segmentos.tiempo as tiempo
        from entrenamientos
        join entrenamientos_segmentos
        on entrenamientos.id=entrenamientos_segmentos.entrenamiento
        join segmentos
        on segmentos.id=entrenamientos_segmentos.segmento
        where entrenamientos.usuario='${aliasUsuario} and entrenamientos.id=${idEntrenamiento}'`

        const entrenamientosDB: any[] = await executeQuery(consulta);

        for(const item of entrenamientosDB){

            const segmento: any = {
                id:item.segmento_id,
            }

            const segmentoCompleto: any = {
                segmento: segmento,
                tiempo: item.tiempo
            }

            segmentos.push(segmentoCompleto)
        }

        for(const item of entrenamientosDB){

            const entrenamientoDB: Entrenamiento = {
                id: item.entrenamiento_id,
                usuario: item.alias,
                tipo: item.tipo,
                segmentos: segmentos,
                distancia: await this.getDistancia(item.entrenamiento_id),
                tiempo: await this.getTiempo(item.entrenamiento_id)

            }

            entrenamiento=entrenamientoDB
        }

        return entrenamiento
    }

}