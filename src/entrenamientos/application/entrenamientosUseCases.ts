import Entrenamiento from "../domain/entrenamiento";
import EntrenamientoRepository from "../domain/entrenamientoRepository";
import Segmento from "../domain/segmento";

export default class EntrenamientoUseCases {

    constructor(private entrenamientoRepository: EntrenamientoRepository){};

    async getSegmentosPagina(numPagina:number):Promise<Segmento[]>{
        return this.entrenamientoRepository.getSegmentosPagina(numPagina);
    }

    async getEntrenamientosUsuario(aliasUsuario:string):Promise<Entrenamiento[]>{
        return this.entrenamientoRepository.getEntrenamientosUsuario(aliasUsuario);
    }

    async guardarEntrenamiento(entrenamiento:Entrenamiento, aliasUsuario: string, segmentos: any[]): Promise<any>{
        return this.entrenamientoRepository.guardarEntrenamiento(entrenamiento, aliasUsuario,segmentos);
    }

    async getDistancia(idEntrenamiento:number):Promise<number>{
        return this.entrenamientoRepository.getDistancia(idEntrenamiento);
    }

    async getTiempo(idEntrenamiento:number):Promise<any>{
        return this.entrenamientoRepository.getTiempo(idEntrenamiento);
    }

    async getNumeroEntrenamientos(aliasUsuario:string):Promise<any>{
        return this.entrenamientoRepository.getNumeroEntrenamientos(aliasUsuario);
    }

    async isFollowing(aliasUsuarioLoggeado: string, aliasUsuarioSeguido: string): Promise<boolean>{
        return this.entrenamientoRepository.isFollowing(aliasUsuarioLoggeado,aliasUsuarioSeguido);
    }

    async insertarSegmentoEnEntrenamiento(idEntrenamiento:number, idSegmento:number, tiempo:number): Promise<any>{
        return this.entrenamientoRepository.insertarSegmentoEnEntrenamiento(idEntrenamiento,idSegmento,tiempo);
    }


}