import {Utilities} from "./import.js";

const namespace = Utilities.buildNamespace();

export default class LexerSymbol {
	constructor(symbol,string) {
		const state = namespace(this);
		state.string = string;
		state.symbol = symbol;
	}
	
	get string() {
		return namespace(this).string;
	}
	
	get symbol() {
		return namespace(this).symbol;
	}
}