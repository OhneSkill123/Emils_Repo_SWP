const express = require('express');
const app = express();
const port = 3000;
const host = '0.0.0.0';
const prisma = require('./lib/db');
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use('/', express.static('static'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.render('index', { zoos: await prisma.zoo.findMany() });
});

app.post('/zoo/:zooId/abteilungen/:abteilungId/tiere/:id', async (req, res) => {
    const animalId = req.params.id;
    const newName = req.body.newName;
    const isDead = req.body.isDead === 'true';

    if (isDead) {
        await prisma.tier.delete({
            where: { id: animalId },
        });
    } else {
        await prisma.tier.update({
            where: { id: animalId },
            data: { name: newName },
        });
    }

    res.redirect('/');
});

app.get('/zoo/:id', async (req, res) => {
    const id = req.params.id;
    const zoo = await prisma.zoo.findUnique({
        where: { id: id },
        include: {
            abteilungen: {
                include: {
                    tiere: true,
                    mitarbeiter: true
                }
            }
        }
    });
    return res.render('details', { zoo: zoo });
});




app.post('/animals/:id', async (req, res) => {
    const animalId = req.params.id;
    const newName = req.body.newName;
    await prisma.tier.update({
        where: { id: animalId },
        data: { name: newName },
    });
    res.redirect('/');
});

app.get('/zoo/:id/abteilungen/:abteilungId/tiere', async (req, res) => {
    const abteilungId = req.params.abteilungId;
    const tiere = await prisma.tier.findMany({
        where: { abteilungId: abteilungId },
    });
    const mitarbeiter = await prisma.mitarbeiter.findMany({
        where: { abteilungen: { some: { id: abteilungId } } }
    });
    return res.render('animals', { animals: tiere, employees: mitarbeiter });
});

app.get('/zoo/:id/abteilungen/:abteilungId/mitarbeiter', async (req, res) => {
    const abteilungId = req.params.abteilungId;
    const mitarbeiter = await prisma.mitarbeiter.findMany({
        where: { abteilungen: { some: { id: abteilungId } } }
    });

    // Fetch the departments for each employee separately
    for (let employee of mitarbeiter) {
        employee.abteilungen = await prisma.abteilung.findMany({
            where: { mitarbeiter: { some: { id: employee.id } } }
        });
    }

    return res.render('employees', { employees: mitarbeiter });
});

app.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});