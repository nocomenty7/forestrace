export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode === 'UNKNOWN' || countryCode.length !== 2) {
    return '🌐';
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const COUNTRY_NAMES: Record<string, string> = {
  KR: 'South Korea',
  US: 'United States',
  JP: 'Japan',
  CN: 'China',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  BR: 'Brazil',
  CA: 'Canada',
  AU: 'Australia',
  IN: 'India',
  VN: 'Vietnam',
  TH: 'Thailand',
  ID: 'Indonesia',
  PH: 'Philippines',
  SG: 'Singapore',
  MY: 'Malaysia',
  TW: 'Taiwan',
  MX: 'Mexico',
  ES: 'Spain',
  IT: 'Italy',
  NL: 'Netherlands',
  SE: 'Sweden',
  NO: 'Norway',
  FI: 'Finland',
  UNKNOWN: 'Global Traveler',
};

export function getCountryName(countryCode: string): string {
  const code = (countryCode || 'UNKNOWN').toUpperCase();
  return COUNTRY_NAMES[code] || code;
}

// Tree Growth Stage Constants (per tree cycle)
// 1 Tree Cycle = 4,000 Water Drops total
export const WATER_PER_TREE_CYCLE = 4000;

export const STAGE_THRESHOLDS = {
  STAGE_1_TO_2: 100,    // tree1 -> tree2 (Requires 100 water)
  STAGE_2_TO_3: 500,    // tree2 -> tree3 (Requires additional 400 water = total 500)
  STAGE_3_TO_4: 1500,   // tree3 -> tree4 (Requires additional 1,000 water = total 1,500)
  COMPLETE_TREE: 4000,  // tree4 -> Send to Forest 🌲 (Requires additional 2,500 water = total 4,000)
};

export interface TreeStageInfo {
  stage: 1 | 2 | 3 | 4;
  completedTrees: number;
  currentCycleWater: number;
  nextStageWater: number;
  stageProgressPercent: number;
  stageName: string;
}

export function calculateTreeProgress(totalWaterScore: number): TreeStageInfo {
  const completedTrees = Math.floor(totalWaterScore / WATER_PER_TREE_CYCLE);
  const currentCycleWater = totalWaterScore % WATER_PER_TREE_CYCLE;

  let stage: 1 | 2 | 3 | 4 = 1;
  let nextStageWater = STAGE_THRESHOLDS.STAGE_1_TO_2;
  let stageName = 'Sprout';
  let prevThreshold = 0;

  if (currentCycleWater >= STAGE_THRESHOLDS.STAGE_3_TO_4) {
    stage = 4;
    stageName = 'Ancient World Tree';
    prevThreshold = STAGE_THRESHOLDS.STAGE_3_TO_4;
    nextStageWater = STAGE_THRESHOLDS.COMPLETE_TREE;
  } else if (currentCycleWater >= STAGE_THRESHOLDS.STAGE_2_TO_3) {
    stage = 3;
    stageName = 'Sacred Tree';
    prevThreshold = STAGE_THRESHOLDS.STAGE_2_TO_3;
    nextStageWater = STAGE_THRESHOLDS.STAGE_3_TO_4;
  } else if (currentCycleWater >= STAGE_THRESHOLDS.STAGE_1_TO_2) {
    stage = 2;
    stageName = 'Growing Sapling';
    prevThreshold = STAGE_THRESHOLDS.STAGE_1_TO_2;
    nextStageWater = STAGE_THRESHOLDS.STAGE_2_TO_3;
  }

  const waterInCurrentStage = currentCycleWater - prevThreshold;
  const stageTargetWater = nextStageWater - prevThreshold;
  const stageProgressPercent = Math.min(
    100,
    Math.round((waterInCurrentStage / stageTargetWater) * 100)
  );

  return {
    stage,
    completedTrees,
    currentCycleWater,
    nextStageWater,
    stageProgressPercent,
    stageName,
  };
}
