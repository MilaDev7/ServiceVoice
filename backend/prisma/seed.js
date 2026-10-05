
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    name: "Passport Application",
    slug: "passport-application",
    description:
      "Passport application service provided by the Ethiopian Immigration and Citizenship Service.",
    requirements: [
      ["Authenticated birth certificate", "Applicants may be required to provide an authenticated birth certificate."],
      ["Kebele identification", "A valid renewed identification document is required according to the applicable application category."],
      ["Online application", "The applicant completes the passport application through the designated electronic service."],
      ["Payment", "The applicable passport service fee must be paid."],
      ["Printed application information", "The applicant should have the required application information available for the appointment."],
      ["Appointment", "The applicant must attend the selected appointment for biometric processing."],
      ["Original documents", "Original supporting documents must be presented when required for verification."]
    ],
    instructions: [
      ["Register", "Create or access the required account on the designated passport service platform."],
      ["Complete application", "Enter the requested applicant information accurately."],
      ["Pay", "Complete the applicable payment."],
      ["Attend appointment", "Attend the selected appointment with the required original documents."]
    ],
    phrases: [
      ["en", "Passport Application"],
      ["am", "የፓስፖርት ማመልከቻ"],
      ["om", "Paaspoortii"]
    ]
  },
  {
    name: "Passport Renewal",
    slug: "passport-renewal",
    description:
      "Renewal of an Ethiopian passport through the Ethiopian Immigration and Citizenship Service.",
    requirements: [
      ["Existing passport", "The applicant should provide the existing passport."],
      ["Identification document", "A valid identification document may be required for identity verification."],
      ["Online application", "The renewal request is submitted through the designated service."],
      ["Payment", "The applicable renewal fee must be paid."],
      ["Appointment", "The applicant attends the required appointment."],
      ["Original documents", "Required original documents must be presented for verification."],
      ["Biometric verification", "Biometric information may be collected or verified as required."]
    ],
    instructions: [
      ["Start renewal", "Access the designated passport service and select the renewal service."],
      ["Provide information", "Enter the required information accurately."],
      ["Complete payment", "Pay the applicable service fee."],
      ["Attend appointment", "Attend the appointment with the required documents."]
    ],
    phrases: [
      ["en", "Passport Renewal"],
      ["am", "የፓስፖርት እድሳት"],
      ["om", "Paaspoortii haaromsuu"]
    ]
  },
  {
    name: "Birth Certificate",
    slug: "birth-certificate",
    description:
      "Civil registration service for obtaining a birth certificate in Ethiopia.",
    requirements: [
      ["Birth registration information", "Information concerning the registered birth is required."],
      ["Parent identification", "Identification information for the parent or authorized applicant may be required."],
      ["Child information", "The child's registered personal information is required."],
      ["Birth registration record", "The application must correspond with the applicable civil registration record."],
      ["Application information", "The applicant must provide the information requested by the responsible civil registration authority."],
      ["Supporting documentation", "Additional supporting documentation may be required depending on the registration circumstances."],
      ["Identity verification", "The identity of the applicant may need to be verified."]
    ],
    instructions: [
      ["Provide information", "Provide accurate information corresponding to the registered birth."],
      ["Submit request", "Submit the request through the responsible civil registration service."],
      ["Verify identity", "Provide identification information when requested."],
      ["Receive certificate", "Collect or receive the certificate according to the applicable service procedure."]
    ],
    phrases: [
      ["en", "Birth Certificate"],
      ["am", "የልደት ምስክር ወረቀት"],
      ["om", "Ragaa dhalootaa"]
    ]
  },
  {
    name: "Marriage Certificate",
    slug: "marriage-certificate",
    description:
      "Civil registration service for registration and certification of marriage.",
    requirements: [
      ["Identification documents", "Valid identification documents of the persons involved are required."],
      ["Marriage registration information", "Information required for registration of the marriage must be provided."],
      ["Personal information", "The required personal information of the persons entering the marriage must be provided."],
      ["Marriage registration record", "The certificate must correspond to the applicable marriage registration record."],
      ["Witness information", "Witness information may be required according to the applicable registration procedure."],
      ["Application information", "The applicants must provide the information requested by the responsible authority."],
      ["Supporting documents", "Additional documents may be required depending on the circumstances of the marriage."]
    ],
    instructions: [
      ["Prepare identification", "Prepare the required identification documents."],
      ["Submit registration information", "Provide accurate marriage registration information."],
      ["Complete registration", "Complete the applicable civil registration procedure."],
      ["Obtain certificate", "Receive the marriage certificate after the applicable registration process."]
    ],
    phrases: [
      ["en", "Marriage Certificate"],
      ["am", "የጋብቻ ምስክር ወረቀት"],
      ["om", "Ragaa gaa'elaa"]
    ]
  },
  {
    name: "Death Certificate",
    slug: "death-certificate",
    description:
      "Civil registration service for registration and certification of death.",
    requirements: [
      ["Death information", "Information about the deceased and the death must be provided."],
      ["Identification information", "Identification information of the deceased may be required."],
      ["Applicant identification", "Identification information of the person requesting the certificate may be required."],
      ["Death registration record", "The application must correspond with the registered death record."],
      ["Medical information", "Medical or death-related documentation may be required where applicable."],
      ["Application information", "The applicant must provide the information requested by the responsible authority."],
      ["Supporting documents", "Additional documentation may be required according to the circumstances."]
    ],
    instructions: [
      ["Provide death information", "Provide accurate information concerning the death."],
      ["Submit registration", "Submit the death registration request to the responsible authority."],
      ["Verify information", "Ensure the submitted information corresponds with the registration record."],
      ["Obtain certificate", "Receive the death certificate after completion of the applicable process."]
    ],
    phrases: [
      ["en", "Death Certificate"],
      ["am", "የሞት ምስክር ወረቀት"],
      ["om", "Ragaa du'aa"]
    ]
  },
  {
    name: "Fayda National ID Registration",
    slug: "fayda-national-id-registration",
    description:
      "National digital identification registration service under Ethiopia's Fayda identification program.",
    requirements: [
      ["Applicant information", "The applicant provides the personal information required for registration."],
      ["Biometric information", "Required biometric information is collected during registration."],
      ["Identity information", "Information necessary to establish the applicant's identity is provided."],
      ["Contact information", "Required contact information is provided where applicable."],
      ["Registration location", "The applicant completes registration through an authorized registration channel."],
      ["Verification", "Submitted identity information is subject to verification."],
      ["Consent", "The applicant follows the applicable registration and consent process."]
    ],
    instructions: [
      ["Start registration", "Access an authorized Fayda registration channel."],
      ["Provide information", "Provide accurate personal information."],
      ["Complete biometrics", "Complete the required biometric registration process."],
      ["Verify registration", "Follow the applicable process to complete identity registration."]
    ],
    phrases: [
      ["en", "Fayda National ID"],
      ["am", "ፋይዳ ብሔራዊ መታወቂያ"],
      ["om", "Eenyummaa Biyyaalessaa Faydaa"]
    ]
  },
  {
    name: "Educational Document Authentication",
    slug: "educational-document-authentication",
    description:
      "Authentication service for educational credentials issued by Ethiopian educational institutions.",
    requirements: [
      ["Original degree", "The original degree should be duly certified by the appropriate institutional authorities."],
      ["Original transcript", "The original transcript should be duly certified by the appropriate institutional authorities."],
      ["Transcript academic information", "The transcript should contain the required academic information."],
      ["University entrance examination certificate", "The original entrance examination certificate is required where applicable."],
      ["Entrance certificate authentication", "The entrance examination certificate must be authenticated by the responsible examination authority where applicable."],
      ["Level IV or 10+3 document", "Where used for entrance, the applicable Level IV certificate or 10+3 diploma should be authenticated by the responsible TVET authority."],
      ["Complete application", "The application must be completed according to the applicable form and instructions."]
    ],
    instructions: [
      ["Prepare credentials", "Prepare the original educational credentials required for authentication."],
      ["Complete application", "Complete the application accurately and completely."],
      ["Submit documents", "Upload or submit the required documents through the authority's platform."],
      ["Track application", "Use the available application tracking service to follow the request."]
    ],
    phrases: [
      ["en", "Educational Document Authentication"],
      ["am", "የትምህርት ማስረጃ ማረጋገጫ"],
      ["om", "Ragaa barnootaa mirkaneessuu"]
    ]
  },
  {
    name: "Foreign Educational Credential Equivalence",
    slug: "foreign-educational-credential-equivalence",
    description:
      "Evaluation of foreign educational qualifications against Ethiopian education standards.",
    requirements: [
      ["Foreign educational credential", "The foreign educational credential must be submitted."],
      ["Academic transcript", "The applicable academic transcript must be submitted."],
      ["Applicant information", "Required applicant information must be provided."],
      ["Supporting educational documents", "Supporting educational documents required for evaluation must be submitted."],
      ["Complete application", "The application must be completed according to the applicable form and instructions."],
      ["Document authenticity", "Submitted documents are subject to verification."],
      ["Accurate information", "All submitted information must be accurate."]
    ],
    instructions: [
      ["Prepare foreign credentials", "Prepare the educational documents to be evaluated."],
      ["Submit application", "Submit the equivalence application through the designated platform."],
      ["Complete verification", "Respond to verification requirements when applicable."],
      ["Receive evaluation", "Receive the equivalence result after evaluation."]
    ],
    phrases: [
      ["en", "Foreign Educational Credential Equivalence"],
      ["am", "የውጭ ሀገር የትምህርት ማስረጃ እኩልነት"],
      ["om", "Ragaa barnootaa biyya alaa walqixxummaa"]
    ]
  },
  {
    name: "Educational Institution Accreditation",
    slug: "educational-institution-accreditation",
    description:
      "Accreditation and quality assurance service for educational and training institutions.",
    requirements: [
      ["Institution information", "The institution must provide the information requested by the responsible authority."],
      ["Program information", "Information concerning the educational or training programs must be provided."],
      ["Institutional documentation", "Required institutional documents must be submitted."],
      ["Qualified personnel information", "Required information concerning academic or training personnel must be provided."],
      ["Facilities information", "Information concerning facilities and resources must be provided."],
      ["Quality assurance information", "Required quality assurance information must be submitted."],
      ["Complete application", "The application must be complete and accurate."]
    ],
    instructions: [
      ["Prepare institutional information", "Prepare the documents and information requested by the authority."],
      ["Submit application", "Submit the accreditation request through the applicable procedure."],
      ["Quality review", "Participate in the applicable assessment and review process."],
      ["Receive decision", "Follow the authority's decision and accreditation process."]
    ],
    phrases: [
      ["en", "Educational Institution Accreditation"],
      ["am", "የትምህርት ተቋም እውቅና"],
      ["om", "Hayyama dhaabbata barnootaa"]
    ]
  },
  {
    name: "TIN Registration",
    slug: "tin-registration",
    description:
      "Taxpayer identification number registration service in Ethiopia.",
    requirements: [
      ["Applicant identification", "Identification information is required for taxpayer registration."],
      ["Personal or business information", "The required taxpayer information must be provided."],
      ["Address information", "The required taxpayer address information must be provided."],
      ["Contact information", "Required contact information must be provided."],
      ["Business information", "Business applicants provide the applicable business information."],
      ["Supporting documents", "Supporting documents required for the taxpayer category must be provided."],
      ["Accurate application", "The taxpayer application must contain accurate information."]
    ],
    instructions: [
      ["Prepare information", "Prepare the identification and taxpayer information required for registration."],
      ["Submit application", "Submit the TIN registration request through the applicable tax authority channel."],
      ["Verify information", "Confirm that the submitted information is correct."],
      ["Receive TIN", "Receive the taxpayer identification number after registration."]
    ],
    phrases: [
      ["en", "Taxpayer Identification Number Registration"],
      ["am", "የግብር ከፋይ መለያ ቁጥር ምዝገባ"],
      ["om", "Lakkoofsa adda baasaa kaffalaa gibiraa"]
    ]
  },
  {
    name: "VAT Registration",
    slug: "vat-registration",
    description:
      "Value Added Tax registration service administered through the Ethiopian tax administration system.",
    requirements: [
      ["TIN", "The taxpayer must have the applicable taxpayer identification information."],
      ["Business information", "The required business information must be provided."],
      ["Business address", "The applicable business address must be provided."],
      ["Contact information", "Required contact information must be provided."],
      ["Taxpayer information", "Required taxpayer information must be provided."],
      ["Supporting documents", "Supporting documents required for VAT registration must be submitted."],
      ["Complete application", "The VAT registration application must be completed accurately."]
    ],
    instructions: [
      ["Confirm taxpayer information", "Ensure that the taxpayer information is current."],
      ["Prepare VAT application", "Prepare the required VAT registration information."],
      ["Submit registration", "Submit the VAT registration request."],
      ["Complete verification", "Complete any applicable verification requested by the tax authority."]
    ],
    phrases: [
      ["en", "VAT Registration"],
      ["am", "የተ.እ.ታ ምዝገባ"],
      ["om", "Galmee VAT"]
    ]
  },
  {
    name: "Business License Registration",
    slug: "business-license-registration",
    description:
      "Registration and licensing service for businesses operating in Ethiopia.",
    requirements: [
      ["TIN", "The applicant provides the applicable taxpayer identification information."],
      ["Business name information", "The proposed or registered business name must be provided."],
      ["Business activity information", "The applicant must identify the intended business activity."],
      ["Business address", "The business address must be provided."],
      ["Applicant identification", "Identification information of the applicant or responsible person is required."],
      ["Supporting documents", "Documents required for the selected business activity must be submitted."],
      ["Application information", "The application must be complete and accurate."]
    ],
    instructions: [
      ["Select business activity", "Identify the business activity for which the license is requested."],
      ["Prepare documents", "Prepare the documents required for the selected activity."],
      ["Submit application", "Submit the business registration or licensing application."],
      ["Complete payment", "Pay applicable government fees where required."]
    ],
    phrases: [
      ["en", "Business License Registration"],
      ["am", "የንግድ ፈቃድ ምዝገባ"],
      ["om", "Galmee hayyama daldalaa"]
    ]
  },
  {
    name: "Business Name Registration",
    slug: "business-name-registration",
    description:
      "Registration of a business or trade name through the applicable Ethiopian business registration authority.",
    requirements: [
      ["Applicant identification", "The applicant's identification information is required."],
      ["Proposed business name", "The proposed business name must be provided."],
      ["Business activity", "The intended business activity must be identified."],
      ["Business address", "The applicable business address must be provided."],
      ["Contact information", "Required contact information must be provided."],
      ["Application information", "Required registration information must be provided."],
      ["Supporting documents", "Supporting documents required for the applicant category must be submitted."]
    ],
    instructions: [
      ["Choose name", "Provide the proposed business name."],
      ["Provide business information", "Provide the requested business activity and address information."],
      ["Submit application", "Submit the business name registration request."],
      ["Complete registration", "Complete the applicable registration process."]
    ],
    phrases: [
      ["en", "Business Name Registration"],
      ["am", "የንግድ ስም ምዝገባ"],
      ["om", "Maqaa daldalaa galmeessuu"]
    ]
  },
  {
    name: "Company Registration",
    slug: "company-registration",
    description:
      "Registration service for companies established under Ethiopian commercial law.",
    requirements: [
      ["Company name", "The proposed company name must be provided."],
      ["Company type", "The legal form of the company must be identified."],
      ["Founding documents", "Required founding and incorporation documents must be prepared."],
      ["Shareholder information", "Required information concerning shareholders must be provided."],
      ["Manager information", "Required information concerning managers or responsible persons must be provided."],
      ["Company address", "The registered company address must be provided."],
      ["Identification documents", "Required identification documents must be submitted."]
    ],
    instructions: [
      ["Select company form", "Select the applicable legal form."],
      ["Prepare incorporation documents", "Prepare the documents required for company registration."],
      ["Submit application", "Submit the registration application."],
      ["Complete registration", "Complete the applicable company registration process."]
    ],
    phrases: [
      ["en", "Company Registration"],
      ["am", "የኩባንያ ምዝገባ"],
      ["om", "Galmee dhaabbata daldalaa"]
    ]
  },
  {
    name: "Commercial Registration Renewal",
    slug: "commercial-registration-renewal",
    description:
      "Renewal service for applicable commercial registration records.",
    requirements: [
      ["Existing registration", "The existing commercial registration information is required."],
      ["TIN", "Applicable taxpayer identification information is required."],
      ["Business information", "Current business information must be provided."],
      ["Business address", "Current business address must be provided."],
      ["Applicant identification", "Identification information of the responsible person is required."],
      ["Renewal application", "The applicable renewal request must be completed."],
      ["Supporting documents", "Required supporting documents must be provided."]
    ],
    instructions: [
      ["Review registration", "Review the existing commercial registration information."],
      ["Update information", "Update information that has changed."],
      ["Submit renewal", "Submit the renewal application."],
      ["Complete payment", "Pay the applicable renewal fee where required."]
    ],
    phrases: [
      ["en", "Commercial Registration Renewal"],
      ["am", "የንግድ ምዝገባ እድሳት"],
      ["om", "Galmee daldalaa haaromsuu"]
    ]
  },
  {
    name: "Investment License",
    slug: "investment-license",
    description:
      "Investment licensing service for eligible investment projects in Ethiopia.",
    requirements: [
      ["Investment project information", "Information about the proposed investment project must be provided."],
      ["Investor identification", "Required investor identification information must be submitted."],
      ["Business plan", "The applicable investment project plan or business plan must be provided."],
      ["Project location", "The proposed project location must be identified."],
      ["Capital information", "Required information concerning the investment capital must be provided."],
      ["Company documents", "Where applicable, company registration documents must be provided."],
      ["Application", "The investment license application must be complete and accurate."]
    ],
    instructions: [
      ["Prepare project information", "Prepare the information required for the investment project."],
      ["Submit application", "Submit the applicable investment service application."],
      ["Provide supporting documents", "Provide the documents requested for the project."],
      ["Complete licensing process", "Complete the applicable review and licensing process."]
    ],
    phrases: [
      ["en", "Investment License"],
      ["am", "የኢንቨስትመንት ፈቃድ"],
      ["om", "Hayyama invastimantii"]
    ]
  },
  {
    name: "Work Permit",
    slug: "work-permit",
    description:
      "Work permit service for foreign nationals working in Ethiopia.",
    requirements: [
      ["Passport", "A valid passport is required."],
      ["Employment information", "Information concerning the intended employment must be provided."],
      ["Employer information", "Information concerning the employing organization must be provided."],
      ["Employment contract", "The applicable employment contract or employment information must be provided."],
      ["Educational or professional credentials", "Credentials may be required according to the occupation."],
      ["Application information", "The work permit application must be completed."],
      ["Supporting documents", "Additional supporting documents may be required for the specific work permit category."]
    ],
    instructions: [
      ["Prepare employment information", "Prepare the required employer and employment information."],
      ["Prepare documents", "Prepare the passport and supporting documents."],
      ["Submit application", "Submit the work permit application."],
      ["Complete review", "Complete the applicable immigration and employment review process."]
    ],
    phrases: [
      ["en", "Work Permit"],
      ["am", "የሥራ ፈቃድ"],
      ["om", "Hayyama hojii"]
    ]
  },
  {
    name: "Residence Permit",
    slug: "residence-permit",
    description:
      "Residence permit service for eligible foreign nationals residing in Ethiopia.",
    requirements: [
      ["Passport", "A valid passport is required."],
      ["Visa or immigration status", "Applicable immigration status information must be provided."],
      ["Residence purpose", "The purpose of residence must be identified."],
      ["Applicant information", "Required applicant information must be provided."],
      ["Photograph", "Required applicant photograph information or photograph must be provided."],
      ["Supporting documents", "Documents supporting the residence category must be submitted."],
      ["Application", "The residence permit application must be completed accurately."]
    ],
    instructions: [
      ["Identify residence category", "Select the applicable residence permit category."],
      ["Prepare documents", "Prepare the passport and category-specific supporting documents."],
      ["Submit application", "Submit the residence permit request."],
      ["Complete verification", "Complete the applicable immigration verification process."]
    ],
    phrases: [
      ["en", "Residence Permit"],
      ["am", "የመኖሪያ ፈቃድ"],
      ["om", "Hayyama jireenyaa"]
    ]
  },
  {
    name: "Visa Application",
    slug: "visa-application",
    description:
      "Visa application service for foreign nationals entering Ethiopia.",
    requirements: [
      ["Passport", "A valid passport is required."],
      ["Applicant information", "Required personal and travel information must be provided."],
      ["Travel information", "Information concerning the intended travel must be provided."],
      ["Photograph", "A required passport-style photograph may be requested."],
      ["Visa category", "The applicant must select the applicable visa category."],
      ["Supporting documents", "Documents required for the selected visa category must be submitted."],
      ["Payment", "The applicable visa fee must be paid."]
    ],
    instructions: [
      ["Select visa category", "Select the visa category applicable to the intended travel."],
      ["Complete application", "Provide accurate application information."],
      ["Upload documents", "Submit the documents required for the selected category."],
      ["Complete payment", "Pay the applicable visa fee."]
    ],
    phrases: [
      ["en", "Visa Application"],
      ["am", "የቪዛ ማመልከቻ"],
      ["om", "Iyyata viizaa"]
    ]
  },
  {
    name: "Driving License Application",
    slug: "driving-license-application",
    description:
      "Service for obtaining an Ethiopian driving license through the responsible transport authority.",
    requirements: [
      ["Identification", "Valid identification information is required."],
      ["Driving training", "The applicant must complete the applicable driver training requirements."],
      ["Medical fitness", "The applicable medical fitness requirement must be satisfied."],
      ["Driving examination", "The applicant must complete the required driving examinations."],
      ["Theory examination", "The applicable theoretical driving examination must be completed."],
      ["Applicant information", "Required personal information must be provided."],
      ["Application and fees", "The applicable application and government fees must be completed."]
    ],
    instructions: [
      ["Complete training", "Complete the required driver training."],
      ["Complete examinations", "Complete the required theoretical and practical examinations."],
      ["Submit application", "Submit the driving license application."],
      ["Complete issuance", "Complete the applicable license issuance process."]
    ],
    phrases: [
      ["en", "Driving License"],
      ["am", "የመንጃ ፈቃድ"],
      ["om", "Hayyama konkolaachisummaa"]
    ]
  },
  {
    name: "Driving License Renewal",
    slug: "driving-license-renewal",
    description:
      "Renewal service for an Ethiopian driving license.",
    requirements: [
      ["Existing driving license", "The existing driving license information is required."],
      ["Identification", "Valid identification information is required."],
      ["Medical fitness", "A medical fitness assessment may be required according to the applicable category."],
      ["Applicant information", "Current applicant information must be provided."],
      ["Photograph", "A current photograph may be required."],
      ["Renewal application", "The renewal application must be completed."],
      ["Renewal fee", "The applicable renewal fee must be paid."]
    ],
    instructions: [
      ["Prepare existing license", "Prepare the existing driving license."],
      ["Provide identification", "Provide the required identification information."],
      ["Complete renewal", "Submit the renewal application."],
      ["Pay fee", "Complete the applicable renewal payment."]
    ],
    phrases: [
      ["en", "Driving License Renewal"],
      ["am", "የመንጃ ፈቃድ እድሳት"],
      ["om", "Hayyama konkolaachisummaa haaromsuu"]
    ]
  },
  {
    name: "Vehicle Registration",
    slug: "vehicle-registration",
    description:
      "Registration service for motor vehicles in Ethiopia.",
    requirements: [
      ["Vehicle information", "Required information about the vehicle must be provided."],
      ["Ownership information", "Information establishing vehicle ownership must be provided."],
      ["Owner identification", "Identification information of the owner is required."],
      ["Vehicle inspection", "The vehicle must satisfy applicable inspection requirements."],
      ["Proof of purchase or ownership", "Applicable ownership documentation must be submitted."],
      ["Insurance information", "Required vehicle insurance information must be provided."],
      ["Registration application", "The registration application must be completed."]
    ],
    instructions: [
      ["Prepare ownership documents", "Prepare documents establishing ownership."],
      ["Complete inspection", "Complete the applicable vehicle inspection."],
      ["Submit registration", "Submit the vehicle registration request."],
      ["Complete payment", "Pay applicable registration charges."]
    ],
    phrases: [
      ["en", "Vehicle Registration"],
      ["am", "የተሽከርካሪ ምዝገባ"],
      ["om", "Galmee konkolaataa"]
    ]
  },
  {
    name: "Vehicle Registration Renewal",
    slug: "vehicle-registration-renewal",
    description:
      "Renewal of applicable vehicle registration.",
    requirements: [
      ["Existing registration", "Current vehicle registration information is required."],
      ["Vehicle information", "Current vehicle information must be provided."],
      ["Owner identification", "Owner identification information is required."],
      ["Vehicle inspection", "Applicable inspection requirements must be satisfied."],
      ["Insurance", "Required insurance information must be current."],
      ["Renewal application", "The renewal request must be submitted."],
      ["Applicable fees", "Applicable renewal charges must be paid."]
    ],
    instructions: [
      ["Check registration", "Review the current vehicle registration."],
      ["Complete inspection", "Complete any required vehicle inspection."],
      ["Submit renewal", "Submit the renewal application."],
      ["Pay charges", "Complete the applicable payment."]
    ],
    phrases: [
      ["en", "Vehicle Registration Renewal"],
      ["am", "የተሽከርካሪ ምዝገባ እድሳት"],
      ["om", "Galmee konkolaataa haaromsuu"]
    ]
  },
  {
    name: "Vehicle Ownership Transfer",
    slug: "vehicle-ownership-transfer",
    description:
      "Service for transferring registered vehicle ownership.",
    requirements: [
      ["Existing vehicle registration", "The current registration information is required."],
      ["Seller identification", "Identification information of the current owner is required."],
      ["Buyer identification", "Identification information of the new owner is required."],
      ["Ownership transfer document", "The applicable transfer documentation must be submitted."],
      ["Vehicle information", "The vehicle identification information must be provided."],
      ["Inspection information", "Applicable vehicle inspection information must be provided."],
      ["Transfer application", "The ownership transfer application must be completed."]
    ],
    instructions: [
      ["Prepare ownership documents", "Prepare the documents required for the transfer."],
      ["Provide buyer and seller information", "Provide accurate information for both parties."],
      ["Submit transfer request", "Submit the ownership transfer request."],
      ["Complete registration", "Complete the applicable transfer and registration process."]
    ],
    phrases: [
      ["en", "Vehicle Ownership Transfer"],
      ["am", "የተሽከርካሪ ባለቤትነት ማስተላለፍ"],
      ["om", "Abbummaa konkolaataa dabarsuu"]
    ]
  },
  {
    name: "Landholding Certificate",
    slug: "landholding-certificate",
    description:
      "Landholding documentation service administered according to the applicable Ethiopian land administration system.",
    requirements: [
      ["Applicant identification", "The applicant's identity must be established."],
      ["Land information", "Information identifying the landholding must be provided."],
      ["Landholding record", "The application must correspond with the applicable land record."],
      ["Survey information", "Applicable land measurement or survey information may be required."],
      ["Ownership or holding information", "The applicable landholding information must be established."],
      ["Application", "The landholding certificate request must be completed."],
      ["Supporting documents", "Documents required by the responsible land administration authority must be submitted."]
    ],
    instructions: [
      ["Identify landholding", "Provide the information identifying the landholding."],
      ["Submit documents", "Submit the documents requested by the responsible authority."],
      ["Verification", "Allow the land record and applicant information to be verified."],
      ["Receive certificate", "Receive the applicable landholding documentation."]
    ],
    phrases: [
      ["en", "Landholding Certificate"],
      ["am", "የይዞታ ማረጋገጫ"],
      ["om", "Ragaa qabiyyee lafaa"]
    ]
  },
  {
    name: "Landholding Information Update",
    slug: "landholding-information-update",
    description:
      "Service for updating applicable landholding information.",
    requirements: [
      ["Existing land record", "The existing land record must be identified."],
      ["Applicant identification", "Valid identification information is required."],
      ["Requested change", "The requested change to the land record must be specified."],
      ["Supporting evidence", "Evidence supporting the requested update must be provided."],
      ["Land information", "Information identifying the affected land must be provided."],
      ["Application", "The update application must be completed."],
      ["Verification", "The information submitted is subject to verification."]
    ],
    instructions: [
      ["Identify record", "Identify the landholding record to be updated."],
      ["Provide evidence", "Submit evidence supporting the requested change."],
      ["Submit application", "Submit the land information update request."],
      ["Complete verification", "Complete the applicable verification process."]
    ],
    phrases: [
      ["en", "Landholding Information Update"],
      ["am", "የይዞታ መረጃ ማሻሻያ"],
      ["om", "Odeeffannoo qabiyyee lafaa haaromsuu"]
    ]
  },
  {
    name: "Police Clearance Certificate",
    slug: "police-clearance-certificate",
    description:
      "Service for requesting a police clearance or criminal record certificate from the responsible Ethiopian authority.",
    requirements: [
      ["Identification document", "The applicant must provide identification information."],
      ["Applicant information", "Required personal information must be provided."],
      ["Application", "The certificate request must be completed."],
      ["Purpose information", "Where required, the purpose of the certificate must be identified."],
      ["Photograph or biometric information", "Required identification or biometric information may be collected."],
      ["Payment", "Applicable service charges must be paid where required."],
      ["Supporting information", "Additional information requested by the responsible authority must be provided."]
    ],
    instructions: [
      ["Prepare identification", "Prepare the required identification information."],
      ["Submit request", "Submit the police clearance request."],
      ["Complete verification", "Complete any required identity verification."],
      ["Receive certificate", "Receive the certificate according to the applicable procedure."]
    ],
    phrases: [
      ["en", "Police Clearance Certificate"],
      ["am", "የፖሊስ ማስረጃ"],
      ["om", "Ragaa poolisii"]
    ]
  },
  {
    name: "Document Authentication",
    slug: "document-authentication",
    description:
      "Authentication of applicable documents through the responsible Ethiopian government authority.",
    requirements: [
      ["Original document", "The original document must be presented or submitted as required."],
      ["Applicant identification", "Valid identification information is required."],
      ["Document information", "The document must be clearly identifiable."],
      ["Issuing authority information", "Information identifying the issuing authority may be required."],
      ["Application", "The authentication request must be completed."],
      ["Supporting documents", "Supporting documents may be required depending on the document type."],
      ["Payment", "The applicable authentication fee must be paid where required."]
    ],
    instructions: [
      ["Prepare original", "Prepare the original document requiring authentication."],
      ["Complete application", "Complete the authentication application."],
      ["Submit document", "Submit the document through the responsible authority."],
      ["Receive authenticated document", "Collect or receive the authenticated document after processing."]
    ],
    phrases: [
      ["en", "Document Authentication"],
      ["am", "የሰነድ ማረጋገጫ"],
      ["om", "Ragaa mirkaneessuu"]
    ]
  },
  {
    name: "Notarial Service",
    slug: "notarial-service",
    description:
      "Notarial documentation service for applicable legal documents and declarations.",
    requirements: [
      ["Identification", "The person requesting the notarial service must provide identification."],
      ["Original document", "The original document must be presented where required."],
      ["Document details", "The information requiring notarization must be provided."],
      ["Parties information", "Information concerning the parties must be provided."],
      ["Witness information", "Witness information may be required for applicable documents."],
      ["Application", "The applicable notarial request must be completed."],
      ["Applicable fee", "The applicable service fee must be paid."]
    ],
    instructions: [
      ["Prepare document", "Prepare the document requiring the notarial service."],
      ["Provide identification", "Provide valid identification."],
      ["Complete notarization", "Complete the applicable notarial verification."],
      ["Receive document", "Receive the notarized document."]
    ],
    phrases: [
      ["en", "Notarial Service"],
      ["am", "የኖተሪ አገልግሎት"],
      ["om", "Tajaajila notarii"]
    ]
  },
  {
    name: "Tax Clearance Certificate",
    slug: "tax-clearance-certificate",
    description:
      "Service for obtaining applicable tax clearance documentation.",
    requirements: [
      ["TIN", "The taxpayer identification number is required."],
      ["Taxpayer information", "Current taxpayer information must be available."],
      ["Tax filing information", "Applicable tax declarations must be up to date."],
      ["Tax payment information", "Applicable tax obligations must be addressed."],
      ["Application", "The tax clearance request must be submitted."],
      ["Identification", "Identification information may be required."],
      ["Supporting documents", "Additional documents may be required for the taxpayer category."]
    ],
    instructions: [
      ["Review tax status", "Ensure the taxpayer record is current."],
      ["Resolve outstanding obligations", "Address applicable outstanding tax obligations."],
      ["Submit request", "Submit the tax clearance request."],
      ["Receive certificate", "Receive the applicable tax clearance document."]
    ],
    phrases: [
      ["en", "Tax Clearance Certificate"],
      ["am", "የግብር ክሊራንስ"],
      ["om", "Ragaa qulqullina gibiraa"]
    ]
  },
  {
    name: "Tax Declaration Filing",
    slug: "tax-declaration-filing",
    description:
      "Filing of applicable tax declarations with the Ethiopian tax administration.",
    requirements: [
      ["TIN", "The taxpayer identification number is required."],
      ["Tax period", "The applicable tax period must be identified."],
      ["Taxpayer financial information", "Required financial information must be provided."],
      ["Tax records", "Relevant records required for the declaration must be available."],
      ["Declaration form", "The applicable declaration must be completed."],
      ["Supporting documents", "Supporting records may be required."],
      ["Payment information", "Applicable tax payment information must be provided."]
    ],
    instructions: [
      ["Identify tax period", "Select the applicable tax period."],
      ["Prepare records", "Prepare the records required for the declaration."],
      ["Submit declaration", "Submit the tax declaration."],
      ["Complete payment", "Pay the applicable tax obligation where required."]
    ],
    phrases: [
      ["en", "Tax Declaration Filing"],
      ["am", "የግብር ማስታወቂያ ማቅረብ"],
      ["om", "Ibsa gibiraa galchuu"]
    ]
  },
  {
    name: "Import License",
    slug: "import-license",
    description:
      "Applicable licensing service for businesses importing goods into Ethiopia.",
    requirements: [
      ["Business registration", "The importer must provide applicable business registration information."],
      ["Commercial registration", "Applicable commercial registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Import activity information", "The intended import activity must be identified."],
      ["Applicant identification", "Identification information of the applicant is required."],
      ["Supporting documents", "Documents required for the applicable import activity must be provided."],
      ["Application", "The applicable import licensing request must be completed."]
    ],
    instructions: [
      ["Confirm business status", "Ensure the business registration information is current."],
      ["Prepare import information", "Prepare information concerning the intended import activity."],
      ["Submit application", "Submit the applicable licensing request."],
      ["Complete approval process", "Complete the applicable review and approval process."]
    ],
    phrases: [
      ["en", "Import License"],
      ["am", "የገቢ ንግድ ፈቃድ"],
      ["om", "Hayyama galtee"]
    ]
  },
  {
    name: "Export Registration",
    slug: "export-registration",
    description:
      "Registration and applicable authorization service for exporters.",
    requirements: [
      ["Business registration", "Applicable business registration information is required."],
      ["Commercial registration", "Applicable commercial registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Export activity", "The intended export activity must be identified."],
      ["Applicant information", "Required applicant information must be provided."],
      ["Product information", "Information about the goods intended for export must be provided where applicable."],
      ["Supporting documents", "Applicable supporting documents must be submitted."]
    ],
    instructions: [
      ["Prepare business information", "Prepare the current business registration information."],
      ["Identify export activity", "Provide information about the intended export activity."],
      ["Submit application", "Submit the applicable export registration request."],
      ["Complete authorization", "Complete the applicable authorization process."]
    ],
    phrases: [
      ["en", "Export Registration"],
      ["am", "የወጪ ንግድ ምዝገባ"],
      ["om", "Galmee al-ergii"]
    ]
  },
  {
    name: "Construction Permit",
    slug: "construction-permit",
    description:
      "Permit service for construction projects subject to applicable Ethiopian building and urban regulations.",
    requirements: [
      ["Applicant identification", "The applicant or property holder must provide identification."],
      ["Land or property information", "Information establishing the property or land must be provided."],
      ["Site information", "The construction site must be identified."],
      ["Building design", "Applicable architectural or engineering drawings must be submitted."],
      ["Structural information", "Required structural design information must be provided."],
      ["Professional information", "Information concerning responsible professionals may be required."],
      ["Permit application", "The construction permit application must be completed."]
    ],
    instructions: [
      ["Identify property", "Provide the applicable property and site information."],
      ["Prepare designs", "Prepare the required technical drawings."],
      ["Submit application", "Submit the construction permit application."],
      ["Complete review", "Complete the applicable technical and administrative review."]
    ],
    phrases: [
      ["en", "Construction Permit"],
      ["am", "የግንባታ ፈቃድ"],
      ["om", "Hayyama ijaarsaa"]
    ]
  },
  {
    name: "Building Occupancy Permit",
    slug: "building-occupancy-permit",
    description:
      "Applicable permit or certification process for occupancy of a completed building.",
    requirements: [
      ["Construction permit information", "The applicable construction permit information is required."],
      ["Property information", "The building and property must be identifiable."],
      ["Completion information", "Information concerning completion of the construction must be provided."],
      ["Inspection", "The completed building may be subject to the applicable inspection."],
      ["Safety information", "Applicable safety compliance information must be provided."],
      ["Applicant identification", "The applicant or responsible party must be identified."],
      ["Application", "The occupancy request must be completed."]
    ],
    instructions: [
      ["Confirm completion", "Ensure the building is ready for the applicable inspection."],
      ["Submit documents", "Submit the required completion and property information."],
      ["Complete inspection", "Complete the applicable building inspection."],
      ["Receive authorization", "Receive the applicable occupancy documentation after approval."]
    ],
    phrases: [
      ["en", "Building Occupancy Permit"],
      ["am", "የህንፃ መጠቀሚያ ፈቃድ"],
      ["om", "Hayyama itti fayyadama gamoo"]
    ]
  },
  {
    name: "Environmental Impact Assessment Approval",
    slug: "environmental-impact-assessment-approval",
    description:
      "Environmental assessment and approval service for projects subject to applicable Ethiopian environmental requirements.",
    requirements: [
      ["Project information", "The project and its proposed activities must be described."],
      ["Project location", "The project location must be identified."],
      ["Environmental assessment document", "The applicable environmental assessment documentation must be submitted."],
      ["Environmental impact information", "Potential environmental impacts must be addressed."],
      ["Mitigation information", "Applicable mitigation measures must be provided."],
      ["Applicant information", "The project proponent must be identified."],
      ["Application", "The environmental approval request must be submitted."]
    ],
    instructions: [
      ["Prepare project information", "Prepare complete project information."],
      ["Prepare assessment", "Prepare the applicable environmental assessment documentation."],
      ["Submit application", "Submit the assessment and application."],
      ["Complete review", "Participate in the applicable environmental review process."]
    ],
    phrases: [
      ["en", "Environmental Impact Assessment Approval"],
      ["am", "የአካባቢ ተፅዕኖ ግምገማ ማጽደቂያ"],
      ["om", "Mirkaneessa madaallii dhiibbaa naannoo"]
    ]
  },
  {
    name: "Food Establishment License",
    slug: "food-establishment-license",
    description:
      "Licensing service for applicable food establishments.",
    requirements: [
      ["Business registration", "Applicable business registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Premises information", "The food establishment premises must be identified."],
      ["Food safety information", "Required food safety information must be provided."],
      ["Applicant identification", "The applicant or responsible person must be identified."],
      ["Inspection", "The premises may be subject to the applicable inspection."],
      ["Application", "The food establishment license application must be completed."]
    ],
    instructions: [
      ["Prepare premises", "Prepare the establishment according to applicable requirements."],
      ["Submit application", "Submit the licensing application."],
      ["Complete inspection", "Complete the applicable inspection."],
      ["Receive license", "Receive the license after the applicable approval process."]
    ],
    phrases: [
      ["en", "Food Establishment License"],
      ["am", "የምግብ ተቋም ፈቃድ"],
      ["om", "Hayyama dhaabbata nyaataa"]
    ]
  },
  {
    name: "Pharmacy License",
    slug: "pharmacy-license",
    description:
      "Licensing service for pharmacies and applicable pharmaceutical establishments.",
    requirements: [
      ["Business information", "Applicable business registration information is required."],
      ["Premises information", "The pharmacy premises must be identified."],
      ["Responsible professional", "The responsible qualified professional must be identified."],
      ["Professional credentials", "Applicable professional credentials must be provided."],
      ["Facility information", "Required facility information must be submitted."],
      ["Inspection", "The premises may be subject to regulatory inspection."],
      ["Application", "The applicable pharmacy license application must be completed."]
    ],
    instructions: [
      ["Prepare premises", "Prepare the pharmacy premises according to applicable requirements."],
      ["Provide professional information", "Provide the required responsible professional information."],
      ["Submit application", "Submit the license application."],
      ["Complete inspection", "Complete the applicable regulatory inspection."]
    ],
    phrases: [
      ["en", "Pharmacy License"],
      ["am", "የፋርማሲ ፈቃድ"],
      ["om", "Hayyama mana qorichaa"]
    ]
  },
  {
    name: "Private Health Facility License",
    slug: "private-health-facility-license",
    description:
      "Licensing service for applicable private health facilities.",
    requirements: [
      ["Facility information", "Information about the proposed health facility must be provided."],
      ["Business information", "Applicable business registration information must be provided."],
      ["Responsible professional", "The responsible health professional must be identified."],
      ["Professional credentials", "Required professional credentials must be provided."],
      ["Facility standards", "The facility must satisfy applicable requirements."],
      ["Inspection", "The facility may be inspected by the responsible authority."],
      ["Application", "The health facility license application must be completed."]
    ],
    instructions: [
      ["Prepare facility", "Prepare the facility according to applicable health requirements."],
      ["Prepare professional information", "Provide the required professional credentials."],
      ["Submit application", "Submit the licensing application."],
      ["Complete inspection", "Complete the applicable inspection process."]
    ],
    phrases: [
      ["en", "Private Health Facility License"],
      ["am", "የግል ጤና ተቋም ፈቃድ"],
      ["om", "Hayyama dhaabbata fayyaa dhuunfaa"]
    ]
  },
  {
    name: "Professional Health License",
    slug: "professional-health-license",
    description:
      "Professional licensing service for eligible health professionals.",
    requirements: [
      ["Professional qualification", "The applicant must provide the applicable professional qualification."],
      ["Educational credential", "Relevant educational documentation must be provided."],
      ["Professional registration information", "Required professional registration information must be provided."],
      ["Identification", "Valid identification information is required."],
      ["Application", "The professional license application must be completed."],
      ["Supporting documents", "Applicable supporting documents must be submitted."],
      ["Payment", "Applicable licensing fees must be paid."]
    ],
    instructions: [
      ["Prepare credentials", "Prepare the relevant professional and educational credentials."],
      ["Complete application", "Complete the professional licensing application."],
      ["Submit documents", "Submit the required supporting documents."],
      ["Complete licensing", "Complete the applicable professional licensing process."]
    ],
    phrases: [
      ["en", "Professional Health License"],
      ["am", "የጤና ባለሙያ ፈቃድ"],
      ["om", "Hayyama ogeessa fayyaa"]
    ]
  },
  {
    name: "Teacher Professional Registration",
    slug: "teacher-professional-registration",
    description:
      "Professional registration service for eligible teachers and education professionals.",
    requirements: [
      ["Educational credential", "The applicant must provide the applicable educational qualification."],
      ["Professional information", "Required teaching professional information must be provided."],
      ["Identification", "Valid identification information is required."],
      ["Employment information", "Applicable employment information may be required."],
      ["Professional experience", "Where applicable, professional experience information must be provided."],
      ["Application", "The registration application must be completed."],
      ["Supporting documents", "Required supporting documents must be submitted."]
    ],
    instructions: [
      ["Prepare credentials", "Prepare the relevant educational credentials."],
      ["Provide professional information", "Provide the requested professional information."],
      ["Submit application", "Submit the professional registration request."],
      ["Complete verification", "Complete the applicable verification process."]
    ],
    phrases: [
      ["en", "Teacher Professional Registration"],
      ["am", "የመምህራን ሙያ ምዝገባ"],
      ["om", "Galmee ogeessa barsiisotaa"]
    ]
  },
  {
    name: "Higher Education Admission",
    slug: "higher-education-admission",
    description:
      "Admission-related service for higher education applicants in Ethiopia.",
    requirements: [
      ["Entrance examination information", "Applicable examination information must be provided."],
      ["Admission information", "The applicant must provide the information requested for admission."],
      ["Educational record", "Applicable secondary education information must be provided."],
      ["Applicant identification", "Required applicant identification information must be provided."],
      ["Program selection", "The applicant must select or be assigned the applicable program."],
      ["Application information", "The admission application must be completed."],
      ["Supporting documents", "Documents required by the applicable institution or admission process must be submitted."]
    ],
    instructions: [
      ["Review admission information", "Review the applicable admission information."],
      ["Provide applicant details", "Provide accurate applicant information."],
      ["Select program", "Select the applicable program where selection is required."],
      ["Complete admission", "Follow the applicable admission instructions."]
    ],
    phrases: [
      ["en", "Higher Education Admission"],
      ["am", "የከፍተኛ ትምህርት መግቢያ"],
      ["om", "Seensa barnoota olaanaa"]
    ]
  },
  {
    name: "TVET Admission",
    slug: "tvet-admission",
    description:
      "Admission service for technical and vocational education and training.",
    requirements: [
      ["Applicant information", "Required applicant information must be provided."],
      ["Educational information", "The applicant's applicable educational background must be provided."],
      ["Identification", "Required identification information must be provided."],
      ["Program selection", "The applicant must identify the intended TVET program where applicable."],
      ["Admission information", "The applicable admission information must be provided."],
      ["Application", "The TVET admission application must be completed."],
      ["Supporting documents", "Required supporting educational documents must be submitted."]
    ],
    instructions: [
      ["Review programs", "Review the available TVET programs."],
      ["Prepare documents", "Prepare the required educational and identification information."],
      ["Submit application", "Submit the admission application."],
      ["Follow admission process", "Follow the applicable admission instructions."]
    ],
    phrases: [
      ["en", "TVET Admission"],
      ["am", "የቴክኒክና ሙያ ትምህርት መግቢያ"],
      ["om", "Seensa TVET"]
    ]
  },
  {
    name: "School Transfer",
    slug: "school-transfer",
    description:
      "Administrative service for applicable student school transfers.",
    requirements: [
      ["Student information", "The student's identification and school information must be provided."],
      ["Current school information", "Information concerning the current school must be provided."],
      ["Receiving school information", "Information concerning the receiving school must be provided."],
      ["Transfer reason", "The applicable reason for transfer must be provided where required."],
      ["Academic record", "The applicable academic record may be required."],
      ["Parent or guardian information", "Parent or guardian information may be required for minors."],
      ["Application", "The applicable transfer request must be completed."]
    ],
    instructions: [
      ["Provide student information", "Provide accurate student information."],
      ["Provide school information", "Identify the current and receiving school."],
      ["Submit request", "Submit the transfer request."],
      ["Complete approval", "Complete the applicable school or education authority approval process."]
    ],
    phrases: [
      ["en", "School Transfer"],
      ["am", "የትምህርት ቤት ዝውውር"],
      ["om", "Jijjiirraa mana barumsaa"]
    ]
  },
  {
    name: "Public Examination Certificate Verification",
    slug: "public-examination-certificate-verification",
    description:
      "Verification-related service for applicable Ethiopian public examination certificates.",
    requirements: [
      ["Examination certificate", "The examination certificate information must be provided."],
      ["Candidate information", "The candidate's identifying information must be provided."],
      ["Admission or candidate number", "The applicable examination or admission number must be provided."],
      ["Examination year", "The examination year must be identified."],
      ["Applicant identification", "Applicant identification information may be required."],
      ["Application information", "The verification request must be completed."],
      ["Supporting information", "Additional information required for verification must be provided."]
    ],
    instructions: [
      ["Prepare certificate information", "Prepare the information printed on the certificate."],
      ["Submit verification", "Submit the verification request through the responsible authority."],
      ["Complete verification", "Allow the examination record to be checked."],
      ["Receive result", "Receive the verification result."]
    ],
    phrases: [
      ["en", "Public Examination Certificate Verification"],
      ["am", "የፈተና ማስረጃ ማረጋገጫ"],
      ["om", "Mirkaneessa ragaa qormaataa"]
    ]
  },
  {
    name: "Professional Certificate Verification",
    slug: "professional-certificate-verification",
    description:
      "Verification of applicable professional certificates and credentials.",
    requirements: [
      ["Certificate", "The professional certificate must be identified."],
      ["Applicant information", "Required applicant information must be provided."],
      ["Issuing institution", "The institution that issued the certificate must be identified."],
      ["Certificate number", "The certificate or registration number must be provided where applicable."],
      ["Identification", "Applicant identification information may be required."],
      ["Application", "The verification request must be completed."],
      ["Supporting information", "Additional information required for verification must be provided."]
    ],
    instructions: [
      ["Prepare certificate", "Prepare the certificate information."],
      ["Submit request", "Submit the verification request."],
      ["Institution verification", "Allow the issuing institution or responsible authority to verify the record."],
      ["Receive result", "Receive the verification result."]
    ],
    phrases: [
      ["en", "Professional Certificate Verification"],
      ["am", "የሙያ ማስረጃ ማረጋገጫ"],
      ["om", "Mirkaneessa ragaa ogummaa"]
    ]
  },
  {
    name: "Telecommunication SIM Registration",
    slug: "telecommunication-sim-registration",
    description:
      "Subscriber identification and SIM registration service through the applicable Ethiopian telecommunications process.",
    requirements: [
      ["Identification", "The subscriber must provide the required identification information."],
      ["Subscriber information", "Required subscriber information must be provided."],
      ["Mobile number", "The applicable mobile number or SIM information must be provided."],
      ["Biometric verification", "Biometric verification may be required according to the registration process."],
      ["Registration information", "The subscriber registration information must be completed."],
      ["Verification", "The submitted identity information is subject to verification."],
      ["Accurate information", "Subscriber information must be accurate."]
    ],
    instructions: [
      ["Prepare identification", "Prepare the required identification information."],
      ["Submit registration", "Complete the applicable SIM registration process."],
      ["Complete verification", "Complete identity or biometric verification where required."],
      ["Confirm registration", "Confirm that the subscriber information is correctly registered."]
    ],
    phrases: [
      ["en", "SIM Registration"],
      ["am", "ሲም ምዝገባ"],
      ["om", "Galmee SIM"]
    ]
  },
  {
    name: "Telecommunication Service Registration",
    slug: "telecommunication-service-registration",
    description:
      "Registration for applicable telecommunications services.",
    requirements: [
      ["Customer identification", "The customer must provide the required identification."],
      ["Customer information", "Required customer information must be provided."],
      ["Contact information", "Applicable contact information must be provided."],
      ["Service selection", "The requested telecommunications service must be identified."],
      ["Account information", "Required account information must be provided."],
      ["Application information", "The applicable service request must be completed."],
      ["Verification", "Customer information may be subject to verification."]
    ],
    instructions: [
      ["Select service", "Select the telecommunications service required."],
      ["Provide information", "Provide accurate customer information."],
      ["Complete verification", "Complete applicable identity verification."],
      ["Activate service", "Complete the applicable service activation process."]
    ],
    phrases: [
      ["en", "Telecommunication Service Registration"],
      ["am", "የቴሌኮሙኒኬሽን አገልግሎት ምዝገባ"],
      ["om", "Galmee tajaajila telekoomii"]
    ]
  },
  {
    name: "Electricity Connection Application",
    slug: "electricity-connection-application",
    description:
      "Application for electricity connection through the applicable Ethiopian electric utility service.",
    requirements: [
      ["Applicant identification", "The applicant must provide identification information."],
      ["Service address", "The location requiring electricity service must be identified."],
      ["Property information", "Applicable property or occupancy information must be provided."],
      ["Contact information", "Required contact information must be provided."],
      ["Connection information", "Required connection information must be provided."],
      ["Application", "The electricity connection application must be completed."],
      ["Applicable payment", "Required connection charges must be paid where applicable."]
    ],
    instructions: [
      ["Identify premises", "Provide the service location."],
      ["Submit application", "Submit the electricity connection request."],
      ["Complete assessment", "Complete any applicable technical assessment."],
      ["Complete connection", "Complete the applicable connection process."]
    ],
    phrases: [
      ["en", "Electricity Connection Application"],
      ["am", "የኤሌክትሪክ ግንኙነት ማመልከቻ"],
      ["om", "Iyyata walitti hidhaa ibsaa"]
    ]
  },
  {
    name: "Water Service Connection",
    slug: "water-service-connection",
    description:
      "Application for water service connection through the applicable water utility.",
    requirements: [
      ["Applicant identification", "The applicant must provide identification information."],
      ["Service address", "The property requiring water service must be identified."],
      ["Property information", "Applicable property information must be provided."],
      ["Contact information", "Required contact information must be provided."],
      ["Connection information", "The requested water connection information must be provided."],
      ["Application", "The water connection application must be completed."],
      ["Applicable charges", "Required connection charges must be paid where applicable."]
    ],
    instructions: [
      ["Identify property", "Provide the service location."],
      ["Submit request", "Submit the water connection request."],
      ["Complete technical assessment", "Complete any applicable technical assessment."],
      ["Complete connection", "Complete the applicable connection process."]
    ],
    phrases: [
      ["en", "Water Service Connection"],
      ["am", "የውሃ ግንኙነት አገልግሎት"],
      ["om", "Walitti hidhaa tajaajila bishaanii"]
    ]
  },
  {
    name: "Postal Service Registration",
    slug: "postal-service-registration",
    description:
      "Registration for applicable Ethiopian postal services.",
    requirements: [
      ["Customer identification", "The customer must provide required identification."],
      ["Customer information", "Required customer information must be provided."],
      ["Address information", "The applicable postal address information must be provided."],
      ["Contact information", "Required contact information must be provided."],
      ["Service selection", "The required postal service must be identified."],
      ["Application", "The applicable postal service request must be completed."],
      ["Payment", "Applicable postal service charges must be paid."]
    ],
    instructions: [
      ["Select service", "Select the required postal service."],
      ["Provide information", "Provide the required customer and address information."],
      ["Submit request", "Submit the service request."],
      ["Complete payment", "Pay applicable service charges."]
    ],
    phrases: [
      ["en", "Postal Service Registration"],
      ["am", "የፖስታ አገልግሎት ምዝገባ"],
      ["om", "Galmee tajaajila poostaa"]
    ]
  },
  {
    name: "Public Procurement Supplier Registration",
    slug: "public-procurement-supplier-registration",
    description:
      "Registration service for suppliers participating in applicable Ethiopian public procurement processes.",
    requirements: [
      ["Business registration", "The supplier must provide applicable business registration information."],
      ["Commercial registration", "Applicable commercial registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Supplier information", "The supplier's business information must be provided."],
      ["Contact information", "Required supplier contact information must be provided."],
      ["Supporting documents", "Required supplier documents must be submitted."],
      ["Application", "The supplier registration application must be completed."]
    ],
    instructions: [
      ["Prepare company information", "Prepare current company registration information."],
      ["Prepare supplier documents", "Prepare the documents required for supplier registration."],
      ["Submit registration", "Submit the supplier registration request."],
      ["Maintain information", "Keep registered supplier information current."]
    ],
    phrases: [
      ["en", "Public Procurement Supplier Registration"],
      ["am", "የመንግስት ግዥ አቅራቢ ምዝገባ"],
      ["om", "Galmee dhiyeessaa bittaa mootummaa"]
    ]
  },
  {
    name: "Social Protection Program Registration",
    slug: "social-protection-program-registration",
    description:
      "Registration for applicable social protection programs in Ethiopia.",
    requirements: [
      ["Applicant information", "The applicant's personal information must be provided."],
      ["Household information", "Applicable household information must be provided."],
      ["Identification", "Available identification information must be provided."],
      ["Residence information", "The applicant's residence information must be provided."],
      ["Socioeconomic information", "Information required for program eligibility assessment must be provided."],
      ["Application", "The applicable social protection application must be completed."],
      ["Verification", "Submitted information is subject to the applicable verification process."]
    ],
    instructions: [
      ["Provide household information", "Provide accurate household information."],
      ["Submit application", "Submit the applicable program registration request."],
      ["Complete assessment", "Complete the applicable household or eligibility assessment."],
      ["Follow program process", "Follow the instructions of the responsible social protection authority."]
    ],
    phrases: [
      ["en", "Social Protection Program Registration"],
      ["am", "የማህበራዊ ጥበቃ ፕሮግራም ምዝገባ"],
      ["om", "Galmee sagantaa eegumsa hawaasaa"]
    ]
  },
  {
    name: "Agricultural Land Registration",
    slug: "agricultural-land-registration",
    description:
      "Agricultural landholding registration under the applicable Ethiopian rural land administration system.",
    requirements: [
      ["Applicant identification", "The applicant's identity must be established."],
      ["Land location", "The agricultural land location must be identified."],
      ["Landholding information", "Information concerning the landholding must be provided."],
      ["Land measurement information", "Applicable land measurement information must be provided."],
      ["Community or local record", "Applicable local land records may be used for verification."],
      ["Application", "The land registration application must be completed."],
      ["Supporting evidence", "Applicable evidence concerning the landholding must be provided."]
    ],
    instructions: [
      ["Identify land", "Identify the agricultural landholding."],
      ["Provide documents", "Provide the applicable landholding information."],
      ["Complete verification", "Complete the applicable local land administration verification."],
      ["Receive registration record", "Receive the applicable land registration documentation."]
    ],
    phrases: [
      ["en", "Agricultural Land Registration"],
      ["am", "የግብርና መሬት ምዝገባ"],
      ["om", "Galmee lafa qonnaa"]
    ]
  },
  {
    name: "Cooperative Registration",
    slug: "cooperative-registration",
    description:
      "Registration service for cooperatives established under applicable Ethiopian cooperative regulations.",
    requirements: [
      ["Cooperative name", "The proposed cooperative name must be provided."],
      ["Founding members", "Information about founding members must be provided."],
      ["Cooperative purpose", "The purpose and activities of the cooperative must be identified."],
      ["Bylaws", "Applicable cooperative bylaws or founding documents must be prepared."],
      ["Address", "The cooperative address must be provided."],
      ["Management information", "Required information about the cooperative management must be provided."],
      ["Application", "The cooperative registration application must be completed."]
    ],
    instructions: [
      ["Prepare founding documents", "Prepare the applicable founding documents."],
      ["Provide member information", "Provide information about founding members."],
      ["Submit registration", "Submit the cooperative registration request."],
      ["Complete registration", "Complete the applicable review and registration process."]
    ],
    phrases: [
      ["en", "Cooperative Registration"],
      ["am", "የህብረት ሥራ ማህበር ምዝገባ"],
      ["om", "Galmee waldaa hojii gamtaa"]
    ]
  },
  {
    name: "Association Registration",
    slug: "association-registration",
    description:
      "Registration service for civil society organizations and associations subject to applicable Ethiopian regulation.",
    requirements: [
      ["Organization name", "The proposed organization name must be provided."],
      ["Founding members", "Required founding member information must be provided."],
      ["Organization objectives", "The organization's objectives must be stated."],
      ["Founding documents", "Required founding documents must be prepared."],
      ["Address", "The organization's address must be provided."],
      ["Governance information", "Required governance information must be provided."],
      ["Application", "The registration application must be completed."]
    ],
    instructions: [
      ["Prepare founding documents", "Prepare the organization's founding documents."],
      ["Provide organizational information", "Provide the required objectives and governance information."],
      ["Submit application", "Submit the registration application."],
      ["Complete review", "Complete the applicable registration review."]
    ],
    phrases: [
      ["en", "Association Registration"],
      ["am", "የማህበር ምዝገባ"],
      ["om", "Galmee waldaa"]
    ]
  },
  {
    name: "Trademark Registration",
    slug: "trademark-registration",
    description:
      "Registration service for trademarks under the applicable Ethiopian intellectual property system.",
    requirements: [
      ["Applicant information", "The applicant's identity and contact information must be provided."],
      ["Trademark representation", "The mark to be registered must be clearly identified."],
      ["Goods or services classification", "The goods or services associated with the mark must be identified."],
      ["Applicant address", "The applicable address information must be provided."],
      ["Application", "The trademark application must be completed."],
      ["Supporting documents", "Required supporting documents must be submitted."],
      ["Applicable fee", "The applicable registration fee must be paid."]
    ],
    instructions: [
      ["Identify trademark", "Prepare the trademark representation."],
      ["Identify goods or services", "Specify the goods or services associated with the mark."],
      ["Submit application", "Submit the trademark registration application."],
      ["Complete examination", "Follow the applicable examination and registration process."]
    ],
    phrases: [
      ["en", "Trademark Registration"],
      ["am", "የንግድ ምልክት ምዝገባ"],
      ["om", "Galmee mallattoo daldalaa"]
    ]
  },
  {
    name: "Patent Application",
    slug: "patent-application",
    description:
      "Patent application service under the applicable Ethiopian intellectual property framework.",
    requirements: [
      ["Applicant information", "The applicant information must be provided."],
      ["Invention description", "A description of the invention must be submitted."],
      ["Claims", "The applicable patent claims must be provided."],
      ["Technical information", "Technical information required to understand the invention must be provided."],
      ["Drawings", "Drawings must be submitted where required."],
      ["Application", "The patent application must be completed."],
      ["Applicable fee", "The applicable filing fee must be paid."]
    ],
    instructions: [
      ["Prepare invention information", "Prepare the technical information describing the invention."],
      ["Prepare application", "Complete the patent application."],
      ["Submit documents", "Submit the required patent documents."],
      ["Complete examination", "Follow the applicable examination process."]
    ],
    phrases: [
      ["en", "Patent Application"],
      ["am", "የፓተንት ማመልከቻ"],
      ["om", "Iyyata paatentii"]
    ]
  },
  {
    name: "Customs Declaration",
    slug: "customs-declaration",
    description:
      "Customs declaration service for goods imported into or exported from Ethiopia.",
    requirements: [
      ["Importer or exporter information", "The applicable trader information must be provided."],
      ["Commercial documents", "Required commercial documentation must be submitted."],
      ["Goods information", "Information describing the goods must be provided."],
      ["Customs declaration", "The applicable customs declaration must be completed."],
      ["Transport information", "Applicable transport and shipment information must be provided."],
      ["Supporting documents", "Required customs supporting documents must be submitted."],
      ["Tax and duty information", "Applicable customs duties and taxes must be addressed."]
    ],
    instructions: [
      ["Prepare commercial documents", "Prepare the documents required for the shipment."],
      ["Declare goods", "Provide accurate information about the goods."],
      ["Submit declaration", "Submit the applicable customs declaration."],
      ["Complete customs process", "Complete the applicable customs assessment and clearance process."]
    ],
    phrases: [
      ["en", "Customs Declaration"],
      ["am", "የጉምሩክ መግለጫ"],
      ["om", "Ibsa gumurukii"]
    ]
  },
  {
    name: "Customs Clearance",
    slug: "customs-clearance",
    description:
      "Clearance service for goods subject to Ethiopian customs procedures.",
    requirements: [
      ["Customs declaration", "The applicable customs declaration must be available."],
      ["Commercial invoice", "The applicable commercial invoice must be submitted."],
      ["Transport document", "The applicable transport document must be submitted."],
      ["Goods information", "Accurate information about the goods must be provided."],
      ["Importer or exporter information", "Trader information must be provided."],
      ["Customs assessment", "Applicable customs assessment must be completed."],
      ["Payment", "Applicable customs duties and taxes must be paid."]
    ],
    instructions: [
      ["Submit customs documents", "Submit the documents required for customs clearance."],
      ["Complete assessment", "Complete the applicable customs assessment."],
      ["Pay obligations", "Pay applicable customs duties and taxes."],
      ["Complete clearance", "Complete the customs release process."]
    ],
    phrases: [
      ["en", "Customs Clearance"],
      ["am", "የጉምሩክ ማስለቀቂያ"],
      ["om", "Qulqullina gumurukii"]
    ]
  },
  {
    name: "Vehicle Import Clearance",
    slug: "vehicle-import-clearance",
    description:
      "Customs and applicable clearance process for imported vehicles.",
    requirements: [
      ["Vehicle import documents", "Documents identifying the imported vehicle must be submitted."],
      ["Commercial invoice", "The applicable invoice must be provided."],
      ["Transport documents", "Applicable transport documents must be provided."],
      ["Vehicle identification", "Vehicle identification information must be provided."],
      ["Importer information", "Importer information must be provided."],
      ["Customs declaration", "The applicable customs declaration must be completed."],
      ["Customs payment", "Applicable customs duties and taxes must be paid."]
    ],
    instructions: [
      ["Prepare vehicle documents", "Prepare the documents identifying the imported vehicle."],
      ["Submit declaration", "Submit the applicable customs declaration."],
      ["Complete assessment", "Complete customs assessment."],
      ["Complete payment and release", "Complete applicable payments and the customs release process."]
    ],
    phrases: [
      ["en", "Vehicle Import Clearance"],
      ["am", "የተሽከርካሪ ገቢ ማስለቀቂያ"],
      ["om", "Qulqullina galtee konkolaataa"]
    ]
  },
  {
    name: "Marriage Registration",
    slug: "marriage-registration",
    description:
      "Registration of a marriage through the applicable Ethiopian civil registration authority.",
    requirements: [
      ["Identification documents", "The persons entering the marriage must provide applicable identification."],
      ["Personal information", "Required personal information must be provided."],
      ["Marriage information", "The information required for marriage registration must be provided."],
      ["Witness information", "Applicable witness information may be required."],
      ["Registration application", "The marriage registration request must be completed."],
      ["Eligibility information", "Information required to establish eligibility for registration must be provided."],
      ["Supporting documents", "Additional documents may be required according to the circumstances."]
    ],
    instructions: [
      ["Prepare identification", "Prepare the required identification documents."],
      ["Provide marriage information", "Provide accurate marriage registration information."],
      ["Complete registration", "Complete the applicable civil registration procedure."],
      ["Receive registration record", "Receive the applicable marriage registration documentation."]
    ],
    phrases: [
      ["en", "Marriage Registration"],
      ["am", "የጋብቻ ምዝገባ"],
      ["om", "Galmee gaa'elaa"]
    ]
  },
  {
    name: "Birth Registration",
    slug: "birth-registration",
    description:
      "Registration of births through the applicable Ethiopian civil registration system.",
    requirements: [
      ["Child information", "The child's required birth and personal information must be provided."],
      ["Parent information", "Required parent information must be provided."],
      ["Birth information", "The date and circumstances of birth required for registration must be provided."],
      ["Applicant identification", "The registering person's identification information may be required."],
      ["Registration information", "The birth registration information must be completed."],
      ["Supporting documentation", "Applicable birth-related supporting documentation may be required."],
      ["Verification", "The submitted information is subject to the applicable registration verification."]
    ],
    instructions: [
      ["Prepare birth information", "Prepare accurate information about the birth."],
      ["Provide parent information", "Provide the required parent information."],
      ["Submit registration", "Submit the birth registration request."],
      ["Receive registration record", "Receive the applicable birth registration documentation."]
    ],
    phrases: [
      ["en", "Birth Registration"],
      ["am", "የልደት ምዝገባ"],
      ["om", "Galmee dhalootaa"]
    ]
  },
  {
    name: "Death Registration",
    slug: "death-registration",
    description:
      "Registration of death through the applicable Ethiopian civil registration authority.",
    requirements: [
      ["Deceased information", "Required information about the deceased must be provided."],
      ["Death information", "The date and circumstances of death required for registration must be provided."],
      ["Applicant information", "The person registering the death must provide the required information."],
      ["Identification information", "Applicable identification information must be provided."],
      ["Medical information", "Applicable medical death information may be required."],
      ["Registration application", "The death registration request must be completed."],
      ["Supporting documents", "Applicable supporting documents must be submitted."]
    ],
    instructions: [
      ["Prepare death information", "Prepare accurate information concerning the death."],
      ["Submit registration", "Submit the death registration request."],
      ["Provide supporting information", "Provide information requested for verification."],
      ["Complete registration", "Complete the applicable civil registration process."]
    ],
    phrases: [
      ["en", "Death Registration"],
      ["am", "የሞት ምዝገባ"],
      ["om", "Galmee du'aa"]
    ]
  },
  {
    name: "Residence Registration",
    slug: "residence-registration",
    description:
      "Registration of applicable residence information through the responsible local authority.",
    requirements: [
      ["Identification", "The resident must provide applicable identification information."],
      ["Residence address", "The current residence address must be provided."],
      ["Applicant information", "Required personal information must be provided."],
      ["Residence evidence", "Applicable evidence of residence may be required."],
      ["Household information", "Applicable household information may be required."],
      ["Application", "The residence registration request must be completed."],
      ["Verification", "The submitted residence information may be verified."]
    ],
    instructions: [
      ["Provide address", "Provide the current residence address."],
      ["Submit identification", "Provide the required identification information."],
      ["Submit registration", "Submit the residence registration request."],
      ["Complete verification", "Complete the applicable local verification process."]
    ],
    phrases: [
      ["en", "Residence Registration"],
      ["am", "የመኖሪያ ምዝገባ"],
      ["om", "Galmee jireenyaa"]
    ]
  },
  {
    name: "Residence Certificate",
    slug: "residence-certificate",
    description:
      "Certificate service for documenting registered residence information.",
    requirements: [
      ["Identification", "Valid identification information is required."],
      ["Residence address", "The registered residence address must be provided."],
      ["Residence registration", "The residence must be registered according to the applicable local process."],
      ["Applicant information", "Required applicant information must be provided."],
      ["Application", "The certificate request must be completed."],
      ["Verification", "The residence information may be verified."],
      ["Supporting information", "Additional information requested by the responsible authority must be provided."]
    ],
    instructions: [
      ["Identify residence", "Provide the registered residence information."],
      ["Submit request", "Submit the certificate request."],
      ["Complete verification", "Complete any required verification."],
      ["Receive certificate", "Receive the residence certificate."]
    ],
    phrases: [
      ["en", "Residence Certificate"],
      ["am", "የመኖሪያ ማረጋገጫ"],
      ["om", "Ragaa jireenyaa"]
    ]
  },
  {
    name: "Single Status Certificate",
    slug: "single-status-certificate",
    description:
      "Civil status documentation service for applicable proof of marital status.",
    requirements: [
      ["Identification", "The applicant must provide identification."],
      ["Personal information", "Required personal information must be provided."],
      ["Civil status information", "The applicant's applicable civil status information must be provided."],
      ["Registration information", "Applicable civil registration information must be available."],
      ["Application", "The certificate request must be completed."],
      ["Verification", "Civil status information may be verified."],
      ["Supporting documents", "Additional supporting documents may be required."]
    ],
    instructions: [
      ["Prepare identification", "Prepare valid identification."],
      ["Submit request", "Submit the civil status certificate request."],
      ["Complete verification", "Complete applicable civil registration verification."],
      ["Receive certificate", "Receive the applicable certificate."]
    ],
    phrases: [
      ["en", "Single Status Certificate"],
      ["am", "የነጠላ ሁኔታ ማረጋገጫ"],
      ["om", "Ragaa haala gaa'elaa"]
    ]
  },
  {
    name: "Name Change Registration",
    slug: "name-change-registration",
    description:
      "Civil registration service for applicable changes to registered personal names.",
    requirements: [
      ["Identification", "The applicant must provide valid identification."],
      ["Existing name information", "The currently registered name must be identified."],
      ["Requested name", "The requested new name must be provided."],
      ["Reason for change", "The applicable reason for the requested change must be provided."],
      ["Supporting evidence", "Supporting evidence required by the responsible authority must be provided."],
      ["Application", "The name change application must be completed."],
      ["Verification", "The request is subject to applicable verification and approval."]
    ],
    instructions: [
      ["Identify current record", "Provide the existing registered name information."],
      ["Provide requested change", "Provide the requested new name and applicable reason."],
      ["Submit evidence", "Submit supporting documentation."],
      ["Complete approval", "Complete the applicable civil registration review."]
    ],
    phrases: [
      ["en", "Name Change Registration"],
      ["am", "የስም ለውጥ ምዝገባ"],
      ["om", "Galmee maqaa jijjiiruu"]
    ]
  },
  {
    name: "Copy of Civil Registration Record",
    slug: "copy-of-civil-registration-record",
    description:
      "Service for obtaining an applicable copy or extract from a civil registration record.",
    requirements: [
      ["Applicant identification", "The applicant must provide identification information."],
      ["Record type", "The type of civil registration record must be identified."],
      ["Record subject information", "Information identifying the person whose record is requested must be provided."],
      ["Registration information", "Available registration information should be provided."],
      ["Application", "The record request must be completed."],
      ["Authorization where applicable", "Authorization may be required when requesting another person's record."],
      ["Payment", "Applicable service charges must be paid where required."]
    ],
    instructions: [
      ["Identify record", "Identify the civil registration record required."],
      ["Provide identification", "Provide the required applicant information."],
      ["Submit request", "Submit the record copy request."],
      ["Receive record", "Receive the applicable copy or extract."]
    ],
    phrases: [
      ["en", "Copy of Civil Registration Record"],
      ["am", "የሲቪል ምዝገባ መዝገብ ቅጂ"],
      ["om", "Garagalcha galmee siivilii"]
    ]
  },
  {
    name: "Tourism Business License",
    slug: "tourism-business-license",
    description:
      "Licensing service for applicable tourism businesses in Ethiopia.",
    requirements: [
      ["Business registration", "Applicable business registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Tourism activity", "The intended tourism business activity must be identified."],
      ["Premises information", "Applicable premises information must be provided."],
      ["Applicant information", "The applicant or responsible person must be identified."],
      ["Supporting documents", "Required tourism business documents must be submitted."],
      ["Application", "The tourism business license application must be completed."]
    ],
    instructions: [
      ["Identify tourism activity", "Identify the tourism business activity."],
      ["Prepare documents", "Prepare the required business and premises documents."],
      ["Submit application", "Submit the tourism business licensing request."],
      ["Complete assessment", "Complete the applicable licensing assessment."]
    ],
    phrases: [
      ["en", "Tourism Business License"],
      ["am", "የቱሪዝም ንግድ ፈቃድ"],
      ["om", "Hayyama daldala turizimii"]
    ]
  },
  {
    name: "Hotel License",
    slug: "hotel-license",
    description:
      "Applicable licensing service for hotel and accommodation establishments.",
    requirements: [
      ["Business registration", "Applicable business registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Hotel premises", "The hotel premises must be identified."],
      ["Facility information", "Required facility information must be provided."],
      ["Applicant information", "The applicant or responsible person must be identified."],
      ["Inspection", "The establishment may be subject to applicable inspection."],
      ["Application", "The hotel licensing application must be completed."]
    ],
    instructions: [
      ["Prepare premises", "Prepare the accommodation establishment."],
      ["Submit documents", "Submit the applicable business and facility information."],
      ["Complete inspection", "Complete the applicable inspection."],
      ["Complete licensing", "Complete the licensing process."]
    ],
    phrases: [
      ["en", "Hotel License"],
      ["am", "የሆቴል ፈቃድ"],
      ["om", "Hayyama hoteelaa"]
    ]
  },
  {
    name: "Employment Agency License",
    slug: "employment-agency-license",
    description:
      "Licensing service for applicable employment agencies.",
    requirements: [
      ["Business registration", "Applicable business registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Agency information", "Information about the employment agency must be provided."],
      ["Responsible person", "The responsible person must be identified."],
      ["Office information", "The applicable office or premises information must be provided."],
      ["Supporting documents", "Required supporting documents must be submitted."],
      ["Application", "The employment agency license application must be completed."]
    ],
    instructions: [
      ["Prepare agency information", "Prepare the agency's business and responsible-person information."],
      ["Prepare premises information", "Provide information about the agency office."],
      ["Submit application", "Submit the licensing application."],
      ["Complete approval", "Complete the applicable licensing review."]
    ],
    phrases: [
      ["en", "Employment Agency License"],
      ["am", "የሥራ ስምሪት ኤጀንሲ ፈቃድ"],
      ["om", "Hayyama ejensii hojii"]
    ]
  },
  {
    name: "Labor Organization Registration",
    slug: "labor-organization-registration",
    description:
      "Registration service for applicable labor organizations.",
    requirements: [
      ["Organization name", "The proposed labor organization name must be provided."],
      ["Founding members", "Required founding member information must be provided."],
      ["Organization objectives", "The objectives of the organization must be identified."],
      ["Founding documents", "Applicable founding documents must be prepared."],
      ["Address", "The organization's address must be provided."],
      ["Governance information", "Required governance information must be provided."],
      ["Application", "The registration application must be completed."]
    ],
    instructions: [
      ["Prepare founding documents", "Prepare the organization's founding documents."],
      ["Provide member information", "Provide required founding member information."],
      ["Submit registration", "Submit the registration application."],
      ["Complete review", "Complete the applicable registration review."]
    ],
    phrases: [
      ["en", "Labor Organization Registration"],
      ["am", "የሠራተኛ ማህበር ምዝገባ"],
      ["om", "Galmee waldaa hojjettootaa"]
    ]
  },
  {
    name: "Trade Union Registration",
    slug: "trade-union-registration",
    description:
      "Registration service for eligible trade unions under applicable Ethiopian labor law.",
    requirements: [
      ["Union name", "The proposed trade union name must be provided."],
      ["Members information", "Required member information must be provided."],
      ["Founding documents", "Applicable founding documents must be prepared."],
      ["Union objectives", "The union's objectives must be identified."],
      ["Address", "The union's address must be provided."],
      ["Leadership information", "Required leadership information must be provided."],
      ["Application", "The registration application must be completed."]
    ],
    instructions: [
      ["Prepare founding documents", "Prepare the applicable founding documents."],
      ["Provide member information", "Provide the required member information."],
      ["Submit registration", "Submit the trade union registration request."],
      ["Complete registration", "Complete the applicable review and registration process."]
    ],
    phrases: [
      ["en", "Trade Union Registration"],
      ["am", "የሠራተኛ ማህበር ምዝገባ"],
      ["om", "Galmee yuuniyinii hojjettootaa"]
    ]
  },
  {
    name: "Public Service Employment Application",
    slug: "public-service-employment-application",
    description:
      "Application service for eligible positions in Ethiopian public institutions.",
    requirements: [
      ["Applicant information", "Required personal information must be provided."],
      ["Identification", "Required identification information must be provided."],
      ["Educational credentials", "Applicable educational credentials must be provided."],
      ["Professional credentials", "Applicable professional credentials must be provided where required."],
      ["Work experience", "Required work experience information must be provided."],
      ["Application", "The position application must be completed."],
      ["Supporting documents", "Required supporting documents must be submitted."]
    ],
    instructions: [
      ["Review vacancy", "Review the applicable public service vacancy information."],
      ["Prepare credentials", "Prepare the required educational and professional information."],
      ["Submit application", "Submit the application through the designated process."],
      ["Follow recruitment process", "Follow the applicable examination or recruitment instructions."]
    ],
    phrases: [
      ["en", "Public Service Employment Application"],
      ["am", "የመንግስት ሥራ ማመልከቻ"],
      ["om", "Iyyata hojii mootummaa"]
    ]
  },
  {
    name: "Vehicle Technical Inspection",
    slug: "vehicle-technical-inspection",
    description:
      "Technical inspection service for vehicles subject to Ethiopian vehicle inspection requirements.",
    requirements: [
      ["Vehicle", "The vehicle must be presented for inspection."],
      ["Vehicle registration", "The applicable vehicle registration information must be provided."],
      ["Owner information", "The vehicle owner's information must be provided."],
      ["Identification", "Applicable identification information may be required."],
      ["Inspection request", "The inspection request must be completed."],
      ["Vehicle identification", "The vehicle identification information must correspond with the registration."],
      ["Applicable fee", "The applicable inspection fee must be paid."]
    ],
    instructions: [
      ["Prepare vehicle", "Present the vehicle for the applicable inspection."],
      ["Provide registration", "Provide the vehicle registration information."],
      ["Complete inspection", "Complete the technical inspection."],
      ["Receive result", "Receive the applicable inspection result."]
    ],
    phrases: [
      ["en", "Vehicle Technical Inspection"],
      ["am", "የተሽከርካሪ ቴክኒክ ምርመራ"],
      ["om", "Qorannoo teeknikaa konkolaataa"]
    ]
  },
  {
    name: "Road Transport Operator License",
    slug: "road-transport-operator-license",
    description:
      "Applicable licensing service for road transport operators.",
    requirements: [
      ["Business registration", "Applicable business registration information is required."],
      ["Transport activity", "The intended transport activity must be identified."],
      ["Vehicle information", "Applicable vehicle information must be provided."],
      ["Applicant information", "The operator or responsible person must be identified."],
      ["Insurance information", "Applicable insurance information must be provided."],
      ["Supporting documents", "Required transport documents must be submitted."],
      ["Application", "The transport operator license application must be completed."]
    ],
    instructions: [
      ["Identify transport activity", "Identify the transport activity for which the license is requested."],
      ["Prepare vehicle information", "Prepare the required vehicle information."],
      ["Submit application", "Submit the operator licensing request."],
      ["Complete assessment", "Complete the applicable regulatory assessment."]
    ],
    phrases: [
      ["en", "Road Transport Operator License"],
      ["am", "የመንገድ ትራንስፖርት ኦፕሬተር ፈቃድ"],
      ["om", "Hayyama opareetara geejjibaa daandii"]
    ]
  },
  {
    name: "Construction Contractor Registration",
    slug: "construction-contractor-registration",
    description:
      "Registration and classification service for construction contractors.",
    requirements: [
      ["Business registration", "Applicable business registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Company information", "The contractor's company information must be provided."],
      ["Technical personnel", "Required technical personnel information must be provided."],
      ["Equipment information", "Applicable construction equipment information may be required."],
      ["Experience information", "Applicable project experience information must be provided."],
      ["Application", "The contractor registration application must be completed."]
    ],
    instructions: [
      ["Prepare company documents", "Prepare current company registration information."],
      ["Prepare technical information", "Prepare required professional and equipment information."],
      ["Submit application", "Submit the contractor registration application."],
      ["Complete classification", "Complete the applicable assessment and classification process."]
    ],
    phrases: [
      ["en", "Construction Contractor Registration"],
      ["am", "የግንባታ ተቋራጭ ምዝገባ"],
      ["om", "Galmee kontiraaktara ijaarsaa"]
    ]
  },
  {
    name: "Consulting Firm Registration",
    slug: "consulting-firm-registration",
    description:
      "Registration service for eligible professional consulting firms.",
    requirements: [
      ["Business registration", "Applicable business registration information is required."],
      ["TIN", "Taxpayer identification information is required."],
      ["Consulting activity", "The consulting activity must be identified."],
      ["Professional personnel", "Applicable professional personnel information must be provided."],
      ["Professional credentials", "Required professional credentials must be provided."],
      ["Office information", "The applicable business address must be provided."],
      ["Application", "The registration application must be completed."]
    ],
    instructions: [
      ["Identify consulting activity", "Identify the consulting service offered."],
      ["Prepare credentials", "Prepare the required professional credentials."],
      ["Submit registration", "Submit the consulting firm registration request."],
      ["Complete verification", "Complete the applicable registration verification."]
    ],
    phrases: [
      ["en", "Consulting Firm Registration"],
      ["am", "የአማካሪ ድርጅት ምዝገባ"],
      ["om", "Galmee dhaabbata gorsaa"]
    ]
  }
];

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.phrase.deleteMany();
  await prisma.instruction.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.service.deleteMany();

  for (const service of services) {
    await prisma.service.create({
      data: {
        name: service.name,
        slug: service.slug,
        description: service.description,
        isActive: true,
        requirements: {
          create: service.requirements.map(
            ([title, description], index) => ({
              title,
              description,
              sortOrder: index + 1
            })
          )
        },
        instructions: {
          create: service.instructions.map(
            ([title, content], index) => ({
              title,
              content,
              sortOrder: index + 1
            })
          )
        },
        phrases: {
          create: service.phrases.map(
            ([language, phrase], index) => ({
              language,
              phrase,
              sortOrder: index + 1
            })
          )
        }
      }
    });
  }

  console.log(`Seed completed: ${services.length} services created.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });