import {Utilities} from "./import.js";
import {ExtendedMap,ExtendedSet} from "./../structures/export.js";

const namespace = Utilities.buildNamespace();

export default class BNFGrammar {
	constructor(gram) {
		const state = namespace(this);
		state.gram = gram;
		state.nonTerminals = initNonTerminals(state);
		state.gramGroups = initGramGroups(state);
	}
	
	sub(nonTerminal) {
		const {gram,gramGroups} = namespace(this);
		
		const subGrammar = [];
		const visited = new ExtendedSet();
		const queue = [nonTerminal];
		
		while(queue.length > 0) {
			const symbol = queue.pop();
			
			if(gramGroups.has(symbol) && !visited.has(symbol)) {
				visited.add(symbol);
				
				for(const ruleIndex of gramGroups.get(symbol)) {
					subGrammar.push(gram[ruleIndex]);
					queue.push(...gram[ruleIndex].right);
				}
			}
		}
		
		return new BNFGrammar(subGrammar);
	}
	
	append(gram,first = false) {
		return new BNFGrammar(first ? gram.concat(namespace(this).gram) : namespace(this).gram.concat(gram));
	}
	
	union(gram,first = false) {
		return append(gram.gram,first);
	}
	
	get gram() {
		return namespace(this).gram;
	}
	
	get gramGroups() {
		return namespace(this).gramGroups;
	}
	
	get nonTerminals() {
		return namespace(this).nonTerminals;
	}
}

function initNonTerminals(gen) {
	const gram = gen.gram;
	const nonTerminals = new ExtendedSet();
	
	for(const rule of gram) {
		nonTerminals.add(rule.left);
	}
	
	return nonTerminals;
}

function initGramGroups(gen) {
	const {gram,nonTerminals} = gen;
	const gramGroups = new ExtendedMap();
	
	for(const nonTerminal of nonTerminals) {
		gramGroups.set(nonTerminal,new ExtendedSet());
	}
	
	for(const [ruleIndex,rule] of gram.entries()) {
		gramGroups.get(rule.left).add(ruleIndex);
	}
	
	return gramGroups;
}