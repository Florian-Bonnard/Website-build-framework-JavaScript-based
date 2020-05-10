import {Utilities} from "./import.js";
import {SerialUtilities} from "./../structures/export.js";
import AutomatonIdSerializer from "./automatonIdSerializer.class.js";

const namespace = Utilities.buildNamespace();

class AutomatonArrow {
	constructor(arrowType) {
		const state = namespace(this);
		state.arrowType = arrowType;
		state.lockPurge = 0;
		state.serial = SerialUtilities.serialBuilder(state.arrowType);
		state.serialUnique = state.serial;
	}
	
	get arrowType() {
		return namespace(this).arrowType;
	}
	
	toSerial() {
		return namespace(this).serial;
	}
	
	toSerialUnique() {
		return namespace(this).serialUnique;
	}
	
	purge() {
		const state = namespace(this);
		const {lockPurge} = state;
		
		if(!lockPurge) {
			state.lockPurge = 1;
		}
	}
}

class AutomatonArrowBuild extends AutomatonArrow {
	constructor(id) {
		super("build");
		const state = namespace(this);
		state.id = id;
		state.serial = SerialUtilities.serialBuilder(AutomatonArrow.prototype.toSerial.apply(this),id);
		state.serialUnique = state.serial;
	}
	
	get id() {
		return namespace(this).id;
	}
}

class AutomatonArrowLetter extends AutomatonArrow {
	constructor(value) {
		super("letter");
		const state = namespace(this);
		state.value = value;
		state.serial = SerialUtilities.serialBuilder(AutomatonArrow.prototype.toSerial.apply(this),value);
		state.serialUnique = state.serial;
	}
	
	get value() {
		return namespace(this).value;
	}
}

class AutomatonArrowClass extends AutomatonArrow {
	constructor(elements,negative) {
		super("class");
		const state = namespace(this);
		state.elements = elements;
		state.negative = negative;
		state.serial = SerialUtilities.serialBuilder(AutomatonArrow.prototype.toSerial.apply(this),SerialUtilities.serialBuilder(...(Array.from(elements).sort())),negative);
		state.serialUnique = state.serial;
	}
	
	get elements() {
		return namespace(this).elements;
	}
	
	get negative() {
		return namespace(this).negative;
	}
}

class AutomatonArrowState extends AutomatonArrow {
	constructor(arrowState,information = []) {
		super("state");
		const state = namespace(this);
		state.information = information;
		state.state = arrowState;
		state.serial = SerialUtilities.serialBuilder(AutomatonArrow.prototype.toSerial.apply(this),arrowState.toSerial());
		state.serialUnique = SerialUtilities.serialBuilder(state.serial,information.join(""));;
	}
	
	get information() {
		return namespace(this).information;
	}
	
	get state() {
		const {lockPurge,state} = namespace(this);
		
		if(!lockPurge) {
			return state;
		}
	}
	
	purge() {
		const state = namespace(this);
		const {lockPurge} = state;
		
		if(!lockPurge) {
			delete(state.state);
			
			state.lockPurge = 1;
		}
	}
}

export {AutomatonArrowBuild,AutomatonArrowLetter,AutomatonArrowClass,AutomatonArrowState};