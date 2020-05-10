import {Utilities} from "./import.js";
import State from "./state.class.js";

function build(update) {
	if(Utilities.DEBUG) {
		if(!Utilities.instanceOf(update,Function)) {
			Utilities.error("build",1,update,"Function");
		}
	}
	
	const state = new State(update);
	return state.update.bind(state);
}

export {build};