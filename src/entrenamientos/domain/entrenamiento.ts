import Segmento from "./segmento";

export default interface Entrenamiento{
    id?: number,
    tipo: string,
    usuario: string,
    segmentos:Segmento[],
    distancia: number,
    tiempo:number
}