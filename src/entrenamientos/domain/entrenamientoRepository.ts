import Entrenamiento from "./entrenamiento";
import Segmento from "./segmento";

export default interface EntrenamientoRepository{

    getSegmentosPagina(numPagina:number):Promise<Segmento[]>;
    getEntrenamientosUsuario(aliasUsuario:string):Promise<Entrenamiento[]>;
    guardarEntrenamiento(entrenamiento:Entrenamiento, aliasUsuario: string, segmentos: any[]): Promise<any>;
    getDistancia(idEntrenamiento:number):Promise<number>,
    getTiempo(idEntrenamiento:number):Promise<any>,
    getNumeroEntrenamientos(aliasUsuario:string):Promise<any>
    isFollowing(aliasUsuarioLoggeado: string, aliasUsuarioSeguido: string): Promise<boolean>;
    insertarSegmentoEnEntrenamiento(idEntrenamiento:number, idSegmento:number, tiempo:number): Promise<any>;
}