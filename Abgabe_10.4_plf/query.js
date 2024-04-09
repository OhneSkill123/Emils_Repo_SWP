const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

async function getAllZoos() {
  return await prisma.zoo.findMany();
}

async function getRandomZoo() {
  const zoos = await getAllZoos();
  return zoos[Math.floor(Math.random() * zoos.length)];
}

async function getAbteilungenForZoo(zooId) {
  return await prisma.Abteilung.findMany({ where: { ZooId: zooId } });
}

async function getAbteilungenAndTiereCountForZoo(zooId) {
  const abteilungen = await prisma.Abteilung.findMany({ 
    where: { ZooId: zooId },
    include: { MTiere: true }
  });

  return abteilungen.map(abteilung => ({
    abteilungId: abteilung.cuid,
    abteilungName: abteilung.Name,
    animalCount: abteilung.MTiere.length,
  }));
}

async function getMitarbeiterInZoo(zooId) {
  return await prisma.mitarbeiter.findMany({
    where: { Abteilungen: { some: { ZooId: zooId } } },
    include: { Abteilungen: true }
  });
}


getAllZoos().then(console.log);

getRandomZoo().then(randomZoo => {
  console.log('Random Zoo:', randomZoo);
  getAbteilungenForZoo(randomZoo.cuid).then(console.log);
  getAbteilungenAndTiereCountForZoo(randomZoo.cuid).then(console.log);
    getMitarbeiterInZoo(randomZoo.cuid).then(console.log);
});