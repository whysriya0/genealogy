import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getOrCreate(name: string, type: string, gender: string, description: string, extraTags: string[] = []) {
  let entity = await prisma.person.findFirst({ where: { name, type: type as any } });
  if (!entity) {
    // Assuming tags aren't in the schema, we can embed them in the description for now
    // If we wanted real tags, we'd alter the Prisma schema.
    const fullDesc = extraTags.length > 0 
      ? `${description}\n\nManifestations/Forms: ${extraTags.join(', ')}` 
      : description;

    entity = await prisma.person.create({ data: { name, type: type as any, gender: gender as any, description: fullDesc } });
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

async function main() {
  console.log('Seeding Parvati Family Lineage...\n');

  // Parents
  const himavan = await getOrCreate('Himavan', 'GOD', 'MALE', 'King of the Himalayas, father of Parvati and Ganga.');
  const mena = await getOrCreate('Mena', 'GOD', 'FEMALE', 'Queen of the Himalayas, wife of Himavan, mother of Parvati.');

  // Parvati (Main Node with Forms embedded)
  let parvati = await prisma.person.findFirst({ where: { name: 'Parvati' } });
  if (!parvati) {
    parvati = await getOrCreate(
      'Parvati', 
      'GOD', 
      'FEMALE', 
      'Goddess of Fertility, Love, and Devotion. The divine feminine Shakti.',
      ['Durga', 'Kali', 'Annapurna', 'Kamakhya'] // Embed forms as text
    );
  } else {
    // Update existing Parvati to include forms if they aren't there
    if (!parvati.description?.includes('Durga')) {
      await prisma.person.update({
        where: { id: parvati.id },
        data: { description: `${parvati.description}\n\nManifestations/Forms: Durga, Kali, Annapurna, Kamakhya.` }
      });
      console.log('Updated Parvati with forms');
    }
  }

  // Consort
  let shiva = await prisma.person.findFirst({ where: { name: 'Shiva' } });
  if (!shiva) {
    shiva = await getOrCreate('Shiva', 'GOD', 'MALE', 'The Supreme Deity, Destroyer and Transformer of the Trimurti.');
  }

  // Children
  let ganesha = await prisma.person.findFirst({ where: { name: 'Ganesha' } });
  if (!ganesha) {
    ganesha = await getOrCreate('Ganesha', 'GOD', 'MALE', 'The Remover of Obstacles, God of Beginnings and Wisdom.');
  }
  
  let kartikeya = await prisma.person.findFirst({ where: { name: 'Kartikeya' } });
  if (!kartikeya) {
    kartikeya = await getOrCreate('Kartikeya', 'GOD', 'MALE', 'God of War, also known as Skanda or Murugan.');
  }
  
  let ashokasundari = await prisma.person.findFirst({ where: { name: 'Ashokasundari' } });
  if (!ashokasundari) {
    ashokasundari = await getOrCreate('Ashokasundari', 'GOD', 'FEMALE', 'Daughter of Shiva and Parvati, created from the Kalpavriksha tree.');
  }

  console.log('\nLinking lineage:');
  
  // Himavan & Mena → Parvati
  await linkParent(himavan.id, parvati.id, 'Himavan', 'Parvati');
  await linkParent(mena.id, parvati.id, 'Mena', 'Parvati');

  // Parvati ↔ Shiva (Consort)
  const spouseExists = await prisma.relationship.findUnique({
    where: { subjectId_objectId_type: { subjectId: shiva.id, objectId: parvati.id, type: 'SPOUSE_OF' } }
  });
  if (!spouseExists) {
    await prisma.relationship.create({ data: { subjectId: shiva.id, objectId: parvati.id, type: 'SPOUSE_OF', isBiological: true } });
    console.log(`  Shiva ↔ Parvati (consort)`);
  }

  // Parvati & Shiva → Children
  const children = [
    { child: ganesha, name: 'Ganesha' },
    { child: kartikeya, name: 'Kartikeya' },
    { child: ashokasundari, name: 'Ashokasundari' }
  ];

  for (const { child, name } of children) {
    await linkParent(parvati.id, child.id, 'Parvati', name);
    await linkParent(shiva.id, child.id, 'Shiva', name);
  }

  console.log('\nParvati seed complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
