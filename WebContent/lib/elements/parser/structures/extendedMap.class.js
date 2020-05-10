import {Utilities} from "./import.js";

const namespace = Utilities.buildNamespace();

export default class ExtendedMap {
	constructor(init) {
		namespace(this).map = new Map(init);
	}
	
	randomElement() {
		if(this.size === 0) {
			return null;
		}
		return this.entries().next().value;
	}
	
	get size() {
		return namespace(this).map.size;
	}

	set(key,value) {
		const map = namespace(this).map;
		map.set(key,value);
		return this;
	}
	
	get(key) {
		return namespace(this).map.get(key);
	}

	delete(key) {
		return namespace(this).map.delete(key);
	}
	
	has(key) {
		return namespace(this).map.has(key);
	}
	
	keys() {
		return namespace(this).map.keys();
	}
	
	entries() {
		return namespace(this).map.entries();
	}
	
	values() {
		return namespace(this).map.values();
	}
	
	clear() {
		return namespace(this).map.clear();
	}
	
	forEach(fnCallback,thisArg) {
		for(const [key,value] of this.entries()) {
			fnCallback.apply(thisArg,[key,value,this]);
		}
	}
}
ExtendedMap.prototype[Symbol.iterator] = ExtendedMap.prototype.entries;