import {Utilities} from "./import.js";
import ExtendedMap from "./extendedMap.class.js"; 
import {equal,isSuperset,union,intersection,difference} from "./setOperations.function.js";

const namespace = Utilities.buildNamespace();

export default class SerialSet {
	constructor(init) {
		namespace(this).map = new ExtendedMap();
		if(init !== undefined) {
			for(const value of init) {
				this.add(value);
			}
		}
	}
	
	randomElement() {
		if(this.size === 0) {
			return null;
		}
		return this.values().next().value;
	}
	
	get size() {
		return namespace(this).map.size;
	}

	add(item) {
		return namespace(this).map.set(item.toSerial(),item);
	}
	
	get(item) {
		return namespace(this).map.get(item.toSerial());
	}

	delete(item) {
		return namespace(this).map.delete(item.toSerial());
	}
	
	has(item) {
		return namespace(this).map.has(item.toSerial());
	}
	
	values() {
		return namespace(this).map.values();
	}
	
	clear() {
		return namespace(this).map.clear();
	}
	
	forEach(fnCallback,thisArg) {
		for(const value of this.values()) {
			fnCallback.apply(thisArg,[value,this]);
		}
	}
	
	equal(set) {
		return equal(this,set);
	}
	
	isSuperset(subset) {
		return isSuperset(this,subset);
	}
	
	union(set,overwrite) {
		return union(SerialSet,this,set,overwrite);
	}
	
	intersection(set,overwrite) {
		return intersection(SerialSet,this,set,overwrite);
	}
	
	difference(set,overwrite) {
		return difference(SerialSet,this,set,overwrite);
	}
}
SerialSet.prototype[Symbol.iterator] = SerialSet.prototype.values;