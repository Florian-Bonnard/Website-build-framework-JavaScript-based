import {Utilities} from "./import.js";
import {ExtendedMap,ExtendedSet} from "./../structures/export.js";
import RegularExpression from "./../regularExpression/regularExpression.class.js";
import Lexer from "./lexer.class.js";
import LexerSymbol from "./lexerSymbol.class.js";

const namespace = Utilities.buildNamespace();

export default class LexerWrapper {
	constructor(lexer,lexerSymbolToKeywords = {}) {
		const state = namespace(this);
		state.lexer = lexer;
		state.lexerSymbolToKeywords = parseLexerSymbolsToKeywords(lexerSymbolToKeywords);
	}
	
	getSymbols(string) {
		const {lexer,lexerSymbolToKeywords} = namespace(this);
		const symbols = lexer.getSymbols(string);
		
		if(symbols === null) {
			return null;
		}
		
		const symbolsToKeywords = [];
		
		for(const lexerSymbol of symbols) {
			const {string,symbol} = lexerSymbol;
			symbolsToKeywords.push(!lexerSymbolToKeywords.has(symbol) || !lexerSymbolToKeywords.get(symbol).has(string) ? lexerSymbol : new LexerSymbol(string,string));
		}
		
		return symbolsToKeywords;
	}
	
	get lexer() {
		return namespace(this).lexer;
	}
}

function parseLexerSymbolsToKeywords(lexerSymbolToKeywordsSource) {
	const lexerSymbolToKeywords = new ExtendedMap();
	
	for(const key of Reflect.ownKeys(lexerSymbolToKeywordsSource)) {
		lexerSymbolToKeywords.set(key,new ExtendedSet(Utilities.arrayInput(lexerSymbolToKeywordsSource[key])));
	}
	
	return lexerSymbolToKeywords;
}