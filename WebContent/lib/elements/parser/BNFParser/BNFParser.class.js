import {Utilities} from "./import.js";
import BNFGrammar from "./BNFGrammar.class.js";
import Rule from "./rule.class.js";

const namespace = Utilities.buildNamespace();

export default class BNFParser {
	constructor(gramBNF) {
		const state = namespace(this);
		state.gram = new BNFGrammar(parseBNF(gramBNF));
	}
	
	get gram() {
		return namespace(this).gram;
	}
}

const tokenEscape = new Set(["\\",">"]);
const getOr = new RegExp("^[^<]*\\|");
const hasNextToken = new RegExp("<");

function parseBNF(gramBNF) {
	const gram = [];
	
	for(const left of Reflect.ownKeys(gramBNF)) {
		gram.push(...parseBNFfetch(left,gramBNF[left]));
	}
	
	return gram;
}

function parseBNFfetch(left,rules) {
	let right = [];
	const build = [new Rule(left,right)];
	
	while(true) {
		if(getOr.test(rules)) {
			right = [];
			build.push({
				left: left,
				right: right
			});
		}
		if(hasNextToken.test(rules)) {
			const {newRules,token} = parseBNFNextToken(rules);
			rules = newRules;
			right.push(token);
		} else {
			break;
		}
	}
	
	return build;
}

function parseBNFNextToken(rules) {
	let i = 0;
	const len = rules.length;
	let hasStarted = 0;
	let escaping = 0;
	let token = [];
	
	while(i < len) {
		const c = rules[i];
		if(!hasStarted) {
			if(c === "<") {
				hasStarted = 1;
			}
		} else {
			if(tokenEscape.has(c)) {
				if(escaping) {
					escaping = 0;
					token.push(c);
				} else {
					if(c === ">") {
						return {
							newRules: rules.substring(i+1,rules.length),
							token: token.join("")
						};
					} else if(c === "\\") {
						escaping = 1;
					}
				}
			} else {
				escaping = 0;
				token.push(c);
			}
		}
		i++;
	}
	
	throw("wrong input for BNF grammar");
}