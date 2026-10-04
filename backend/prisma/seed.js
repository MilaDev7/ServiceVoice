
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.phrase.deleteMany();
  await prisma.instruction.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.service.deleteMany();

  // ============================================================
  // 1. MARRIAGE CERTIFICATE
  // ============================================================

  const marriage = await prisma.service.create({
    data: {
      name: "Marriage Certificate",
      slug: "marriage-certificate",
      description:
        "Demo service record used for testing ServiceVoice database retrieval.",
      isActive: true,

      requirements: {
        create: [
          {
            title: "Valid identification document",
            description:
              "A valid identification document is required for this demo service.",
            sortOrder: 1
          },
          {
            title: "Marriage registration information",
            description:
              "Marriage registration information must be provided.",
            sortOrder: 2
          },
          {
            title: "Required supporting documents",
            description:
              "Supporting documents related to the marriage registration may be required according to the service record.",
            sortOrder: 3
          }
        ]
      },

      instructions: {
        create: [
          {
            title: "Check the required documents",
            content:
              "Review all required documents before starting the application.",
            sortOrder: 1
          },
          {
            title: "Provide accurate information",
            content:
              "The applicant should provide accurate information matching the submitted documents.",
            sortOrder: 2
          },
          {
            title: "Verify missing information",
            content:
              "If information is not available in the ServiceVoice database, do not invent it.",
            sortOrder: 3
          }
        ]
      },

      phrases: {
        create: [
          {
            language: "am",
            phrase: "የጋብቻ ሰርተፊኬት",
            sortOrder: 1
          },
          {
            language: "am",
            phrase: "የጋብቻ ማረጋገጫ",
            sortOrder: 2
          },
          {
            language: "en",
            phrase: "Marriage Certificate",
            sortOrder: 3
          },
          {
            language: "en",
            phrase: "Marriage Registration",
            sortOrder: 4
          },
          {
            language: "om",
            phrase: "Ragaa gaa'elaa",
            sortOrder: 5
          },
          {
            language: "om",
            phrase: "Galmee gaa'elaa",
            sortOrder: 6
          }
        ]
      }
    }
  });

  // ============================================================
  // 2. BIRTH CERTIFICATE
  // ============================================================

  const birth = await prisma.service.create({
    data: {
      name: "Birth Certificate",
      slug: "birth-certificate",
      description:
        "Demo service record used for testing ServiceVoice database retrieval.",
      isActive: true,

      requirements: {
        create: [
          {
            title: "Identity information",
            description:
              "Identity information is required for this demo service.",
            sortOrder: 1
          },
          {
            title: "Birth information",
            description:
              "The applicant must provide the relevant birth information.",
            sortOrder: 2
          },
          {
            title: "Supporting identification document",
            description:
              "A supporting identification document may be required according to the stored service information.",
            sortOrder: 3
          }
        ]
      },

      instructions: {
        create: [
          {
            title: "Prepare the information",
            content:
              "Prepare the required birth and identity information before beginning the process.",
            sortOrder: 1
          },
          {
            title: "Check the stored requirements",
            content:
              "Use only the requirements available in the ServiceVoice database.",
            sortOrder: 2
          }
        ]
      },

      phrases: {
        create: [
          {
            language: "am",
            phrase: "የልደት ሰርተፊኬት",
            sortOrder: 1
          },
          {
            language: "am",
            phrase: "የልደት ማረጋገጫ",
            sortOrder: 2
          },
          {
            language: "en",
            phrase: "Birth Certificate",
            sortOrder: 3
          },
          {
            language: "en",
            phrase: "Birth Registration",
            sortOrder: 4
          },
          {
            language: "om",
            phrase: "Ragaa dhalootaa",
            sortOrder: 5
          }
        ]
      }
    }
  });

  // ============================================================
  // 3. DRIVING LICENCE
  // ============================================================

  const drivingLicence = await prisma.service.create({
    data: {
      name: "Driving Licence",
      slug: "driving-licence",
      description:
        "Demo service record used for testing ServiceVoice database retrieval.",
      isActive: true,

      requirements: {
        create: [
          {
            title: "Valid identification document",
            description:
              "A valid identification document is required for this demo service.",
            sortOrder: 1
          },
          {
            title: "Driving licence application information",
            description:
              "The applicant must provide the required application information.",
            sortOrder: 2
          },
          {
            title: "Required driving-related documentation",
            description:
              "Driving-related supporting documents must be provided when required by the stored service information.",
            sortOrder: 3
          }
        ]
      },

      instructions: {
        create: [
          {
            title: "Prepare identification",
            content:
              "Prepare the required identification information before starting the application.",
            sortOrder: 1
          },
          {
            title: "Review requirements",
            content:
              "Review all driving licence requirements stored in the database.",
            sortOrder: 2
          },
          {
            title: "Do not assume missing information",
            content:
              "If a specific requirement is not stored, ServiceVoice must tell the user that the information is unavailable.",
            sortOrder: 3
          }
        ]
      },

      phrases: {
        create: [
          {
            language: "am",
            phrase: "የመንጃ ፈቃድ",
            sortOrder: 1
          },
          {
            language: "am",
            phrase: "መንጃ ፈቃድ",
            sortOrder: 2
          },
          {
            language: "en",
            phrase: "Driving Licence",
            sortOrder: 3
          },
          {
            language: "en",
            phrase: "Driving License",
            sortOrder: 4
          },
          {
            language: "om",
            phrase: "Hayyama konkolaachisummaa",
            sortOrder: 5
          }
        ]
      }
    }
  });

  // ============================================================
  // 4. PASSPORT
  // ============================================================

  const passport = await prisma.service.create({
    data: {
      name: "Passport Application",
      slug: "passport-application",
      description:
        "Demo service record used for testing ServiceVoice database retrieval.",
      isActive: true,

      requirements: {
        create: [
          {
            title: "Valid identification document",
            description:
              "A valid identification document is required for this demo service.",
            sortOrder: 1
          },
          {
            title: "Passport application information",
            description:
              "The applicant must provide the required passport application information.",
            sortOrder: 2
          },
          {
            title: "Applicant photograph",
            description:
              "A photograph is included as a demo requirement for testing.",
            sortOrder: 3
          }
        ]
      },

      instructions: {
        create: [
          {
            title: "Prepare application information",
            content:
              "Prepare the information required by the passport service record.",
            sortOrder: 1
          },
          {
            title: "Check identification",
            content:
              "Make sure the identification information is available before continuing.",
            sortOrder: 2
          }
        ]
      },

      phrases: {
        create: [
          {
            language: "am",
            phrase: "ፓስፖርት",
            sortOrder: 1
          },
          {
            language: "am",
            phrase: "የፓስፖርት ማመልከቻ",
            sortOrder: 2
          },
          {
            language: "en",
            phrase: "Passport",
            sortOrder: 3
          },
          {
            language: "en",
            phrase: "Passport Application",
            sortOrder: 4
          },
          {
            language: "om",
            phrase: "Paaspoortii",
            sortOrder: 5
          }
        ]
      }
    }
  });

  // ============================================================
  // 5. BUSINESS LICENCE
  // ============================================================

  const businessLicence = await prisma.service.create({
    data: {
      name: "Business Licence",
      slug: "business-licence",
      description:
        "Demo service record used for testing ServiceVoice database retrieval.",
      isActive: true,

      requirements: {
        create: [
          {
            title: "Applicant identification",
            description:
              "Identification information is required for this demo service.",
            sortOrder: 1
          },
          {
            title: "Business information",
            description:
              "Information about the business must be provided.",
            sortOrder: 2
          },
          {
            title: "Business activity information",
            description:
              "The intended business activity must be specified.",
            sortOrder: 3
          }
        ]
      },

      instructions: {
        create: [
          {
            title: "Prepare business information",
            content:
              "Prepare the business information required by the service.",
            sortOrder: 1
          },
          {
            title: "Review the requirements",
            content:
              "Review the stored requirements before submitting an application.",
            sortOrder: 2
          }
        ]
      },

      phrases: {
        create: [
          {
            language: "am",
            phrase: "የንግድ ፈቃድ",
            sortOrder: 1
          },
          {
            language: "am",
            phrase: "የንግድ ሥራ ፈቃድ",
            sortOrder: 2
          },
          {
            language: "en",
            phrase: "Business Licence",
            sortOrder: 3
          },
          {
            language: "en",
            phrase: "Business License",
            sortOrder: 4
          },
          {
            language: "om",
            phrase: "Hayyama daldalaa",
            sortOrder: 5
          }
        ]
      }
    }
  });

  console.log("======================================");
  console.log("ServiceVoice seed completed.");
  console.log("======================================");

  console.log({
    marriageCertificateId: marriage.id,
    birthCertificateId: birth.id,
    drivingLicenceId: drivingLicence.id,
    passportId: passport.id,
    businessLicenceId: businessLicence.id
  });

  console.log("======================================");
  console.log("Services created:");
  console.log("- Marriage Certificate");
  console.log("- Birth Certificate");
  console.log("- Driving Licence");
  console.log("- Passport Application");
  console.log("- Business Licence");
  console.log("======================================");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
