# MMSI Country Lookup

A library to extract country information from MMSI (Maritime Mobile Service Identity) numbers.

## Installation

```bash
npm install mmsi-country-lookup
```

## Usage

```javascript
const { getCountryFromMMSI } = require('mmsi-country-lookup');

// Example MMSI numbers
const result1 = getCountryFromMMSI('211476060'); // German ship
const result2 = getCountryFromMMSI('368207620'); // US ship
const result3 = getCountryFromMMSI('710123456'); // Brazilian ship

console.log(result1);
// Output: {
//   mmsi: '211476060',
//   mid: '211',
//   alpha2: 'DE',
//   alpha3: 'DEU',
//   country: 'Germany',
//   valid: true
// }
```

## API

### getCountryFromMMSI(mmsi)

**Parameters:**
- `mmsi` (string|number): The 9-digit MMSI number

**Returns:**
- Object with country information:
  - `mmsi`: Original MMSI number
  - `mid`: Maritime Identification Digit (first 3 digits)
  - `alpha2`: ISO 3166-1 alpha-2 country code
  - `alpha3`: ISO 3166-1 alpha-3 country code
  - `country`: Full country name
  - `valid`: Boolean indicating if MMSI is valid

## About MMSI

A Maritime Mobile Service Identity (MMSI) is a 9-digit number used to uniquely identify ships in AIS (Automatic Identification System) broadcasts. The first three digits represent the Maritime Identification Digit (MID), which corresponds to the country where the ship is registered.

## Data Source

This library uses the official Maritime Identification Digits mapping based on ITU Radio Regulations Appendix 43.

## License

MIT