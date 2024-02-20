import Usuario from "./usuario";

export default interface UsuarioRepository{
    registro(usuario:Usuario): Promise<Usuario>;
    login(usuario:Usuario): Promise<Usuario>;
    getPerfil(aliasUsuario: string): Promise<any>;
}