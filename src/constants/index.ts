export interface Student {
  nome: string;
  instituicao: string;
  curso: string;
  cpf: string;
  nascimento: string;
  validade: string;
  codigoCie: string;
  foto: string;
}

export const DATABASE: Record<string, Student> = {
  luccas: {
    nome: "Luccas Salvagni Queiroz Santos",
    instituicao: "Faculdade De Informatica e Administracao",
    curso: "Ciência da Computação",
    cpf: "05369802254",
    nascimento: "03/11/2000",
    validade: "31/03/2026",
    codigoCie: "09ZB5S",
    foto: "https://media.discordapp.net/attachments/1018609889985187911/1441860148632092884/99a243e6-2fdb-4741-a7bc-e5e89f2b5a4b.JPG?ex=69235467&is=692202e7&hm=4979bb6cfa4eb01a8f1af76f4b84fa6b0e3300d7b8d0e60012a804abf4453c4b&=&format=webp&width=733&height=977",
  },
  joao: {
    nome: "João Pedro Militão da Silva",
    instituicao: "Mackenzie",
    curso: "Direito",
    cpf: "39456076806",
    nascimento: "12/10/2002",
    validade: "31/04/2026",
    codigoCie: "10XC8T",
    foto: "https://media.discordapp.net/attachments/1018609889985187911/1441860148632092884/99a243e6-2fdb-4741-a7bc-e5e89f2b5a4b.JPG?ex=69235467&is=692202e7&hm=4979bb6cfa4eb01a8f1af76f4b84fa6b0e3300d7b8d0e60012a804abf4453c4b&=&format=webp&width=733&height=977",
  },
  herbert: {
    nome: "Herbert Lazzaroto Meister",
    instituicao: "Unesc",
    curso: "Comercio Exterior",
    cpf: "06798821979",
    nascimento: "07/02/2002",
    validade: "31/03/2026",
    codigoCie: "11YC9U",
    foto: "/hebert.jpeg",
  },
  richard: {
    nome: "Richard Lazzaroto Meister",
    instituicao: "Unesc",
    curso: "Direito",
    cpf: "11516864921",
    nascimento: "24/09/2007",
    validade: "31/03/2026",
    codigoCie: "12AB3C",
    foto: "/richards.jpeg",
  },
  andrea: {
    nome: "Andrea Liciane Ribeiro dos Reis",
    instituicao: "OAB / ESA – Escola Superior de Advocacia",
    curso: "Direito – Advocacia e Prerrogativas",
    cpf: "558.987.939-68",
    nascimento: "03/03/1966",
    validade: "31/04/2026",
    codigoCie: "10XC8T",
    foto: "https://cdn.discordapp.com/attachments/1018609889985187911/1447062766606090473/image0.jpg?ex=693641b8&is=6934f038&hm=1f6d7b8321563d0eb10471737552a6f8fb0ce83d8c8508a949d13d9e5bcb4c65&",
  },
  leo: {
    nome: "Leo Ibsch Linhares",
    instituicao: "Mackenzie",
    curso: "Direito",
    cpf: "39456076806",
    nascimento: "12/10/2002",
    validade: "31/04/2026",
    codigoCie: "10XC8T",
    foto: "https://cdn.discordapp.com/attachments/1018609889985187911/1455711688358629466/59c47756-afe8-4d22-865b-d5b4feecb172.jpg?ex=6955b8a8&is=69546728&hm=c1585e1184ad8fc5c16e2db25e09e5db8dffde963ad528c0da2c757ae8cab7d2&",
  },
};

export const STUDENT_IDS = Object.keys(DATABASE);
