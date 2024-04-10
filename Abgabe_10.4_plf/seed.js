const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

class FakeZoo {
    constructor() {
        this.Land = faker.location.country();
        this.Stadt = faker.location.city();
        this.Adresse = faker.location.streetAddress();
        this.baujahr = faker.date.past();
    }
}

class FakeAbteilung {
    constructor(zooid) {
        this.Name = faker.animal.type();
        this.ZooId = zooid;
    }
}

class FakeTier {
    constructor(_abteilungsId) {
        this.Art = faker.animal.type();
        this.Name = faker.person.firstName();
        this.AbteilungsId = _abteilungsId;
    }
}

class FakeMitarbeiter {
    constructor() {
        this.name = faker.person.fullName();
    }
}

async function main() {
    for (let i = 0; i < 5; i++) {
        const _fakeZoo = new FakeZoo();
        const Zoo = await prisma.Zoo.create({ data: _fakeZoo });
    }

    const ZooIds = (await prisma.Zoo.findMany({ select: { id: true } })).map(
        (_) => _.id
    );
    const zooAbteilungen = {};

    for (let zooId of ZooIds) {
        const abteilungenCount = faker.number.int({ min: 2, max: 7 });
        zooAbteilungen[zooId] = new Set();

        for (let i = 0; i < abteilungenCount; i++) {
            let abteilungName;
            do {
                abteilungName = faker.animal.type();
            } while (zooAbteilungen[zooId].has(abteilungName));

            zooAbteilungen[zooId].add(abteilungName);

            const _fakeAbteilung = new FakeAbteilung(zooId);
            _fakeAbteilung.Name = abteilungName;

            const Abteilung = await prisma.Abteilung.create({
                data: _fakeAbteilung,
            });
        }
    }

    const AbteilungsIds = (
        await prisma.Abteilung.findMany({ select: { id: true } })
    ).map((_) => _.id);
    console.log(...AbteilungsIds);
    for (let j = 0; j < AbteilungsIds.length - 1; j++) {
        for (let i = 0; i < faker.number.int({ min: 5, max: 20 }); i++) {
            const _fakeTier = new FakeTier(AbteilungsIds[j]);
            const Tier = await prisma.Tier.create({ data: { ..._fakeTier } });
        }
    }

    for (let i = 0; i < 100; i++) {
        const _fakeMitarbeiter = new FakeMitarbeiter();
        const Mitarbeiter = await prisma.mitarbeiter.create({
            data: { ..._fakeMitarbeiter },
        });
    }
    const MitarbeiterIds = (
        await prisma.mitarbeiter.findMany({ select: { id: true } })
    ).map((_) => _.id);

    for (let mitarbeiterId of MitarbeiterIds) {
        const abteilungenCount = faker.number.int({ min: 1, max: 4 });

        for (let i = 0; i < abteilungenCount; i++) {
            const abteilungId =
                AbteilungsIds[
                    faker.number.int({ min: 0, max: AbteilungsIds.length - 1 })
                ];

            await prisma.mitarbeiter.update({
                where: { id: mitarbeiterId },
                data: {
                    Abteilungen: {
                        connect: { id: abteilungId },
                    },
                },
            });
        }
    }
}

main();
