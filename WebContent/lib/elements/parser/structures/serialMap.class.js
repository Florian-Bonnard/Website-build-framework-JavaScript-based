import {Utilities} from "./import.js";
import ExtendedMap from "./extendedMap.class.js";
import SerialSet from "./serialSet.class.js";

const namespace = Utilities.buildNamespace();

export default class SerialMap {
	constructor(init) {
		const state = namespace(this);
		state.keys = new SerialSet();
		state.map = new ExtendedMap();
		if(init !== undefined) {
			for(const [key,value] of init) {
				this.set(key,value);
			}
		}
	}
	
	randomElement() {
		if(this.size === 0) {
			return null;
		}
		return this.entries().next().value;
	}
	
	get size() {
		return namespace(this).keys.size;
	}

	set(key,value) {
		const {keys,map} = namespace(this);
		keys.add(key);
		map.set(key.toSerial(),value);
		return this;
	}
	
	get(key) {
		const {keys,map} = namespace(this);
		if(keys.has(key)) {
			return map.get(key.toSerial());
		}
	}
	
	getKey(key) {
		const keys = namespace(this).keys;
		if(keys.has(key)) {
			return keys.get(key);
		}
	}

	delete(key) {
		const {keys,map} = namespace(this);
		const res = keys.has(key);
		if(res) {
			map.delete(key.toSerial());
			keys.delete(key);
		}
		return res;
	}
	
	has(key) {
		return namespace(this).keys.has(key);
	}
	
	keys() {
		return namespace(this).keys.values();
	}
	
	entries() {
		return entries(this);
	}
	
	values() {
		return namespace(this).map.values();
	}
	
	clear() {
		return namespace(this).keys.clear();
		return namespace(this).map.clear();
	}
	
	forEach(fnCallback,thisArg) {
		for(const [key,value] of this.entries()) {
			fnCallback.apply(thisArg,[key,value,this]);
		}
	}
}
SerialMap.prototype[Symbol.iterator] = SerialMap.prototype.entries;

function* entries(serialMap) {
	const state = namespace(serialMap);
	
	for(const key of serialMap.keys()) {
		yield [key,serialMap.get(key)];
	}
}