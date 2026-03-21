import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Shiva Parivar...');

  // 1. Shiva
  let shiva = await prisma.person.findFirst({ where: { name: 'Shiva', type: 'GOD' } });
  if (!shiva) {
    shiva = await prisma.person.create({
      data: {
        name: 'Shiva',
        type: 'GOD',
        gender: 'MALE',
        description: 'The Supreme Deity, Destroyer and Transformer of the Trimurti.',
      }
    });
    console.log('Created Shiva');
  }

  // 2. Parvati
  let parvati = await prisma.person.findFirst({ where: { name: 'Parvati', type: 'GOD' } });
  if (!parvati) {
    parvati = await prisma.person.create({
      data: {
        name: 'Parvati',
        type: 'GOD',
        gender: 'FEMALE',
        description: 'Goddess of Fertility, Love, and Devotion. The divine feminine Shakti.',
      }
    });
    console.log('Created Parvati');
  }

  // 3. Consort: Shiva ↔ Parvati
  const consortExists = await prisma.relationship.findUnique({
    where: { subjectId_objectId_type: { subjectId: shiva.id, objectId: parvati.id, type: 'SPOUSE_OF' } }
  });
  if (!consortExists) {
    await prisma.relationship.create({
      data: { subjectId: shiva.id, objectId: parvati.id, type: 'SPOUSE_OF', label: 'Consort', isBiological: true }
    });
    console.log('Created Shiva ↔ Parvati consort');
  }

  // 4. Ganesha
  let ganesha = await prisma.person.findFirst({ where: { name: 'Ganesha', type: 'GOD' } });
  if (!ganesha) {
    ganesha = await prisma.person.create({
      data: {
        name: 'Ganesha',
        type: 'GOD',
        gender: 'MALE',
        description: 'The Remover of Obstacles, God of Beginnings and Wisdom.',
      }
    });
    console.log('Created Ganesha');
  }

  // 5. Kartikeya
  let kartikeya = await prisma.person.findFirst({ where: { name: 'Kartikeya', type: 'GOD' } });
  if (!kartikeya) {
    kartikeya = await prisma.person.create({
      data: {
        name: 'Kartikeya',
        type: 'GOD',
        gender: 'MALE',
        description: 'God of War, also known as Skanda or Murugan.',
      }
    });
    console.log('Created Kartikeya');
  }

  // 6. Parent relationships (biological)
  const children = [
    { child: ganesha, name: 'Ganesha' },
    { child: kartikeya, name: 'Kartikeya' },
  ];

  for (const { child, name } of children) {
    // Shiva → Child
    const shivaRel = await prisma.relationship.findUnique({
      where: { subjectId_objectId_type: { subjectId: shiva.id, objectId: child.id, type: 'PARENT_OF' } }
    });
    if (!shivaRel) {
      await prisma.relationship.create({
        data: { subjectId: shiva.id, objectId: child.id, type: 'PARENT_OF', isBiological: true }
      });
      console.log(`Created Shiva → ${name} (biological)`);
    }

    // Parvati → Child
    const parvatiRel = await prisma.relationship.findUnique({
      where: { subjectId_objectId_type: { subjectId: parvati.id, objectId: child.id, type: 'PARENT_OF' } }
    });
    if (!parvatiRel) {
      await prisma.relationship.create({
        data: { subjectId: parvati.id, objectId: child.id, type: 'PARENT_OF', isBiological: true }
      });
      console.log(`Created Parvati → ${name} (biological)`);
    }
  }

  console.log('Shiva Parivar seed complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
