const defaultStages = [
  { name: "Applied", stageOrder: 1, isDefault: true },
  { name: "Shortlisted", stageOrder: 2 },
  { name: "Technical Round", stageOrder: 3 },
  { name: "HR Round", stageOrder: 4 },
  { name: "Selected", stageOrder: 5, isFinal: true },
  { name: "Rejected", stageOrder: 6, isFinal: true, isRejectStage: true },
];

export const stages = defaultStages;
