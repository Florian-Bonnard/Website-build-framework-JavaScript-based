import {Utilities} from "./import.js";
import {SerialMap,SerialSet} from "./../structures/export.js";

const namespace = Utilities.buildNamespace();

class AutomatonAbstract {
	constructor() {
		const state = namespace(this);
		state.end = null;
		state.start = null;
		state.states = new SerialMap();
	}
	
	get start() {
		return namespace(this).start;
	}
	
	get end() {
		return namespace(this).end;
	}
	
	get states() {
		return namespace(this).states;
	}
}

class Automaton extends AutomatonAbstract {
	constructor() {
		super();
		const state = namespace(this);
		state.end = new SerialSet();
		state.start = new SerialSet();
	}
}

class AutomatonSingleStart extends AutomatonAbstract {
	constructor() {
		super();
		const state = namespace(this);
		state.end = new SerialSet();
	}
	
	get start() {
		return namespace(this).start;
	}
	set start(state) {
		namespace(this).start = state;
	}
}

class AutomatonSingleEnd extends AutomatonAbstract {
	constructor() {
		super();
		const state = namespace(this);
		state.start = new SerialSet();
	}
	
	get end() {
		return namespace(this).end;
	}
	set end(state) {
		namespace(this).end = state;
	}
}

class AutomatonSingleStartEnd extends AutomatonAbstract {
	constructor() {
		super();
	}
	
	get end() {
		return namespace(this).end;
	}
	set end(state) {
		namespace(this).end = state;
	}
	
	get start() {
		return namespace(this).start;
	}
	set start(state) {
		namespace(this).start = state;
	}
}

export {Automaton,AutomatonSingleStart,AutomatonSingleEnd,AutomatonSingleStartEnd};