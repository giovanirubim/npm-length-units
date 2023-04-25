const metric = {
	name: 'metric',
	units: [{
		singular: 'millimeter',
		plural: 'millimeters',
		symbol: 'mm',
		meters: 0.001,
	}, {
		singular: 'centimeter',
		plural: 'centimeters',
		symbol: 'cm',
		meters: 0.01,
	}, {
		singular: 'meter',
		plural: 'meters',
		symbol: 'm',
		meters: 1,
	}, {
		singular: 'kilometer',
		plural: 'kilometers',
		symbol: 'km',
		meters: 1000,
	}],
};

const imperial = {
	name: 'imperial',
	units: [{
		singular: 'inch',
		plural: 'inches',
		symbol: 'in',
		meters: 0.0254,
	}, {
		singular: 'foot',
		plural: 'feet',
		symbol: 'ft',
		meters: 0.3048,
	}, {
		singular: 'yard',
		plural: 'yards',
		symbol: 'yd',
		meters: 0.9144,
	}, {
		singular: 'mile',
		plural: 'miles',
		symbol: 'mi',
		meters: 1609.344,
	}],
};

const allUnits = [ ...metric.units, ...imperial.units ];

const systems = { metric, imperial };

const regex = {
	suffix: /[a-z]+$/i,
	number: /^[-+]?\d+(\.\d+)?(e[-+]?\d+)?/i,
};

const separate = (value) => {
	value = value.trim();
	const suffix = value.match(regex.suffix)?.[0] ?? null;
	if (suffix !== null) {
		value = value.substring(0, value.length - suffix.length).trim();
	}
	if (!regex.number.test(value)) {
		return null;
	}
	const parsed = Number(value);
	return [ parsed, suffix ];
};

const findUnit = (name) => {
	const lower = name.toLowerCase();
	return allUnits.find(unit => {
		if (unit.singular === lower) return true;
		if (unit.plural === lower) return true;
		if (unit.symbol === lower) return true;
		return false;
	}) ?? null;
};

const findSystem = (name) => {
	const lower = name.toLowerCase();
	return systems[lower] ?? null;
};

const stringify = (value, precision) => {
	return Number(value.toPrecision(precision)).toString();
};

const stringifyWithSystem = (meters, precision, system) => {
	const { units } = system;
	for (let i=units.length - 1;; --i) {
		const unit = units[i];
		if (i === 0 || unit.meters <= meters) {
			return appendSymbol(
				stringify(meters/unit.meters, precision),
				unit.symbol,
			);
		}
	}
};

const appendSymbol = (string, symbol) => {
	return string + ' ' + symbol;
};

export default class LengthUnits {
	constructor({
		system = 'metric',
		defaultUnit = 'meter',
		precision = 10,
	} = {}) {
		if (system !== null) {
			this.system = findSystem(system);
			if (this.system === null) {
				throw new Error(`Could not find system "${JSON.stringify(system)}"`);
			}
		} else {
			this.system = null;
		}
		this.defaultUnit = findUnit(defaultUnit);
		if (this.defaultUnit === null) {
			throw new Error(`Could not find unit "${JSON.stringify(defaultUnit)}"`);
		}
		this.precision = precision;
	}
	parse(string) {
		const separated = separate(string);
		if (separated === null) {
			return NaN;
		}
		const { defaultUnit } = this;
		const [ raw, unitName ] = separated;
		const unit = unitName === null ? defaultUnit : findUnit(unitName);
		if (unit === null) {
			return NaN;
		}
		const conversion = unit.meters/defaultUnit.meters;
		return raw*conversion;
	}
	usingSystem(name) {
		return new LengthUnits({
			system: name,
			defaultUnit: this.defaultUnit.singular,
		});
	}
	usingOnlyUnit(name) {
		return new LengthUnits({
			system: null,
			defaultUnit: name,
		});
	}
	usingUnit(name) {
		return new LengthUnits({
			system: this.system?.name ?? null,
			defaultUnit: name,
		});
	}
	stringify(value, precision = this.precision) {
		const { defaultUnit } = this;
		if (this.system === null) {
			return appendSymbol(stringify(value, precision), defaultUnit.symbol);
		}
		const meters = value*defaultUnit.meters;
		return stringifyWithSystem(meters, precision, this.system);
	}
}
