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

const COUNTRY_NAMES: Record<string, string> = {
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
