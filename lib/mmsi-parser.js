const midsData = require("./mids.json");

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

  return mmsiStr.substring(0, 3);
}

/**
 * Check if MMSI is valid
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
  return firstDigit >= 2 && firstDigit <= 7;
}

/**
 * Get country information from MMSI
 * @param {string|number} mmsi - The MMSI number
 * @returns {object} - Country information object
 */
function getCountryFromMMSI(mmsi) {
  const result = {
    mmsi: mmsi ? mmsi.toString() : "",
    mid: null,
    alpha2: null,
    alpha3: null,
    country: null,
    valid: false,
  };

  if (!isValidMMSI(mmsi)) {
    return result;
  }

  const mid = getMIDFromMMSI(mmsi);
  if (!mid) {
    return result;
  }

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
