import {Utilities} from "./import.js";

function equal(elem,set,Type) {
	return elem.isSuperset(set) && set.isSuperset(elem);
}
	
function isSuperset(elem,subset) {
	for(const value of subset) {
		if(!elem.has(value)) {
			return false;
		}
	}
	return true;
}

function union(Type,elem,set,overwrite = false) {
	let newSet = elem;
	if(!overwrite) {
		newSet = new Type(elem);
	}
	for(const value of set) {
		newSet.add(value);
	}
	return newSet;
}

function intersection(Type,elem,set,overwrite = false) {
	let newSet;
	if(overwrite) {
		newSet = elem;
		for(const value of elem) {
			if(!set.has(value)) {
				newSet.delete(value);
			}
		}
	} else {
		newSet = new Type();
		for(const value of elem) {
			if(set.has(value)) {
				newSet.add(value);
			}
		}
	}
	return newSet;
}

function difference(Type,elem,set,overwrite = false) {
	let newSet;
	if(overwrite) {
		newSet = elem;
		for(const value of elem) {
			if(set.has(value)) {
				newSet.delete(value);
			}
		}
	} else {
		newSet = new Type();
		for(const value of elem) {
			if(!set.has(value)) {
				newSet.add(value);
			}
		}
	}
	return newSet;
}

export {equal,isSuperset,union,intersection,difference};