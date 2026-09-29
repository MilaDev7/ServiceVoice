import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    id: "service-marriage",
    slug: "marriage-certificate",
    category: "CIVIL_STATUS",
    nameEn: "Marriage certificate",
    nameAm: "የጋብቻ ምስክር ወረቀት",
    nameOm: "Ragaa gaa'elaa",
    nameTi: "ናይ መርዓ ምስክር ወረቐት",
    descriptionEn: "Register and obtain a marriage certificate.",
    descriptionAm: "የጋብቻ ምስክር ወረቀት ማግኘት።",
    descriptionOm: "Ragaa gaa'elaa galmeessuu fi argachuu.",
    descriptionTi: "ናይ መርዓ ምስክር ወረቐት ምርካብ።",
  },
  {
    id: "service-birth",
    slug: "birth-certificate",
    category: "VITAL_RECORD",
    nameEn: "Birth certificate",
    nameAm: "የልደት ምስክር ወረቀት",
    nameOm: "Ragaa dhalootaa",
    nameTi: "ናይ ልደት ምስክር ወረቐት",
    descriptionEn: "Register a birth and obtain a certificate.",
    descriptionAm: "ልደት መመዝገብ እና ምስክር ወረቀት ማግኘት።",
    descriptionOm: "Dhaloota galmeessuu fi ragaa argachuu.",
    descriptionTi: "ልደት ምምዝጋብን ምስክር ወረቐት ምርካብን።",
  },
];

const sources = [
  {
    id: "source-civil-registration",
    reference: "CR-2024-01",
    title: "Civil Registration Regulation",
    type: "OFFICIAL_REGULATION",
    authority: "Civil Registration Office",
    isVerified: true,
  },
  {
    id: "source-vital-records",
    reference: "VR-2024-02",
    title: "Vital Records Regulation",
    type: "OFFICIAL_REGULATION",
    authority: "Vital Records Office",
    isVerified: true,
  },
];

const knowledgeUnits = [
  {
    id: "knowledge-marriage-requirement-id-en",
    serviceId: "service-marriage",
    sourceId: "source-civil-registration",
    language: "en",
    type: "REQUIREMENT",
    content: "A National ID is required.",
    publicationStatus: "PUBLISHED",
    publishedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "knowledge-marriage-requirement-id-am",
    serviceId: "service-marriage",
    sourceId: "source-civil-registration",
    language: "am",
    type: "REQUIREMENT",
    content: "ብሔራዊ መታወቂያ ያስፈልጋል።",
    publicationStatus: "PUBLISHED",
    publishedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "knowledge-marriage-requirement-witnesses-en",
    serviceId: "service-marriage",
    sourceId: "source-civil-registration",
    language: "en",
    type: "REQUIREMENT",
    content: "Two witnesses are required.",
    publicationStatus: "PUBLISHED",
    publishedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "knowledge-birth-requirement-notification-en",
    serviceId: "service-birth",
    sourceId: "source-vital-records",
    language: "en",
    type: "REQUIREMENT",
    content: "A birth notification is required.",
    publicationStatus: "PUBLISHED",
    publishedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "knowledge-birth-requirement-notification-om",
    serviceId: "service-birth",
    sourceId: "source-vital-records",
    language: "om",
    type: "REQUIREMENT",
    content: "Beeksisni dhalootaa barbaachisa.",
    publicationStatus: "PUBLISHED",
    publishedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
];

async function seed() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  for (const source of sources) {
    await prisma.source.upsert({
      where: { reference: source.reference },
      update: source,
      create: source,
    });
  }

  for (const knowledgeUnit of knowledgeUnits) {
    await prisma.knowledgeUnit.upsert({
      where: { id: knowledgeUnit.id },
      update: knowledgeUnit,
      create: knowledgeUnit,
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
