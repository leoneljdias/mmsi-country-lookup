# MMSI Country Lookup

A lightweight library to extract country and type information from Maritime Mobile Service Identity (MMSI) numbers, based on the official ITU-R M.585-9 standard.

MMSI numbers are 9-digit identifiers used by maritime mobile stations (ships, coast stations, SAR aircraft, AIS aids, etc.) in the Automatic Identification System (AIS). The first part of the MMSI, known as the Maritime Identification Digits (MID), indicates the country or geographical area of registration.

📘 **Reference**: [ITU-R Recommendation M.585-9](https://www.itu.int/dms_pubrec/itu-r/rec/m/R-REC-M.585-9-202303-I!!PDF-E.pdf)

## MMSI Formats by Type (ITU-R M.585-9)

| MMSI Type                          | Format          | MID Location |
|-----------------------------------|------------------|--------------|
| Ship                              | MIDXXXXXX        | Digits 1–3   |
| Coast station                     | 00MIDXXXX        | Digits 3–5   |
| SAR aircraft                      | 111MIDXXX        | Digits 4–6   |
| AIS aid to navigation             | 99MIDXXXX        | Digits 3–5   |
| Craft associated with parent ship | 98MIDXXXX        | Digits 3–5   |
| Handheld VHF                      | 8MIDXXXXX        | Digits 2–4   |
| Emergency devices (EPIRB-AIS, AIS-SART, MOB) | 9702XXXXX, 9722XXXXX, 9742XXXXX | No MID |

## Installation

```bash
npm install mmsi-country-lookup
```

## Usage

```javascript
const { getCountryFromMMSI } = require('mmsi-country-lookup');

const ship = getCountryFromMMSI('211476060');      // Regular ship (Germany)
const coast = getCountryFromMMSI('002111234');     // Coast station (Germany)
const aircraft = getCountryFromMMSI('111211123');  // SAR aircraft (Germany)
const aid = getCountryFromMMSI('992110001');       // AIS aid to navigation
const vhf = getCountryFromMMSI('811234567');       // Handheld VHF
const epirb = getCountryFromMMSI('974200001');     // Emergency device (EPIRB-AIS)

console.log(ship);
/*
{
  mmsi: '211476060',
  mid: '211',
  alpha2: 'DE',
  alpha3: 'DEU',
  country: 'Germany',
  valid: true,
  type: 'ship'
}
*/

console.log(epirb);
/*
{
  mmsi: '974200001',
  mid: null,
  alpha2: null,
  alpha3: null,
  country: null,
  valid: true,
  type: 'emergency_device'
}
*/
```

## API

### getCountryFromMMSI(mmsi)

**Parameters:**
- `mmsi` (`string` | `number`): The 9-digit MMSI number

**Returns:**
- An object with the following properties:
  - `mmsi`: Original input
  - `mid`: Extracted MID (if applicable)
  - `alpha2`: ISO 3166-1 alpha-2 code
  - `alpha3`: ISO 3166-1 alpha-3 code
  - `country`: Full country name
  - `valid`: Whether the MMSI is valid according to ITU-R M.585-9
  - `type`: One of:
    - `ship`
    - `coast_station`
    - `sar_aircraft`
    - `ais_aid_to_navigation`
    - `craft_associated_with_parent_ship`
    - `handheld_vhf`
    - `emergency_device`

### isValidMMSI(mmsi)

Checks if the MMSI is valid under the ITU-R M.585-9 format.

### getMIDFromMMSI(mmsi)

Extracts the Maritime Identification Digits (MID) depending on MMSI type.

## Data Source

This library uses the official MID-country mapping based on ITU-R M.585-9 (March 2023), with ISO 3166 codes and country names.

## License

MIT

Based on [ITU-R M.585-9 Recommendation](https://www.itu.int/dms_pubrec/itu-r/rec/m/R-REC-M.585-9-202303-I!!PDF-E.pdf) and publicly available MID data from the ITU.