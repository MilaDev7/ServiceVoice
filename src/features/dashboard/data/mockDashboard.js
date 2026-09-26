export const mockDashboard = {
  summary: {
    totalReports: 247,
    avgTimeDays: 2.3,
    extraFeePercent: 18,
    extraDocPercent: 31,
  },
  byService: [
    { id: 'birth', name: 'Birth Certificate', count: 82 },
    { id: 'kebele', name: 'Kebele ID', count: 68 },
    { id: 'marriage', name: 'Marriage Certificate', count: 41 },
    { id: 'death', name: 'Death Certificate', count: 27 },
    { id: 'unmarried', name: 'Unmarried Certificate', count: 18 },
    { id: 'marital', name: 'Marital Status', count: 11 },
  ],
  byWoreda: [
    { id: 'bole', name: 'Bole', count: 94 },
    { id: 'yeka', name: 'Yeka', count: 87 },
    { id: 'akaki', name: 'Akaki Kaliti', count: 66 },
  ],
  byFeedbackType: [
    { id: 'extra_doc', label: 'Extra document requested', percent: 47, color: 'primary' },
    { id: 'extra_fee', label: 'Extra fee / bribe requested', percent: 31, color: 'red' },
    { id: 'delay', label: 'Delayed beyond official time', percent: 18, color: 'yellow' },
    { id: 'good', label: 'Good experience', percent: 4, color: 'green' },
  ],
  lastUpdated: '2025-09-26T09:00:00',
};