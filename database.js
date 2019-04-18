const {
    readFile,
    writeFile
} = require("fs")

const {
    promisify
} = require("util")

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

class database {
    constructor(){
        this.NOME_ARQUIVO = "herois.json"
    }

    async obterDadosArquivo(){
        const arquivo  = await  readFileAsync(this.NOME_ARQUIVO,"utf8")
        if(arquivo == "") return JSON.parse("[]")     
        return JSON.parse(arquivo.toString())
    }

    async escreverArquivo(dados){
        await  writeFileAsync(this.NOME_ARQUIVO,JSON.stringify(dados))
        return true;
    }

    async cadastrar(heroi){
        const dados = await this.obterDadosArquivo() 
        
        if(dados.length === 0){
            const newData = [
                heroi
            ];
            let resultado = await this.escreverArquivo(newData)
            return resultado
        }

       const id = dados.filter(item => item.id === heroi.id)

        const heroiComId = {
            id,
            ...heroi
        }

        const dadosFinal = [
            ...dados,
            heroiComId
        ]
        const resultado = await this.escreverArquivo(dadosFinal)
        return resultado
    }

    async listar(id){
        const dados  = await this.obterDadosArquivo()
        const dadosFiltrados = dados.filter(item => (id ? (item.id === id) : true))
        return dadosFiltrados
    }
}

module.exports = new database()