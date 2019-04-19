const {
    deepEqual,
    ok
} = require("assert");

const { obterPessoas } = require("./services")
const database = require("./database")
const randomId = require('random-id')

const len = 2
const pattern = "aAO"

const DEFAULT_ITEM_CADASTRAR = {
    nome: "Flash",
    poder: "Speed",
    "id": 1
}

const DEFAULT_ITEM_ATUALIZAR = {
    nome: "Lanterna Verde",
    poder: "Energia do Anel",
    "id": 2
}


// Instalar o pacote nock, para simular requisições
const nock = require("nock");

//Buscando dados da API externa
describe("Start Wars Tests", function () {
    this.beforeAll(() => {
        const response = {
            count: 1,
            next: null,
            previous: null,
            results: [
                {
                    name: "R2-D2",
                    height: "96",
                    mass: "32",
                    hair_color: "n/a",
                    skin_color: "white, blue",
                    eye_color: "red",
                    birth_year: "33BBY",
                    gender: "n/a",
                    homeworld: "https://swapi.co/api/planets/8/",
                    vehicles: [],
                    starships: [],
                    created: "2014-12-10T15:11:50.376000Z",
                    edited: "2014-12-20T21:17:50.311000Z",
                    url: "https://swapi.co/api/people/3/"
                }
            ]
        };

        nock('https://swapi.co/api/people')
        .get('/?search=r2-d2&format=json')
        .reply(200,response)

    });

    it("deve buscar o r2d2 com o formato correto", async () => {
        const expected = [
            {
                nome: "R2-D2",
                peso: "96"
            }
        ];

        const nomeBase = `r2-d2`;
        const resultado = await obterPessoas(nomeBase);

        deepEqual(resultado, expected);
    });
});

//Trabalhando com arquivos
describe("Suite de manipulação de Herois", () => {
    before(async () => {
       await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
       await database.cadastrar(DEFAULT_ITEM_ATUALIZAR)
    })

    it("deve pesquisar um heroi, usando arquivos", async () => {
        const expected = DEFAULT_ITEM_CADASTRAR
        const [resultado] = await database.listar(expected.id)
        deepEqual(resultado, expected)
    })

    it("deve cadastrar um heroi, usando arquivos", async () => {
        const expected  = DEFAULT_ITEM_CADASTRAR
        const resultado = await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
        const [actual] = await database.listar(DEFAULT_ITEM_CADASTRAR.id)
        deepEqual(actual, expected)
    })

    it("deve remover um heroi por id", async () =>{
        const expected = true;
        const resultado = await database.remover(DEFAULT_ITEM_CADASTRAR.id)
        deepEqual(resultado,expected)
    })

    it("deve atualizar o usuãrio pelo id", async () =>{
        const expected = {
            ...DEFAULT_ITEM_ATUALIZAR,
            nome:"Batman",
            poder:"Dinheiro"
        }
        const novoDado = {
            nome:"Batman",
            poder:"Dinheiro"
        }
        
        await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id,novoDado)
        const [resultado] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id)
        deepEqual(resultado,expected)

    })
})
