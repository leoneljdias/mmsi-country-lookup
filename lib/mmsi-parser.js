const midsData = require('./mids.json');

/**
 * Extract MID (Maritime Identification Digit) from MMSI
 * @param {string|number} mmsi - The MMSI number
 * @returns {string|null} - The 3-digit MID or null if invalid
 */
function getMIDFromMMSI(mmsi) {
  if (!mmsi) return null;

  const mmsiStr = mmsi.toString().trim();
  if (mmsiStr.length !== 9 || !/^\d{9}$/.test(mmsiStr)) {
    return null;
  }

  // Special cases where MID is not in first 3 digits:
  // - Coast stations (00MIDXXXX): MID is digits 3-5
  // - SAR aircraft (111MIDXXX): MID is digits 4-6
  // - AIS aids (99MIDXXXX): MID is digits 3-5
  const pattern = /^(00|111|99)([A-Za-z0-9]{3})/;
  const match = mmsiStr.match(pattern);
  return match ? match[2] : undefined;
}

/**
 * Check if MMSI is valid based on ITU-R M.585-9
 * @param {string|number} mmsi - The MMSI number
 * @returns {boolean} - True if valid
 */
function isValidMMSI(mmsi) {
  if (!mmsi) return false;

  const mmsiStr = mmsi.toString().trim();
  if (mmsiStr.length !== 9 || !/^\d{9}$/.test(mmsiStr)) {
    return false;
  }

  const firstDigit = parseInt(mmsiStr[0]);

  // Validity rules per M.585-9:
  // 1. Ships: 2-7 (MIDXXXXXX)
  // 2. Coast stations: 00MIDXXXX
  // 3. SAR aircraft: 111MIDXXX
  // 4. AIS aids: 99MIDXXXX
  // 5. Craft associated with parent ship: 98MIDXXXX
  // 6. Handheld VHF: 8MIDXXXXX
  // 7. Special devices (AIS-SART, EPIRB-AIS, etc.): 9702XXXXX, 9722XXXXX, 9742XXXXX
  return (
    (firstDigit >= 2 && firstDigit <= 7) || // Ships
    mmsiStr.startsWith('00') || // Coast stations
    mmsiStr.startsWith('111') || // SAR aircraft
    mmsiStr.startsWith('99') || // AIS aids
    mmsiStr.startsWith('98') || // Craft associated with parent ship
    mmsiStr.startsWith('8') || // Handheld VHF
    /^97[024]\d{6}$/.test(mmsiStr) // AIS-SART (970), MOB (972), EPIRB-AIS (974)
  );
}

/**
 * Get country information from MMSI
 * @param {string|number} mmsi - The MMSI number
 * @returns {object} - Country information object
 */
function getCountryFromMMSI(mmsi) {
  const result = {
    mmsi: mmsi ? mmsi.toString() : '',
    mid: null,
    alpha2: null,
    alpha3: null,
    country: null,
    valid: false,
    type: null, // Added to indicate MMSI type
  };

  if (!isValidMMSI(mmsi)) {
    return result;
  }

  const mmsiStr = mmsi.toString();
  const mid = getMIDFromMMSI(mmsiStr);

  // Determine MMSI type
  if (mmsiStr.startsWith('00')) {
    result.type = 'coast_station';
  } else if (mmsiStr.startsWith('111')) {
    result.type = 'sar_aircraft';
  } else if (mmsiStr.startsWith('99')) {
    result.type = 'ais_aid_to_navigation';
  } else if (mmsiStr.startsWith('98')) {
    result.type = 'craft_associated_with_parent_ship';
  } else if (mmsiStr.startsWith('8')) {
    result.type = 'handheld_vhf';
  } else if (/^97[024]/.test(mmsiStr)) {
    result.type = 'emergency_device';
  } else {
    result.type = 'ship';
  }

  // For emergency devices (AIS-SART, MOB, EPIRB-AIS), no country association
  if (result.type === 'emergency_device') {
    result.valid = true;
    return result;
  }

  // For other types, lookup MID in database
  const countryData = midsData[mid];
  if (countryData) {
    result.mid = mid;
    result.alpha2 = countryData[0];
    result.alpha3 = countryData[1];
    result.country = countryData[3];
    result.valid = true;
  }

  return result;
}

module.exports = {
  getCountryFromMMSI,
  isValidMMSI,
  getMIDFromMMSI,
};
