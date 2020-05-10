import {Utilities} from "./import.js";
import {ExtendedMap,ExtendedSet} from "./structures/export.js";
import BNFParser from "./BNFParser/BNFParser.class.js";
import EarleyParser from "./earleyParser/earleyParser.class.js";
import Lexer from "./lexer/lexer.class.js";
import LexerWrapper from "./lexer/lexerWrapper.class.js";

const namespace = Utilities.buildNamespace();

export default class ParserWrapper {
	constructor(lexer,parser,mapProps) {
		const state = namespace(this);
		state.lexer = lexer;
		state.mapProps = mapProps;
		state.parser = parser;
	}
	
	parse(string) {
		const {lexer,mapProps,parser} = namespace(this);
		
		const symbols = lexer.getSymbols(string);

		if(symbols === null) {
			return {
				res: false
			};
		}
		
		const res = parser.parse(Lexer.lexerSymbolsToParser(symbols),true);
		
		if(res.res) {
			let map = new ExtendedMap();
			
			depthFirstTraversal(this,res.forest,symbols,map);
			map = mapProps.filter(map);
			
			if(map === false) {
				return {
					res: false
				};
			}
			
			res.map = map;
			delete(res.forest);
			
			return res;
		}
		
		return res;
	}
	
	static build(lexerSource,gramBNF,mapProps,startSymbol) {
		const parser = this.buildParser(gramBNF,startSymbol);
		const lexer = this.buildLexerWrapper(this.buildLexer(lexerSource),parser);
		return new ParserWrapper(lexer,parser,this.buildMapProps(mapProps));
	}
	
	static buildParser(gramBNF,startSymbol) {
		return new EarleyParser((new BNFParser(gramBNF)).gram,startSymbol);
	}
	
	static buildLexer(lexerSource) {
		return new Lexer(lexerSource);
	}
	
	static buildLexerWrapper(lexer,parser) {
		return new LexerWrapper(lexer,buildLexerSymbolToKeywords(lexer.lexerSource,parser));
	}
	
	static buildMapProps(mapProps) {
		mapProps = Utilities.defaultIfUndefined(mapProps,{});
		mapProps.map = Utilities.defaultIfUndefined(mapProps.map,[]);
		
		const res = {
			map: new ExtendedMap(),
			filter: Utilities.defaultIfUndefined(mapProps.filter,defaultFilter)
		};
		
		const resMap = res.map;
		
		for(let {names,symbols} of mapProps.map) {
			symbols = Utilities.arrayInput(symbols);
			for(const symbol of symbols) {
				if(!resMap.has(symbol)) {
					resMap.set(symbol,new ExtendedSet());
				}
				resMap.get(symbol).union(new ExtendedSet(Utilities.arrayInput(Utilities.defaultIfUndefined(names,symbol))),true);
			}
		}
		
		return res;
	}
}

function defaultFilter(map) {
	for(const [key,value] of map) {
		map.set(key,value.join(" "));
	}
	
	return map;
}

function buildLexerSymbolToKeywords(lexer,parser) {
	const {gram,nonTerminals} = parser;
	
	const buildSet = new ExtendedSet();
	
	for(const {token} of lexer) {
		buildSet.add(token);
	}
	
	for(const {right} of gram) {
		for(const symbol of right) {
			if(!nonTerminals.has(symbol) && !buildSet.has(symbol)) {
				buildSet.add(symbol);
			}
		}
	}
	
	return {
		"keyword": Array.from(buildSet)
	};
}

function depthFirstTraversal(gen,parseTree,symbols,map) {
	const mapProps = namespace(gen).mapProps.map;
	
	for(const child of parseTree.children) {
		depthFirstTraversal(gen,child,symbols,map);
	}
	
	const {end,start,value} = parseTree;
	const string = Lexer.symbolsToString(symbols,start,end);
	
	if(mapProps.has(value)) {
		for(const name of mapProps.get(value)) {
			if(!map.has(name)) {
				map.set(name,[]);
			}
			
			map.get(name).push(string);
		}
	}
}