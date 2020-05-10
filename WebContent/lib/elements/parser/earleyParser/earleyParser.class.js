import {Utilities} from "./import.js";
import {ExtendedMap,ExtendedSet,SerialSet,UniqueClassFactory} from "./../structures/export.js";
import Rule from "./../BNFParser/rule.class.js";
import EarleyState from "./earleyState.class.js";
import ParseTreeNode from "./parseTreeNode.class.js";
import RuleElement from "./ruleElement.class.js";
import SPPFNode from "./SPPFNode.class.js";
import SPPFNodeChild from "./SPPFNodeChild.class.js";
import StateElement from "./stateElement.class.js";

const namespace = Utilities.buildNamespace();

/*
cubic parser using Elizabeth Scott's BRNGLR like algorithm
*/
export default class EarleyParser {
	constructor(BNFgram,startSymbol = "S") {
		const state = namespace(this);
		const {gram,nonTerminals,gramGroups} = BNFgram.append([new Rule(EarleyParser.startSymbol,[startSymbol])],true);
		state.BNFgram = BNFgram;
		state.gram = gram;
		state.nonTerminals = nonTerminals;
		state.gramGroups = gramGroups;
	}
	
	withNewStartSymbol(startSymbol) {
		return new EarleyParser(namespace(this).BNFgram.sub(startSymbol),startSymbol);
	}
	
	parse(symbols,nonAmbiguous = false) {
		const gen = namespace(this);
		const {gram,gramGroups,nonTerminals} = gen;
		
		const ruleElementFactory = new UniqueClassFactory(RuleElement);
		const nodeFactory = new UniqueClassFactory(SPPFNode);
		const stateElementFactory = new UniqueClassFactory(StateElement);
		
		const len = symbols.length+1;
		const states = init(len);
		
		let state = states[0];
		updateState(gen,state,stateElementFactory.add(ruleElementFactory.add(0,0),0));
		let predictorCompleterStack;
		let currentScannerStack;
		let nextScannerStack = [];
		let scannerSet = new SerialSet();
		let nonTerminalsToEpsilon;
		let nodeSet = new SerialSet();
		
		for(let stateIndex = 0; stateIndex < len; stateIndex++) {
			predictorCompleterStack = Array.from(state.set);
			currentScannerStack = nextScannerStack;
			nextScannerStack = [];
			nonTerminalsToEpsilon = new ExtendedMap();
			
			while(predictorCompleterStack.length > 0) {
				const stateElement = predictorCompleterStack.pop();
				const {ruleElement,symbolIndex} = stateElement;
				let node = stateElement.node;
				const {ruleIndex,dotIndex} = ruleElement;
				const {left,right} = gram[ruleIndex];
				
				if(dotIndex !== right.length) {
					const symbol = right[dotIndex];
					
					for(const ruleIndex of gramGroups.get(symbol)) {
						const right = gram[ruleIndex].right;
						const newStateElement = stateElementFactory.add(ruleElementFactory.add(ruleIndex,0),stateIndex);
						
						if(isEpsilonOrStartWithNonTerminal(gen,right)) {
							if(!state.set.has(newStateElement)) {
								predictorCompleterStack.push(newStateElement);
								updateState(gen,state,newStateElement);
							}
						} else if(isValidNextTerminal(symbols,stateIndex,right)) {
							if(!scannerSet.has(newStateElement)) {
								currentScannerStack.push(newStateElement);
								scannerSet.add(newStateElement);
							}
						}
					}
					
					if(nonTerminalsToEpsilon.has(symbol)) {
						for(const stateElement of nonTerminalsToEpsilon.get(symbol)) {
							const ruleElement = ruleElementFactory.add(ruleIndex,dotIndex+1);
							const newNode = makeNode(gen,ruleElement,symbolIndex,stateIndex,node,stateElement.node,nodeSet,nodeFactory);
							const newStateElement = stateElementFactory.add(ruleElement,symbolIndex,newNode);
							
							if(isEpsilonOrStartWithNonTerminal(gen,right,dotIndex+1)) {
								if(!state.set.has(newStateElement)) {
									predictorCompleterStack.push(newStateElement);
									updateState(gen,state,newStateElement);
								}
							} else if(isValidNextTerminal(symbols,stateIndex,right,dotIndex+1)) {
								if(!scannerSet.has(newStateElement)) {
									currentScannerStack.push(newStateElement);
									scannerSet.add(newStateElement);
								}
							}
						}
					}
				} else {
					if(node === null) {
						node = nodeFactory.add(left,stateIndex,stateIndex);
						nodeSet.add(node);
						node.children.add();
					}
					
					if(symbolIndex === stateIndex) {
						if(!nonTerminalsToEpsilon.has(left)) {
							nonTerminalsToEpsilon.set(left,new SerialSet());
						}
						nonTerminalsToEpsilon.get(left).add(stateElementFactory.add(ruleElement,symbolIndex,node));
					}
					
					const groups = states[symbolIndex].setGroups;
					if(groups.has(left)) {
						for(const stateElement of groups.get(left)) {
							const {dotIndex,ruleIndex} = stateElement.ruleElement;
							const right = gram[ruleIndex].right;
							const ruleElement = ruleElementFactory.add(ruleIndex,dotIndex+1);
							const newNode = makeNode(gen,ruleElement,stateElement.symbolIndex,stateIndex,stateElement.node,node,nodeSet,nodeFactory);
							const newStateElement = stateElementFactory.add(ruleElement,stateElement.symbolIndex,newNode);
							
							if(isEpsilonOrStartWithNonTerminal(gen,right,dotIndex+1)) {
								if(!state.set.has(newStateElement)) {
									predictorCompleterStack.push(newStateElement);
									updateState(gen,state,newStateElement);
								}
							} else if(isValidNextTerminal(symbols,stateIndex,right,dotIndex+1)) {
								if(!scannerSet.has(newStateElement)) {
									currentScannerStack.push(newStateElement);
									scannerSet.add(newStateElement);
								}
							}
						}
					}
				}
			}
			
			if(stateIndex < symbols.length) {
				scannerSet = new SerialSet();
				nodeSet = new SerialSet();
				state = states[stateIndex+1];
				const newNode = nodeFactory.add(symbols[stateIndex],stateIndex,stateIndex+1);
				
				while(currentScannerStack.length > 0) {
					const stateElement = currentScannerStack.pop();
					const {ruleElement,symbolIndex,node} = stateElement;
					const {dotIndex,ruleIndex} = ruleElement;
					const right = gram[ruleIndex].right;
					const newRuleElement = ruleElementFactory.add(ruleIndex,dotIndex+1);
					const newNodeBis = makeNode(gen,newRuleElement,symbolIndex,stateIndex+1,node,newNode,nodeSet,nodeFactory);
					const newStateElement = stateElementFactory.add(newRuleElement,symbolIndex,newNodeBis);
					
					if(isEpsilonOrStartWithNonTerminal(gen,right,dotIndex+1)) {
						updateState(gen,state,newStateElement);
					} else if(isValidNextTerminal(symbols,stateIndex+1,right,dotIndex+1)) {
						if(!scannerSet.has(newStateElement)) {
							nextScannerStack.push(newStateElement);
							scannerSet.add(newStateElement);
						}
					}
				}
			}
		}
		
		const forest = nodeFactory.get(EarleyParser.startSymbol,0,symbols.length);
		if(forest === null) {
			return {
				res: false
			};
		} else {
			if(nonAmbiguous && !hasSingleDerivation(forest)) {
				throw("the grammar is ambiguous");
			}
			return {
				res: true,
				forest: !nonAmbiguous ? forest : filterNonAmbiguous(forest).children[0]
			};
		}
	}
	
	get gram() {
		return namespace(this).gram;
	}
	
	get nonTerminals() {
		return namespace(this).nonTerminals;
	}
}
EarleyParser.startSymbol = Symbol("startSymbol");

function init(length) {
	const states = new Array(length);
	
	for(let i = 0; i < length; i++) {
		states[i] = new EarleyState();
	}
	
	return states;
}

function isEpsilonOrStartWithNonTerminal(gen,right,dotIndex = 0) {
	const nonTerminals = gen.nonTerminals;
	return dotIndex === right.length || nonTerminals.has(right[dotIndex]);
}

function isValidNextTerminal(symbols,symbolIndex,right,dotIndex = 0) {
	return symbolIndex < symbols.length && right[dotIndex] === symbols[symbolIndex];
}

function updateState(gen,state,stateElement) {
	const gram = gen.gram;
	const {set,setGroups} = state;
	set.add(stateElement);
	const {dotIndex,ruleIndex} = stateElement.ruleElement;
	const right = gram[ruleIndex].right;
	if(dotIndex !== right.length) {
		const symbol = right[dotIndex];
		if(!setGroups.has(symbol)) {
			setGroups.set(symbol,new SerialSet());
		}
		setGroups.get(symbol).add(stateElement);
	}
}

function makeNode(gen,ruleElement,start,end,nodeLeft,nodeRight,nodeSet,nodeFactory) {
	const {gram} = gen;
	const {dotIndex,ruleIndex} = ruleElement;
	const {left,right} = gram[ruleIndex];
	let node;
	
	if(dotIndex < 2 && dotIndex < right.length) {
		node = nodeRight;
	} else {
		const isRule = dotIndex !== right.length;
		const value = isRule ? ruleElement : left;
		node = nodeFactory.add(value,start,end,isRule);
		
		if(nodeLeft === null) {
			node.children.add(nodeRight);
		} else {
			node.children.add(nodeLeft,nodeRight);
		}
	}
	
	return node;
}

function hasSingleDerivation(node) {
	if(node === null) {
		return true;
	}
	
	const children = node.children;
	
	if(children.size > 1) {
		return false;
	}
	
	if(children.size === 1) {
		const {first,second} = children.randomElement();
		return hasSingleDerivation(first) && hasSingleDerivation(second);
	}
	
	return true;
}

function filterNonAmbiguous(forest) {
	const {children,end,isRule,start,value} = forest;
	
	let res = [];
	if(children.size > 0) {
		const {first,second} = children.randomElement();
		if(first !== null) {
			res = Utilities.arrayInput(filterNonAmbiguous(first));
		}
		if(second !== null) {
			res = res.concat(Utilities.arrayInput(filterNonAmbiguous(second)));
		}
	}
	
	if(isRule) {
		return res;
	} else {
		const parseTree = new ParseTreeNode(value,start,end);
		parseTree.children.push(...res);
		return parseTree;
	}
}