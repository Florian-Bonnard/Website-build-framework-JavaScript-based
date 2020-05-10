import {Utilities} from "./import.js";

const namespace = Utilities.buildNamespace();

export default class State {
	constructor(update) {
		const ns = namespace(this);
		ns.state = {};
		ns.update = update.bind(this);
    }
	
	update(params) {
		const ns = namespace(this);
		const state = ns.state;
		const update = ns.update;
		
		for(const e of Reflect.ownKeys(params)) {
			if(!state[e] || state[e].value !== params[e]) {
				state[e] = {value:params[e],isNew:1};
			}
		}

		for(const e of Reflect.ownKeys(state)) {
			const v = state[e];
			if(v.isNew) {
				update(e,v.value,state);
			}
		}
	}
}