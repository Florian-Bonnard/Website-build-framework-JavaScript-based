import {Utilities} from "./import.js";
import {ExtendedMap,ExtendedSet} from "./../structures/export.js";
import RegularExpression from "./../regularExpression/regularExpression.class.js";
import LexerSymbol from "./lexerSymbol.class.js";

const namespace = Utilities.buildNamespace();

export default class Lexer {
	constructor(lexer) {
		const state = namespace(this);
		const res = parseLexer(lexer);
		state.lexerSource = lexer;
		state.captureToSymbol = res.captureToSymbol;
		state.lexer = new RegularExpression(res.lexer);
	}
	
	getSymbols(string) {
		const lexer = namespace(this).lexer;
		const captureParseTree = lexer.match(string);
		
		if(captureParseTree === false) {
			return null;
		}
		
		return lexerDFS(this,captureParseTree,string);
	}
	
	get lexerSource() {
		return namespace(this).lexerSource;
	}
	
	static lexerSymbolsToParser(symbols) {
		const build = [];
		
		for(const symbol of symbols) {
			build.push(symbol.symbol);
		}
		
		return build;
	}
	
	static symbolsToString(symbols,startIndex,endIndex) {
		return this.symbolsToStringArray(symbols,startIndex,endIndex).join("");
	}

	static symbolsToStringArray(symbols,startIndex,endIndex) {
		const build = [];
		
		for(let i = startIndex; i < endIndex; i++) {
			build.push(symbols[i].string);
		}
		
		return build;
	}
}

function parseLexer(lexerSource) {
	const captureToSymbol = new ExtendedMap();
	
	let lexer = "(";
	for(const [index,element] of lexerSource.entries()) {
		const symbol = element.token;
		const matcher = Utilities.defaultIfUndefined(element.matcher,symbol);
		captureToSymbol.set(index+1,symbol);
		lexer += `${index === 0 ? "" : "|"}<${matcher}>`;
	}
	lexer += "){0,}";
	
	return {
		captureToSymbol: captureToSymbol,
		lexer: lexer
	};
}

function lexerDFS(gen,captureParseTree,string,symbols = []) {
	const {captureToSymbol,lexerSymbolToKeywords} = namespace(gen);
	const {captureId,children,end,start} = captureParseTree;
	
	if(captureId !== 0) {
		symbols.push(new LexerSymbol(captureToSymbol.get(captureId),string.substring(start,end)));
	}
	
	for(const child of children) {
		lexerDFS(gen,child,string,symbols);
	}
	
	return symbols;
}