export const mockMessages = [
  {
    id: '1',
    role: 'user',
    content: 'I want to get a birth certificate.',
    timestamp: '2025-09-25T09:41:00',
  },
  {
    id: '2',
    role: 'bot',
    content:
      'Sure! I can guide you through the process. To get a birth certificate in Ethiopia, you will generally need the following:',
    timestamp: '2025-09-25T09:41:05',
    type: 'documents',
    documents: [
      {
        id: 'doc-1',
        icon: 'IdCard',
        title: "Parent or applicant's valid ID",
        description: 'National ID, Passport or other official ID',
      },
      {
        id: 'doc-2',
        icon: 'FileText',
        title: 'Application form (from the office)',
        description: 'Form is provided at the service office',
      },
      {
        id: 'doc-3',
        icon: 'Calendar',
        title: 'Birth information (date & place)',
        description: 'Full date and place of birth of the person',
      },
      {
        id: 'doc-4',
        icon: 'CreditCard',
        title: 'Payment of required fee',
        description: 'Pay the official fee at the office or bank',
      },
      {
        id: 'doc-5',
        icon: 'Users',
        title: 'Parent/Guardian information',
        description: 'Names of father and mother/guardian',
      },
    ],
    ctaText: 'See full process, fees & office locations',
  },
  {
    id: '3',
    role: 'bot',
    content: 'Would you like to know where to apply or the next steps?',
    timestamp: '2025-09-25T09:41:10',
    type: 'quickActions',
    actions: [
      { id: 'act-1', label: 'Where to apply', action: 'where' },
      { id: 'act-2', label: 'Next steps', action: 'steps' },
      { id: 'act-3', label: 'Fees', action: 'fees' },
    ],
  },
    {
    id: '2b',
    role: 'bot',
    content:
      'Before you can apply for a marriage certificate, you need to have these:',
    timestamp: '2025-09-25T09:41:07',
    type: 'dependencies',
    dependencies: [
      {
        id: 'dep-1',
        icon: 'IdCard',
        name: 'Kebele ID',
        status: 'have', // "have" | "need" | "unsure"
      },
      {
        id: 'dep-2',
        icon: 'FileText',
        name: 'Birth Certificate',
        status: 'need',
      },
      {
        id: 'dep-3',
        icon: 'FileCheck',
        name: 'Unmarried Certificate',
        status: 'unsure',
      },
    ],
    ctaText: 'Guide me through missing ones',
  },
];