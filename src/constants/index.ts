export type Student = {
  nome: string;
  instituicao: string;
  curso: string;
  nivel: string;
  rg: string;
  cpf: string;
  nascimento: string;
  validade: string;
  codigoCie: string;
  foto: string;
  qrcode: string;
};

export const DATABASE: Record<string, Student> = {
  luccas: {
    nome: "Luccas Salvagni Queiroz Santos",
    instituicao: "Faculdade De Informatica e Adminstracao",
    curso: "Ciência da Computação",
    nivel: "SUPERIOR",
    rg: "159124908",
    cpf: "05369802254",
    nascimento: "03/11/2000",
    validade: "31/03/2026",
    codigoCie: "09ZB5S",
    foto: "https://cdn.discordapp.com/attachments/1018609889985187911/1455663723661492279/image.png?ex=69558bfc&is=69543a7c&hm=8a936233d1f794f6947577f0aba3ebf5ca72bdeaa2c6bdcfb9c495c788565bb6&",
    qrcode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LuccasCIE",
  },
  joao: {
    nome: "João Pedro Militão da Silva",
    instituicao: "Mackenzie",
    curso: "Direito",
    nivel: "SUPERIOR",
    rg: "398004705",
    cpf: "39456076806",
    nascimento: "12/10/2002",
    validade: "31/04/2026",
    codigoCie: "10XC8T",
    foto: "https://media.discordapp.net/attachments/1018609889985187911/1441860148632092884/99a243e6-2fdb-4741-a7bc-e5e89f2b5a4b.JPG?ex=69235467&is=692202e7&hm=4979bb6cfa4eb01a8f1af76f4b84fa6b0e33[...",
    qrcode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JoaoCIE",
  },
  andrea: {
    nome: "Andrea Liciane Ribeiro dos Reis",
    instituicao: "OAB / ESA – Escola Superior de Advocacia",
    curso: "Direito – Advocacia e Prerrogativas",
    nivel: "SUPERIOR",
    rg: "3.692.834-4",
    cpf: "558.987.939-68",
    nascimento: "03/03/1966",
    validade: "31/04/2026",
    codigoCie: "10XC8T",
    foto: "https://cdn.discordapp.com/attachments/1018609889985187911/1447062766606090473/image0.jpg?ex=693641b8&is=6934f038&hm=1f6d7b8321563d0eb10471737552a6f8fb0ce83d8c8508a949d13d9e5bcb4c65&",
    qrcode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AndreaCIE",
  },
joao: {
    nome: "Leo Ibsch Linhares",
    instituicao: "Mackenzie",
    curso: "Direito",
    nivel: "SUPERIOR",
    rg: "398004705",
    cpf: "39456076806",
    nascimento: "12/10/2002",
    validade: "31/04/2026",
    codigoCie: "10XC8T",
    foto: "https://cdn.discordapp.com/attachments/1018609889985187911/1455711688358629466/59c47756-afe8-4d22-865b-d5b4feecb172.jpg?ex=6955b8a8&is=69546728&hm=c1585e1184ad8fc5c16e2db25e09e5db8dffde963ad528c0da2c757ea8cab7d2&",
    qrcode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JoaoCIE",
  },
};

export const STUDENT_IDS = Object.keys(DATABASE);