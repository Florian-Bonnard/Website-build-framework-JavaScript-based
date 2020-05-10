import {Utilities} from "./import.js";
import {ExtendedSet,FibonacciHeap,SerialMap,SerialSet,SerialUtilities,UniqueClassFactory} from "./../structures/export.js";
import BNFParser from "./../BNFParser/BNFParser.class.js";
import EarleyParser from "./../earleyParser/earleyParser.class.js";
import Lexer from "./../lexer/lexer.class.js";
import LexerSymbol from "./../lexer/lexerSymbol.class.js";
import {Automaton,AutomatonSingleStart,AutomatonSingleEnd,AutomatonSingleStartEnd} from "./automaton.class.js";
import {AutomatonArrowBuild,AutomatonArrowLetter,AutomatonArrowClass,AutomatonArrowState} from "./automatonArrow.class.js";
import {AutomatonState,AutomatonStateDeterministic} from "./automatonState.class.js";
import {RegexASTNodeLetter,RegexASTNodeClass,RegexASTNodeEpsilon,RegexASTNodeSingle,RegexASTNodeDouble,RegexASTNodeCapture} from "./regexASTNode.class.js";
import RegexCaptureTreeNode from "./regexCaptureTreeNode.class.js";

const namespace = Utilities.buildNamespace();

/*
efficient matcher in O(lc) runtime (l length of the string and c > 0 the number of capturing groups)
*/
export default class RegularExpression {
	constructor(regex,matchAll = true) {
		if(Utilities.DEBUG) {
			if(!Utilities.instanceOf(regex,"string")) {
				Utilities.error("constructor",1,regex,"string");
			}
		}
		
		const state = namespace(this);
		const arrowFactory = {
			arrowBuild: new UniqueClassFactory(AutomatonArrowBuild),
			arrowLetter: new UniqueClassFactory(AutomatonArrowLetter),
			arrowClass: new UniqueClassFactory(AutomatonArrowClass),
			arrowState: new UniqueClassFactory(AutomatonArrowState)
		};
		
		regex = `<${regex}>`;
		const parseTree = buildParseTree(matchAll ? regex : `[^]{0,}?${regex}[^]{0,}`);
		
		const M1 = buildM1(parseTree,arrowFactory);
		
		const pi = getPi(M1);
		
		const M2 = buildM2(M1,pi);
		
		state.M3 = buildM3(M2,arrowFactory);
		
		state.M4 = buildM4(M1,M2,state.M3,pi,arrowFactory);
		
		state.M3.start.purge();
		state.M4.start.purge();
	}
	
	match(string) {
		const {M3,M4} = namespace(this);
		
		const len = string.length;
		let index = len-1;
		let currentState = M3.start;
		const stateHistory = [currentState];
		
		while(index >= 0) {
			const next = currentState.next;
			const negativeArrow = currentState.information.negativeArrow;
			const currentArrow = new AutomatonArrowLetter(string[index]);
			
			if(next.has(currentArrow)) {
				currentState = next.get(currentArrow);
			} else if(negativeArrow !== null && !negativeArrow.elements.has(string[index])) {
				currentState = next.get(negativeArrow);
			} else {
				return false;
			}
			
			stateHistory.push(currentState);
			index--;
		}
		
		if(!M3.end.has(currentState)) {
			return false;
		}
		
		stateHistory.reverse();
		currentState = M4.start;
		const parseTreeQueue = [];
		const matchQueue = [];
		
		for(index = 0; index <= len; index++) {
			const arrow = currentState.next.getKey(new AutomatonArrowState(stateHistory[index]));
			for(const capture of arrow.information) {
				const captureId = Number.parseInt(capture.substring(1,capture.length));
				if(capture[0] === "S") {
					matchQueue.push({
						S: captureId,
						index: index
					});
				} else {
					const children = [];
					let pop = matchQueue.pop();
					while(pop.S !== captureId) {
						children.push(parseTreeQueue.pop());
						pop = matchQueue.pop();
					}
					children.reverse();
					parseTreeQueue.push(new RegexCaptureTreeNode(captureId,pop.index,index,children));
					matchQueue.push(pop);
				}
			}
			currentState = currentState.getNext(arrow);
		}
		
		return parseTreeQueue[0];
	}
	
	test(string) {
		const M3 = namespace(this).M3;
		
		let index = string.length-1;
		let currentState = M3.start;
		
		while(index >= 0) {
			const next = currentState.next;
			const negativeArrow = currentState.information.negativeArrow;
			const currentArrow = new AutomatonArrowLetter(string[index]);
			
			if(next.has(currentArrow)) {
				currentState = next.get(currentArrow);
			} else if(negativeArrow !== null && !negativeArrow.elements.has(string[index])) {
				currentState = next.get(negativeArrow);
			} else {
				return false;
			}
			
			index--;
		}
		
		return M3.end.has(currentState);
	}
}

const regexBNFGram = {
	"S": "<U> | ",
	"U": "<U> <|> <C> | <C>",
	"C": "<C> <R> | <R>",
	"R": "<Quantifier> | <Capturing> | <Non-capturing> | <Class> | <Letter>",
	"Quantifier": "<R> <{> <Quantifier-2> <}> <Quantifier-5>",
	"Quantifier-2": "<Integer> <Quantifier-3> | <,> <Quantifier-4>",
	"Quantifier-3": "<,> <Quantifier-4> | ",
	"Quantifier-4": "<Integer> | ",
	"Quantifier-5": "<?> | ",
	"Integer": "<Integer-2> <digit>",
	"Integer-2": "<Integer> | ",
	"Capturing": "<<> <S> <\\>>",
	"Non-capturing": "<(> <S> <)>",
	"Class": "<[> <Class-2> <]>",
	"Class-2": "<Class-3> <Class-2> | ",
	"Class-3": "<Class-5> <-> <Class-5> | <Class-4>",
	"Class-4": "<Class-5> | <\\\\> <Class-6>",
	"Class-5": "<Letter-2> | <{> | <}> | <[> | <(> | <)> | <<> | <\\>> | <?> | <|>",
	"Class-6": "<Class-5> | <\\\\> | <]> | <->",
	"Letter": "<-> | <Letter-2> | <\\\\> <Letter-3>",
	"Letter-2": "<character> | <digit> | <,>",
	"Letter-3": "<Letter-2> | <\\\\> | <{> | <}> | <[> | <]> | <(> | <)> | <<> | <\\>> | <?> | <|>"
};

let regexParser;
function buildParseTree(regex) {
	if(!regexParser) {
		regexParser = new EarleyParser((new BNFParser(regexBNFGram)).gram);
	}
	
	const symbols = regexLexer(regex);
	
	const regexParsed = regexParser.parse(Lexer.lexerSymbolsToParser(symbols),true);
	
	if(regexParsed.res === false) {
		throw("invalid regular expression");
	}
	
	return filterAST(regexParsed.forest,symbols);
}

const specialLexerChars = new ExtendedSet(["|","{","}",",","?","<",">","(",")","[","]","\\","-"]);
function regexLexer(regex) {
	const symbols = [];
	
	for(const char of regex) {
		let symbol;
		
		if(specialLexerChars.has(char)) {
			symbol = char;
		} else if("0".localeCompare(char) <= 0 && char.localeCompare("9") <= 0) {
			symbol = "digit";
		} else {
			symbol = "character";
		}
		
		symbols.push(new LexerSymbol(symbol,char));
	}
	
	return symbols;
}

function filterAST(parseTree,symbols,captureCount = Utilities.numericBuilder(0)) {
	const {start,children,end,value} = parseTree;
	
	switch(value) {
		case "S": {
			if(children.length === 0) {
				return new RegexASTNodeEpsilon();
			} else {
				return filterAST(children[0],symbols,captureCount);
			}
		}

		case "U": {
			if(children.length === 1) {
				return filterAST(children[0],symbols,captureCount);
			} else {
				const res1 = filterAST(children[0],symbols,captureCount);
				const res2 = filterAST(children[2],symbols,captureCount);
				return new RegexASTNodeDouble("union",res1,res2);
			}
		}
		
		case "C": {
			if(children.length === 1) {
				return filterAST(children[0],symbols,captureCount);
			} else {
				const res1 = filterAST(children[0],symbols,captureCount);
				const res2 = filterAST(children[1],symbols,captureCount);
				return new RegexASTNodeDouble("concatenation",res1,res2);
			}
		}
		
		case "R": {
			return filterAST(children[0],symbols,captureCount);
		}
		
		case "Quantifier": {
			const res = filterAST(children[0],symbols,captureCount);
			let n;
			let m;
			let type;
			const res1 = children[2];
			const res1_1 = res1.children[0];
			if(res1_1.value === "Integer") {
				n = Number.parseInt(Lexer.symbolsToString(symbols,res1_1.start,res1_1.end));
				const res1_2 = res1.children[1];
				if(res1_2.children.length === 0) {
					type = 1;
				} else {
					const res1_2_1 = res1_2.children[1];
					if(res1_2_1.children.length === 0) {
						type = 2;
					} else {
						const res1_2_1_1 = res1_2_1.children[0];
						m = Number.parseInt(Lexer.symbolsToString(symbols,res1_2_1_1.start,res1_2_1_1.end));
						type = 3;
					}
				}
			} else {
				const res1_2 = res1.children[1];
				if(res1_2.children.length === 0) {
					type = 4;
				} else {
					const res1_2_1 = res1_2.children[0];
					m = Number.parseInt(Lexer.symbolsToString(symbols,res1_2_1.start,res1_2_1.end));
					type = 0;
				}
			}
			const greedy = children[4].children.length === 0;
			
			switch(type) {
				case 0: {
					return parseQuantifier(res,0,m,greedy);
				}
				case 1: {
					return parseQuantifier(res,n,n,greedy);
				}
				case 2: {
					return parseQuantifier(res,n,Number.POSITIVE_INFINITY,greedy);
				}
				case 3: {
					return parseQuantifier(res,n,m,greedy);
				}
				case 4: {
					return parseQuantifier(res,0,Number.POSITIVE_INFINITY,greedy);
				}
			}
		}
		
		case "Capturing": {
			const captureId = captureCount.next().value;
			return new RegexASTNodeCapture(filterAST(children[1],symbols,captureCount),captureId);
		}
		
		case "Non-capturing": {
			return filterAST(children[1],symbols,captureCount);
		}
		
		case "Class": {
			return parseClass(children[1],symbols);
		}
		
		case "Letter": {
			return new RegexASTNodeLetter(end - start === 2 ? symbols[start+1].string : symbols[start].string);
		}
	}
}

function parseQuantifier(res,n,m,greedy = true) {
	if(n > m) {
		return new RegexASTNodeEpsilon();
	} else if(n === m) {
		if(n === 0) {
			return eps;
		} else {
			let ret = res;
			for(let i = 0; i < n-1; i++) {
				ret = new RegexASTNodeDouble("concatenation",ret,res);
			}
			return ret;
		}
	} else {
		if(greedy) {
			if(m === Number.POSITIVE_INFINITY) {
				const closure = new RegexASTNodeSingle("greedy closure",res);
				if(n === 0) {
					return closure;
				} else {
					let ret = res;
					for(let i = 0; i < n-1; i++) {
						ret = new RegexASTNodeDouble("concatenation",ret,res);
					}
					return new RegexASTNodeDouble("concatenation",ret,closure);
				}
			} else if(n === 0) {
				const base = new RegexASTNodeDouble("union",res,new RegexASTNodeEpsilon());
				let ret = base;
				for(let i = 0; i < m-1; i++) {
					ret = new RegexASTNodeDouble("concatenation",ret,base);
				}
				return ret;
			} else {
				let ret = res;
				for(let i = 0; i < n-1; i++) {
					ret = new RegexASTNodeDouble("concatenation",ret,res);
				}
				const base = new RegexASTNodeDouble("union",res,new RegexASTNodeEpsilon());
				for(let i = n; i < m; i++) {
					ret = new RegexASTNodeDouble("concatenation",ret,base);
				}
				return ret;
			}
		} else {
			if(m === Number.POSITIVE_INFINITY) {
				const closure = new RegexASTNodeSingle("reluctant closure",res);
				if(n === 0) {
					return closure;
				} else {
					let ret = res;
					for(let i = 0; i < n-1; i++) {
						ret = new RegexASTNodeDouble("concatenation",ret,res);
					}
					return new RegexASTNodeDouble("concatenation",ret,closure);
				}
			} else if(n === 0) {
				const base = new RegexASTNodeDouble("union",new RegexASTNodeEpsilon(),res);
				let ret = base;
				for(let i = 0; i < m-1; i++) {
					ret = new RegexASTNodeDouble("concatenation",ret,base);
				}
				return ret;
			} else {
				let ret = res;
				for(let i = 0; i < n-1; i++) {
					ret = new RegexASTNodeDouble("concatenation",ret,res);
				}
				const base = new RegexASTNodeDouble("union",new RegexASTNodeEpsilon(),res);
				for(let i = n; i < m; i++) {
					ret = new RegexASTNodeDouble("concatenation",ret,base);
				}
				return ret;
			}
		}
	}
}

function parseClass(res,symbols) {
	let negative = false;
	const elements = new ExtendedSet();
	if(symbols[res.start].string === "^") {
		negative = true;
		res = res.children[1];
	}
	
	while(res.children.length > 0) {
		const item = res.children[0];
		switch(item.end - item.start) {
			case 1: {
				elements.add(symbols[item.start].string);
				break;
			}
			case 2: {
				elements.add(symbols[item.start+1].string);
				break;
			}
			case 3: {
				const elem = Lexer.symbolsToStringArray(symbols,item.start,item.end);
				const arrayElem = parseClassRange(elem,[
					{
						start: "0",
						end: "9"
					},
					{
						start: "a",
						end: "z"
					},
					{
						start: "A",
						end: "Z"
					}
				]);
				
				if(arrayElem !== null) {
					const start = symbols[item.start].string.charCodeAt(0);
					const end = symbols[item.end-1].string.charCodeAt(0);

					for(let i = start; i <= end; i++) {
						elements.add(String.fromCharCode(i));
					}
				}
				break;
			}
		}
		res = res.children[1];
	}
	
	return new RegexASTNodeClass(elements,negative);
}
function parseClassRange(elem,ranges) {
	for(const {start,end} of ranges) {
		if(start.localeCompare(elem[0]) <= 0 && elem[0].localeCompare(end) <= 0 && start.localeCompare(elem[2]) <= 0 && elem[2].localeCompare(end) <= 0) {
			if(elem[0].localeCompare(elem[2]) <= 0) {
				return [elem[0],elem[2]];
			}
		}
	}
	return null;
}





function buildM1(parseTree,arrowFactory,idGenerator = Utilities.numericBuilder()) {
	const automaton = new AutomatonSingleStartEnd();
	
	switch(parseTree.nodeType) {
		case "epsilon": {
			const state = new AutomatonStateDeterministic(idGenerator.next().value);
			
			automaton.states.set(state,state);
			automaton.start = state;
			automaton.end = state;
			break;
		}
		case "letter": {
			const start = new AutomatonStateDeterministic(idGenerator.next().value);
			const end = new AutomatonStateDeterministic(idGenerator.next().value);
			start.addNext(arrowFactory.arrowLetter.add(parseTree.value),end);
			
			const states = automaton.states;
			states.set(start,start);
			states.set(end,end);
			automaton.start = start;
			automaton.end = end;
			break;
		}
		case "class": {
			const start = new AutomatonStateDeterministic(idGenerator.next().value);
			const end = new AutomatonStateDeterministic(idGenerator.next().value);
			start.addNext(arrowFactory.arrowClass.add(parseTree.elements,parseTree.negative),end);
			
			const states = automaton.states;
			states.set(start,start);
			states.set(end,end);
			automaton.start = start;
			automaton.end = end;
			break;
		}
		case "union": {
			const first = buildM1(parseTree.first,arrowFactory,idGenerator);
			const second = buildM1(parseTree.second,arrowFactory,idGenerator);
			let stateChange;
			let statePivot;
			if(SerialUtilities.serialEqual(second.start,second.end)) {
				stateChange = first.end;
				statePivot = second.end;
			} else {
				stateChange = second.end;
				statePivot = first.end;
			}	
			for(const [arrow,states] of stateChange.getAllPrevious()) {
				for(const state of states) {
					stateChange.removePrevious(arrow,state);
					statePivot.addPrevious(arrow,state);
				}
			}
			
			stateChange.addNext(arrowFactory.arrowBuild.add("+"),first.start);
			stateChange.addNext(arrowFactory.arrowBuild.add("-"),second.start);
			const states = automaton.states;
			for(const state of first.states.values()) {
				states.set(state,state);
			}
			for(const state of second.states.values()) {
				states.set(state,state);
			}
			automaton.start = stateChange;
			automaton.end = statePivot;
			break;
		}
		case "concatenation": {
			const first = buildM1(parseTree.first,arrowFactory,idGenerator);
			const second = buildM1(parseTree.second,arrowFactory,idGenerator);
			const stateDelete = second.start;
			const statePivot = first.end;
			for(const [arrow,state] of stateDelete.getAllNext()) {
				stateDelete.removeNext(arrow,state);
				statePivot.addNext(arrow,state);
			}
			
			const states = automaton.states;
			for(const state of first.states.values()) {
				states.set(state,state);
			}
			for(const state of second.states.values()) {
				states.set(state,state);
			}
			states.delete(stateDelete);
			automaton.start = first.start;
			automaton.end = second.end;
			break;
		}
		case "greedy closure": {
			const child = buildM1(parseTree.child,arrowFactory,idGenerator);
			const start = new AutomatonStateDeterministic(idGenerator.next().value);
			const end = new AutomatonStateDeterministic(idGenerator.next().value);
			const childStart = child.start;
			const childEnd = child.end;
			start.addNext(arrowFactory.arrowBuild.add("+"),childStart);
			start.addNext(arrowFactory.arrowBuild.add("-"),end);
			childEnd.addNext(arrowFactory.arrowBuild.add("+"),childStart);
			childEnd.addNext(arrowFactory.arrowBuild.add("-"),end);
			
			const states = automaton.states;
			for(const state of child.states.values()) {
				states.set(state,state);
			}
			states.set(start,start);
			states.set(end,end);
			automaton.start = start;
			automaton.end = end;
			break;
		}
		case "reluctant closure": {
			const child = buildM1(parseTree.child,arrowFactory,idGenerator);
			const start = new AutomatonStateDeterministic(idGenerator.next().value);
			const end = new AutomatonStateDeterministic(idGenerator.next().value);
			const childStart = child.start;
			const childEnd = child.end;
			start.addNext(arrowFactory.arrowBuild.add("-"),childStart);
			start.addNext(arrowFactory.arrowBuild.add("+"),end);
			childEnd.addNext(arrowFactory.arrowBuild.add("-"),childStart);
			childEnd.addNext(arrowFactory.arrowBuild.add("+"),end);
			
			const states = automaton.states;
			for(const state of child.states.values()) {
				states.set(state,state);
			}
			states.set(start,start);
			states.set(end,end);
			automaton.start = start;
			automaton.end = end;
			break;
		}
		case "capturing group": {
			const capture = parseTree.captureGroupId;
			const child = buildM1(parseTree.child,arrowFactory,idGenerator);
			const start = new AutomatonStateDeterministic(idGenerator.next().value);
			const end = new AutomatonStateDeterministic(idGenerator.next().value);
			start.addNext(arrowFactory.arrowBuild.add(`S${capture}`),child.start);
			child.end.addNext(arrowFactory.arrowBuild.add(`E${capture}`),end);
			
			const states = automaton.states;
			for(const state of child.states.values()) {
				states.set(state,state);
			}
			states.set(start,start);
			states.set(end,end);
			automaton.start = start;
			automaton.end = end;
			break;
		}
	}
	
	return automaton;
}

function getPi(M1) {
	const states = M1.states;
	const pi = new SerialMap();
	
	for(const state of states.values()) {
		pi.set(state,dijkstraAlgorithm(states,state));
	}
	
	return pi;
}
function dijkstraAlgorithm(states,source) {
	const heap = new FibonacciHeap(comparePaths);
	const map = new SerialMap();
	for(const state of states.values()) {
		map.set(state,heap.insert({state:state,value:null}));
	}
	const distances = new SerialMap();
	heap.decreaseKey(map.get(source),{state:source,value:[]});
	distances.set(source,[]);
	
	let min;
	while((min = heap.extractMin()) !== null) {
		const {state,value} = min.value;
		
		if(value !== null) {
			for(const [arrow,next] of state.getAllNext()) {
				if(arrow.arrowType === "build") {
					const alt = value.concat([arrow.id]);
					const heapElem = map.get(next);
					
					if(compareValues(alt,heapElem.value.value) < 0) {
						heap.decreaseKey(heapElem,{state:next,value:alt});
						distances.set(next,alt);
					}
				}
			}
		}
	}
	
	return distances;
}
function comparePaths(obj1,obj2) {
	return compareValues(obj1.value,obj2.value);
}
function compareValues(value1,value2) {
	if(value1 === null) {
		return 1;
	}
	if(value2 === null) {
		return -1;
	}
	
	const len1 = value1.length
	const len2 = value2.length;
	let i = 0;
	
	while(i < len1 && i < len2) {
		const v1 = value1[i];
		const v2 = value2[i];
		
		if(v1 !== v2) {
			if(!["-","+"].includes(v1) || !["-","+"].includes(v2)) {
				throw("can't compare with these inputs");
			}
			return v1 === "+" ? -1 : 1;
		}
		i++;
	}
	
	if(len1 === len2) {
		return 0;
	}
	
	return len1 < len2 ? -1 : 1;
}
function filterPi(value) {
	const build = [];
	
	for(const elem of value) {
		if(!["-","+"].includes(elem)) {
			build.push(elem);
		}
	}
	
	return build;
}

function buildM2(M1,pi) {
	const automaton = new AutomatonSingleEnd();
	
	const statesM2 = automaton.states;

	for(const state of M1.states.values()) {
		if(pi.get(state).size < 2) {
			const newState = new AutomatonState(state.id);
			statesM2.set(newState,newState);
		}
	}
	
	const start = automaton.start;
	for(const state of pi.get(M1.start).keys()) {
		if(statesM2.has(state)) {
			start.add(statesM2.get(state));
		}
	}
	
	automaton.end = statesM2.get(M1.end);
	
	for(const state of M1.states.values()) {
		if(pi.get(state).size < 2) {
			const stateM2 = statesM2.get(state);
			
			if(!SerialUtilities.serialEqual(stateM2,automaton.end)) {
				const [arrow,next] = state.getAllNext().next().value;

				const piNext = pi.get(next);
				for(const stateNext of piNext.keys()) {
					if(statesM2.has(stateNext)) {
						stateM2.addNext(arrow,statesM2.get(stateNext));
					}
				}
			}
		}
	}
	
	return automaton;
}

function buildM3(M2,arrowFactory) {
	const automaton = new AutomatonSingleStart();
	
	const statesM3 = automaton.states;
	
	const start = new AutomatonStateDeterministic(new SerialSet([M2.end]));
	automaton.start = start;
	
	const stack = [{
		stateM3: start
	}];
	while(stack.length > 0) {
		const stackElem = stack.pop();
		const stateM3 = stackElem.stateM3;
		
		if(!statesM3.has(stateM3)) {
			statesM3.set(stateM3,stateM3);
			
			for(const state of stateM3.id) {
				if(M2.start.has(state)) {
					automaton.end.add(stateM3);
					break;
				}
			}
			
			const {map,negativeArrow} = buildArrowMap(stateM3,arrowFactory);			
			stateM3.information.negativeArrow = negativeArrow;
			
			for(const [arrow,states] of map.entries()) {
				stack.push({
					stateM3: new AutomatonStateDeterministic(states),
					from: stateM3,
					arrow: arrow
				});
			}
		}
		if(Utilities.hasProperty(stackElem,"from")) {
			stackElem.from.addNext(stackElem.arrow,statesM3.get(stateM3));
		}
	}
	
	return automaton;
}
function buildArrowMap(stateM3,arrowFactory) {
	const map = new SerialMap();
	let negativeArrow = null;
	
	for(const state of stateM3.id) {
		for(const [arrow,states] of state.getAllPrevious()) {
			if(arrow.arrowType === "letter") {
				const stateSet = buildArrowMapAddStates(map,arrow,states);
				
				if(negativeArrow !== null) {
					if(!negativeArrow.elements.has(arrow.value)) {
						stateSet.union(map.get(negativeArrow),true);
						negativeArrow = buildArrowMapNegativeArrowUpdate(map,arrowFactory,negativeArrow,(new ExtendedSet([arrow.value])).union(negativeArrow.elements,true),map.get(negativeArrow));
					}
				}
			} else {
				if(!arrow.negative) {
					for(const value of arrow.elements) {
						const stateSet = buildArrowMapAddStates(map,arrowFactory.arrowLetter.add(value),states);
						
						if(negativeArrow !== null) {
							if(!negativeArrow.elements.has(value)) {
								stateSet.union(map.get(negativeArrow),true);
								negativeArrow = buildArrowMapNegativeArrowUpdate(map,arrowFactory,negativeArrow,(new ExtendedSet([value])).union(negativeArrow.elements,true),map.get(negativeArrow));
							}
						}
					}
				} else {
					if(negativeArrow === null) {
						negativeArrow = arrow;
						map.set(negativeArrow,states);
						
						for(const arrow of map.keys()) {
							if(arrow.arrowType === "letter" && !negativeArrow.elements.has(arrow.value)) {
								map.get(arrow).union(states,true);
								negativeArrow = buildArrowMapNegativeArrowUpdate(map,arrowFactory,negativeArrow,(new ExtendedSet([arrow.value])).union(negativeArrow.elements,true),map.get(negativeArrow));
							}
						}
					} else {
						const diff1 = negativeArrow.elements.difference(arrow.elements);
						const diff2 = arrow.elements.difference(negativeArrow.elements);
						const inter = arrow.elements.union(negativeArrow.elements);
						
						for(const value of diff1) {
							buildArrowMapAddStates(map,arrowFactory.arrowLetter.add(value),states);
						}
						
						for(const value of diff2) {
							buildArrowMapAddStates(map,arrowFactory.arrowLetter.add(value),map.get(negativeArrow));
						}
						
						negativeArrow = buildArrowMapNegativeArrowUpdate(map,arrowFactory,negativeArrow,inter,map.get(negativeArrow).union(states,true));
					}
				}
			}
		}
	}
	
	return {
		map: map,
		negativeArrow: negativeArrow
	};
}
function buildArrowMapAddStates(map,arrow,states) {
	let stateSet;
	if(!map.has(arrow)) {
		stateSet = new SerialSet();
		map.set(arrow,stateSet);
	} else {
		stateSet = map.get(arrow);
	}
	stateSet.union(states,true);
	return stateSet;
}
function buildArrowMapNegativeArrowUpdate(map,arrowFactory,negativeArrow,arrowElements,states) {
	const arrowClass = arrowFactory.arrowClass.add(arrowElements,true);
	map.delete(negativeArrow);
	map.set(arrowClass,states);
	return arrowClass;
}

function buildM4(M1,M2,M3,pi,arrowFactory) {
	const automaton = new AutomatonSingleStartEnd();
	
	const statesM4 = automaton.states;

	for(const state of M2.states.values()) {
		const newState = new AutomatonStateDeterministic(state.id);
		statesM4.set(newState,newState);
	}
	
	automaton.end = statesM4.get(M2.end);
	
	const start = new AutomatonStateDeterministic(0);
	statesM4.set(start,start);
	automaton.start = start;
	
	for(const state of M3.states.values()) {
		for(const [arrow,next] of state.getAllNext()) {
			for(const stateNext of next.id) {
				let maxState = null;
				let pis = pi.get(M1.states.get(stateNext).getAllNext().next().value[1]);
				let max = null;
				
				for(const stateM2 of state.id) {
					if(pis.has(stateM2)) {
						const tmp = pis.get(stateM2);
						
						if(compareValues(tmp,max) < 0) {
							maxState = stateM2;
							max = tmp;
						}
					}
				}
				statesM4.get(stateNext).addNext(arrowFactory.arrowState.add(state,filterPi(max)),statesM4.get(maxState));
			}
		}
		
		if(M3.end.has(state)) {
			for(const stateM2 of state.id) {
				if(M2.start.has(stateM2)) {
					let maxState = null;
					let pis = pi.get(M1.start);
					let max = null;
					
					for(const stateM2 of state.id) {
						if(pis.has(stateM2)) {
							const tmp = pis.get(stateM2);
							
							if(compareValues(tmp,max) < 0) {
								maxState = stateM2;
								max = tmp;
							}
						}
					}
					statesM4.get(automaton.start).addNext(arrowFactory.arrowState.add(state,filterPi(max)),statesM4.get(maxState));
				}
			}
		}
	}
	
	return automaton;
}