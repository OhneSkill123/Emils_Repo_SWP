const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });

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
        include: { _count: { select: { MTiere: true } } },
    });

    return abteilungen.map((abteilung) => ({
        abteilungId: abteilung.id,
        abteilungName: abteilung.Name,
        animalCount: abteilung.MTiere.length,
    }));
}

async function getMitarbeiterInZoo(zooId) {
    return await prisma.mitarbeiter.findMany({
        where: { Abteilungen: { some: { ZooId: zooId } } },
        include: { Abteilungen: true },
    });
}

async function main() {
    console.log(JSON.stringify(await getAllZoos(), null, 2));

    randomZoo = await getRandomZoo();
    console.log('Random Zoo:', randomZoo);
    getAbteilungenForZoo(randomZoo.id).then((o) =>
        console.log(JSON.stringify(o, null, 2))
    );
    getAbteilungenAndTiereCountForZoo(randomZoo.id).then((o) =>
        console.log(JSON.stringify(o, null, 2))
    );
    getMitarbeiterInZoo(randomZoo.id).then((o) =>
        console.log(JSON.stringify(o, null, 2))
    );
}

main().then(() => prisma.$disconnect());
