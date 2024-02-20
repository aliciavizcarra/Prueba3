import executeQuery from "../../../context/pgConnection";
import Usuario from "../../domain/usuario";
import UsuarioRepository from "../../domain/usuarioRepository";

export default class UsuarioRepositoryPostgress implements UsuarioRepository{

    getPerfil(aliasUsuario: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    async registro(usuario: Usuario): Promise<Usuario> {
        
        const consulta = `INSERT INTO usuarios(
        alias, password)
        VALUES ('${usuario.alias}', '${usuario.password}') returning *`;
        const rows: any[] = await executeQuery(consulta);

        const usuarioBD: Usuario = {
            alias: rows[0].alias,
            password: rows[0].password,
        }

        return usuarioBD;

    }

    async login(usuario: Usuario): Promise<Usuario> {

        const consulta = `select * from usuarios where alias = '${usuario.alias}'`;
        const rows: any[] = await executeQuery(consulta);
        if(rows.length === 0){
            throw new Error("Usuario/contraseña no es correcto");
        }else{
            const usuarioBD: Usuario = {
                alias: rows[0].alias,
                password:rows[0].password,
            }

            return usuarioBD;
        }
        
    }

}