import {Utilities} from "./import.js";
import {equal,isSuperset,union,intersection,difference} from "./setOperations.function.js";

const namespace = Utilities.buildNamespace();

export default class ExtendedSet {
	constructor(init) {
		namespace(this).set = new Set(init);
	}
	
	randomElement() {
		if(this.size === 0) {
			return null;
		}
		return this.values().next().value;
	}
	
	get size() {
		return namespace(this).set.size;
	}

	add(item) {
		return namespace(this).set.add(item);
	}

	delete(item) {
		return namespace(this).set.delete(item);
	}
	
	has(item) {
		return namespace(this).set.has(item);
	}
	
	values() {
		return namespace(this).set.values();
	}
	
	clear() {
		return namespace(this).set.clear();
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
		return union(ExtendedSet,this,set,overwrite);
	}
	
	intersection(set,overwrite) {
		return intersection(ExtendedSet,this,set,overwrite);
	}
	
	difference(set,overwrite) {
		return difference(ExtendedSet,this,set,overwrite);
	}
}
ExtendedSet.prototype[Symbol.iterator] = ExtendedSet.prototype.values;