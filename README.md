# length-units (npm-package)

Implements conversions for length units.

## Examples

```javascript
import LengthUnits from '@giovanirubim/length-units';

const lengthUnits = new LengthUnits({
	system: 'imperial',
	defaultUnit: 'feet',
});

console.log(lengthUnits.parse('2 mi')); // Outputs 10560
console.log(lengthUnits.stringify(15840)); // Outputs '3 mi'
```

## LengthUnits constructor arguments

| Field       | Type   | Default  | Description                              |
| ----------- | ------ | -------- | ---------------------------------------- |
| system      | string | 'metric' | System used when stringifying a value    |
| defaultUnit | string | 'meter'  | Output unit when parsing a value         |
| precision   | string | 10       | Precision used when stringifying a value |
