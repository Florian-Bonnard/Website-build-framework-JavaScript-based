import {Utilities} from "./import.js";
import ExtendedMap from "./extendedMap.class.js"; 

const namespace = Utilities.buildNamespace();

export default class UniqueClassFactory {
	constructor(className) {
		const state = namespace(this);
		state.className = className;
		state.instances = new ExtendedMap();
		this[Symbol.iterator] = this.values;
	}
	
	randomElement() {
		if(this.size === 0) {
			return null;
		}
		return this.values().next().value;
	}
	
	get size() {
		return namespace(this).instances.size;
	}
	
	add(...args) {
		const {className,instances} = namespace(this);
		
		const newInstance = new className(...args);
		
		const serial = newInstance.toSerialUnique();
		if(instances.has(serial)) {
			return instances.get(serial);
		}
		instances.set(serial,newInstance);
		
		return newInstance;
	}
	
	get(...args) {
		const {className,instances} = namespace(this);
		
		const newInstance = new className(...args);

		const serial = newInstance.toSerialUnique();
		if(instances.has(serial)) {
			return instances.get(serial);
		}
		
		return null;
	}
	
	getSerialUnique(serial) {
		return namespace(this).instances.get(serial);
	}
	
	has(instance) {
		return namespace(this).instances.has(instance.toSerialUnique());
	}
	
	hasSerialUnique(serial) {
		return namespace(this).instances.has(serial);
	}
	
	values() {
		return namespace(this).instances.values();
	}
	
	clear() {
		return namespace(this).instances.clear();
	}
}