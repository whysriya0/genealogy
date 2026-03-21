import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getOrCreate(name: string, type: string, gender: string, description: string) {
  let entity = await prisma.person.findFirst({ where: { name, type: type as any } });
  if (!entity) {
    entity = await prisma.person.create({ data: { name, type: type as any, gender: gender as any, description } });
    console.log(`Created ${name}`);
  }
  return entity;
}

async function linkParent(parentId: string, childId: string, parentName: string, childName: string) {
  const exists = await prisma.relationship.findUnique({
    where: { subjectId_objectId_type: { subjectId: parentId, objectId: childId, type: 'PARENT_OF' } }
  });
  if (!exists) {
    await prisma.relationship.create({ data: { subjectId: parentId, objectId: childId, type: 'PARENT_OF', isBiological: true } });
    console.log(`  ${parentName} → ${childName}`);
  }
}

async function linkSpouse(aId: string, bId: string, aName: string, bName: string) {
  const exists = await prisma.relationship.findUnique({
    where: { subjectId_objectId_type: { subjectId: aId, objectId: bId, type: 'SPOUSE_OF' } }
  });
  if (!exists) {
    await prisma.relationship.create({ data: { subjectId: aId, objectId: bId, type: 'SPOUSE_OF', isBiological: true } });
    console.log(`  ${aName} ↔ ${bName} (consort)`);
  }
}

async function main() {
  console.log('Seeding Suryavansha (Solar Dynasty)...\n');

  // Key figures of the Solar Dynasty — simplified chain
  const surya      = await getOrCreate('Surya',      'GOD',           'MALE',   'The Sun God, progenitor of the Solar Dynasty (Suryavansha).');
  const vaivasvata = await getOrCreate('Vaivasvata Manu', 'FAMOUS_PERSON', 'MALE', 'The first man of the current age, son of Surya. Progenitor of humanity.');
  const ikshvaku   = await getOrCreate('Ikshvaku',   'FAMOUS_PERSON', 'MALE',   'Founder of the Ikshvaku dynasty, first king of Ayodhya.');
  const raghu      = await getOrCreate('Raghu',      'FAMOUS_PERSON', 'MALE',   'Great emperor of the Solar Dynasty, after whom the Raghuvansha is named.');
  const aja        = await getOrCreate('Aja',        'FAMOUS_PERSON', 'MALE',   'King of Ayodhya, grandson of Raghu, father of Dasharatha.');
  const dasharatha = await getOrCreate('Dasharatha',  'FAMOUS_PERSON', 'MALE',   'King of Ayodhya, father of Rama. Performed the Putrakameshti Yagna.');

  // Rama — check if already exists (might be seeded as avatar of Vishnu)
  let rama = await prisma.person.findFirst({ where: { name: 'Rama', type: 'GOD' } });
  if (!rama) {
    rama = await getOrCreate('Rama', 'GOD', 'MALE', 'The 7th Avatar of Vishnu, Prince of Ayodhya, embodiment of Dharma.');
  }

  const sita = await getOrCreate('Sita', 'GOD', 'FEMALE', 'Incarnation of Goddess Lakshmi, wife of Rama, princess of Mithila.');
  const lava = await getOrCreate('Lava',  'FAMOUS_PERSON', 'MALE', 'Son of Rama and Sita, co-founder of the city of Lavapuri (Lahore).');
  const kusha = await getOrCreate('Kusha', 'FAMOUS_PERSON', 'MALE', 'Son of Rama and Sita, founded the city of Kushasthali.');

  // Build the lineage chain
  console.log('\nLinking lineage:');
  await linkParent(surya.id, vaivasvata.id, 'Surya', 'Vaivasvata Manu');
  await linkParent(vaivasvata.id, ikshvaku.id, 'Vaivasvata Manu', 'Ikshvaku');
  await linkParent(ikshvaku.id, raghu.id, 'Ikshvaku', 'Raghu');    // collapsed gap
  await linkParent(raghu.id, aja.id, 'Raghu', 'Aja');
  await linkParent(aja.id, dasharatha.id, 'Aja', 'Dasharatha');
  await linkParent(dasharatha.id, rama.id, 'Dasharatha', 'Rama');

  // Rama ↔ Sita
  await linkSpouse(rama.id, sita.id, 'Rama', 'Sita');

  // Rama & Sita → Lava, Kusha
  await linkParent(rama.id, lava.id, 'Rama', 'Lava');
  await linkParent(rama.id, kusha.id, 'Rama', 'Kusha');
  await linkParent(sita.id, lava.id, 'Sita', 'Lava');
  await linkParent(sita.id, kusha.id, 'Sita', 'Kusha');

  console.log('\nSuryavansha seed complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
