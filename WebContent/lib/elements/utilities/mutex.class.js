import * as Utilities from "./utilities.function.js";

const namespace = Utilities.buildNamespace();

export default class Mutex {
	constructor() {
		namespace(this).current = Promise.resolve();
    }
	
	lock() {
		const state = namespace(this);
		let _resolve;
		const p = new Promise((resolve,reject) => {
			_resolve = () => resolve();
		});
		const result = state.current.then((resolve) => {
			return _resolve;
		});
		state.current = p;
		return result;
	}
}