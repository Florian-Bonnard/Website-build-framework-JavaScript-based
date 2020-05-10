import {DEBUG} from "./params.const.js";
import Mutex from "./mutex.class.js";
import WebElement from "./../abstracts/webElement.class.js";

/*
insert "child" in the childnodes of "node" so that it has the index "index" in the childnodes after that
*/
function insertChildAtIndex(node,child,index) {
	if(DEBUG) {
		if(!instanceOf(node,Node)) {
			error("insertChildAtIndex",1,node,"Node");
		}
		if(!instanceOf(child,Node)) {
			error("insertChildAtIndex",2,child,"Node");
		}
		if(!instanceOf(index,"number")) {
			error("insertChildAtIndex",3,index,"number");
		}
	}
	
	const childNodes = node.childNodes;
    
	if(index >= childNodes.length) {
        node.appendChild(child);
    } else {
        node.insertBefore(child,childNodes[index]);
    }
}
/*
insert "child" before "node"
*/
function insertBefore(node,child) {
	if(DEBUG) {
		if(!instanceOf(node,Node)) {
			error("insertBefore",1,node,"Node");
		}
		if(!instanceOf(child,Node)) {
			error("insertBefore",2,child,"Node");
		}
	}
	
    node.parentNode.insertBefore(child,node);
}
/*
insert "child" after "node"
*/
function insertAfter(node,child) {
	if(DEBUG) {
		if(!instanceOf(node,Node)) {
			error("insertAfter",1,node,"Node");
		}
		if(!instanceOf(child,Node)) {
			error("insertAfter",2,child,"Node");
		}
	}
	
    node.parentNode.insertBefore(child,node.nextSibling);
}

function transferChildren(node1,node2) {
	if(DEBUG) {
		if(!instanceOf(node1,Node)) {
			error("transferChildren",1,node1,"Node");
		}
		if(!instanceOf(node2,Node)) {
			error("transferChildren",2,node2,"Node");
		}
	}
	
	for(const e of Array.from(node2.childNodes)) {
		node1.appendChild(e);
	}
}

/*
check if "node" has a tagname inside "tagName"
*/
function hasTagName(node,tagName) {
	if(node === null) {
		return false;
	}
	
	if(DEBUG) {
		if(!instanceOf(node,Node)) {
			error("hasTagName",1,node,"null|Node");
		}
		if(instanceOf(tagName,Array)) {
			for(const e of tagName) {
				if(!instanceOf(e,"string")) {
					error("hasTagName",2,tagName,"string|Array<string>");
				}
			}
		} else if(!instanceOf(tagName,"string")) {
			error("hasTagName",2,tagName,"string|Array<string>");
		}
	}
	
	if(node.nodeType !== 1) {
		return false;
	}
	
	if(instanceOf(tagName,"string")) {
		return tagName === node.tagName.toLowerCase();
	}
	
    return tagName.includes(node.tagName.toLowerCase());
}

/*
check if "node" has a attribute inside "attribute" or all of them
*/
function hasAttribute(node,attribute,hasAll = false) {
	if(node === null) {
		return false;
	};
	
	if(DEBUG) {
		if(!instanceOf(node,Node)) {
			error("hasAttribute",1,node,"null|Node");
		}
		if(instanceOf(attribute,Array)) {
			for(const e of attribute) {
				if(!instanceOf(e,"string")) {
					error("hasAttribute",2,attribute,"string|Array<string>");
				}
			}
		} else if(!instanceOf(attribute,"string")) {
			error("hasAttribute",2,attribute,"string|Array<string>");
		}
	}
	
    if(node.nodeType !== 1) {
    	return false;
    }
    
    if(instanceOf(attribute,"string")) {
		return node.hasAttribute(attribute);
	}
    
    return hasAllTest(node.hasAttribute,node,attribute,hasAll);
}

/*
check if "obj" has a property inside "property" or all of them
*/
function hasProperty(obj,property,hasAll = false) {
	if(obj === null) {
		return false;
	}
	
	if(DEBUG) {
		if(!isObj(obj)) {
			error("hasProperty",1,obj,"null|object");
		}
		if(instanceOf(property,Array)) {
			for(const e of property) {
				if(!instanceOf(e,["string","symbol"])) {
					error("hasProperty",2,property,"string|symbol|Array<string|symbol>");
				}
			}
		} else if(!instanceOf(property,["string","symbol"])) {
			error("hasProperty",2,property,"string|symbol|Array<string|symbol>");
		}
	}
	
	if(instanceOf(property,["string","symbol"])) {
		return Object.prototype.hasOwnProperty.apply(obj,[property]);
	}
	
    return hasAllTest(obj.hasOwnProperty,obj,property,hasAll);
}

/*
check if "node" has a type inside "type" or all of them
*/
function hasType(node,type,hasAll = false) {
	if(node === null) {
		return false;
	}
	
	if(DEBUG) {
		if(!instanceOf(node,Node)) {
			error("hasType",1,node,"null|Node");
		}
		if(instanceOf(type,Array)) {
			for(const e of type) {
				if(!instanceOf(e,"string")) {
					error("hasType",2,type,"string|Array<string>");
				}
			}
		} else if(!instanceOf(type,"string")) {
			error("hasType",2,type,"string|Array<string>");
		}
	}
	
    if(!instanceOf(node,WebElement)) {
    	return false;
    }
    
    const constructor = node.constructor;
    
    if(instanceOf(type,"string")) {
		return constructor.isType(type);
	}
    
    return hasAllTest(constructor.isType,constructor,type,hasAll);
}

function hasAllTest(fun,obj,array,hasAll) {
	fun = fun.bind(obj);

	if(hasAll) {
    	for(const e of array) {
        	if(!fun(e)) {
        		return false;
        	}
        }
        return true;
    } else {
    	for(const e of array) {
        	if(fun(e)) {
        		return true;
        	}
        }
    	return false;
    }
}

/*
return the closest ancestor of "node" with "prop" according to "fun" if it exists or null
*/
function getParentWith(fun,node,prop,hasAll) {
	if(DEBUG) {
		if(!instanceOf(fun,Function)) {
			error("getParentWith",1,fun,"Function");
		}
		if(node !== null && !instanceOf(node,Node)) {
			error("getParentWith",2,node,"null|Node");
		}
	}
	
	while(node !== null) {
		node = node.parentNode;
		if(fun(node,prop,hasAll)) {
			break;
		}
	}
	
	return node;
}
function getParentWithTagName(node,tagName) {
	return getParentWith(hasTagName,node,tagName);
}
function getParentWithAttribute(node,attribute,hasAll) {
	return getParentWith(node,attribute,hasAttribute,hasAll);
}
function getParentInstanceOf(node,sourceClass,hasAll) {
	return getParentWith(instanceOf,node,sourceClass,hasAll);
}
function getParentWithProperty(node,property,hasAll) {
	return getParentWith(hasProperty,node,property,hasAll);
}
function getParentWithType(node,type,hasAll) {
	return getParentWith(hasType,node,type,hasAll);
}

/*
return "string" value with "px" at the end if it is a number
*/
function parsePx(string = 0) {
	if(DEBUG) {
		if(!instanceOf(string,["number","string"])) {
			error("parsePx",1,string,"number|string");
		}
	}
	
    string = string.toString();
    
    if(string.length > 1 && string.substring(string.length-2,string.length) !== "px") {
        string += "px";
    }
    
    return string;
}

/*
return "string" value without "px" (if it exists) at the end as a number if possible
*/
function stripPx(string = 0) {
	if(DEBUG) {
		if(!instanceOf(string,["number","string"])) {
			error("stripPx",1,string,"number|string");
		}
	}
	
    string = string.toString();
    
    if(string.length > 1 && string.substring(string.length-2,string.length) === "px") {
        string = string.substring(0,string.length-2);
    }
    
    const number = Number.parseFloat(string);
    
    return number.toString() === string ? number : string;
}

/*
make a shallow copy of the owned properties of "obj" (thus including enumerable properties (which are defined as such and aren't symbols (since they can't be enumerable)) and non-enumerable properties (which are defined as such or are symbols))
*/
function shallowCopy(obj) {
	if(DEBUG) {
		if(!isObj(obj)) {
			error("shallowCopy",1,obj);
		}
	}
	
	const res = {};
	
	for(const e of Reflect.ownKeys(obj)) {
		res[e] = obj[e];
	}
	
	return res;
}

/*
make a shallow assign of the owned properties of "obj2" (thus including enumerable properties (which are defined as such and aren't symbols (since they can't be enumerable)) and non-enumerable properties (which are defined as such or are symbols)) to "obj1"
*/
function shallowAssign(obj1,obj2) {
	if(DEBUG) {
		if(!isObj(obj1)) {
			error("shallowAssign",1,obj1);
		}
		if(!isObj(obj2)) {
			error("shallowAssign",2,obj2);
		}
	}
	
	for(const e of Reflect.ownKeys(obj2)) {
		obj1[e] = obj2[e];
	}
	
	return obj1;
}

/*
return "init" if "v" is undefined
*/
function defaultIfUndefined(v,init) {
	return v !== undefined ? v : init;
}

/*
get all the keys (of both properties and symbols) of obj
*/
function getAllKeys(obj) {
	if(DEBUG) {
		if(!isObj(obj)) {
			error("getAllKeys",1,obj);
		}
	}
	
	const keys = Reflect.ownKeys(obj);
	let proto = obj;
	
	while((proto = Reflect.getPrototypeOf(proto)) !== null) {
		keys.push(...Reflect.ownKeys(proto));
	}
	
	return Array.from(new Set(keys));
}

function removeArrayElement(array,index) {
	if(DEBUG) {
		if(!instanceOf(array,Array)) {
			error("removeArrayElement",1,array,"Array");
		}
		if(!instanceOf(index,"number")) {
			error("removeArrayElement",2,index,"number");
		}
	}
	
	const res = array.slice(0,index);
	res.push(...array.slice(index+1,array.length));
	return res;
}

/*
setup the template at URL
*/
function getTemplateScope() {
	const base = (new RegExp("^(.*)/[^/]*/[^/]*$")).exec(import.meta.url)[1];
	const mutex = new Mutex();
	
	return async (URL) => {
		if(DEBUG) {
			const regex = new RegExp("^[A-Za-z0-9]*$");
			if(!instanceOf(URL,"string")) {
				error("getTemplate",1,URL,"RegExp(^[A-Za-z0-9]*$)");
			}
		}
		
		const unlock = await mutex.lock();
		
		if(!window.web) {
			window.web = {};
		}
		
		if(!window.web.templates) {
			window.web.templates = {};
		}
		
		if(!window.web.templates[URL]) {
			const {template,update} = await import(`${base}/templates/${URL}.template.js`);
			const build = window.document.createElement("template");
			build.innerHTML = template;
			removeText(build.content);
			const result = build.content;
			window.web.templates[URL] = {
				result: result,
				update: update
			};
		}
		
		unlock();
	}
}
const getTemplate = getTemplateScope();

function removeText(node) {
	if(!hasTagName(node,["style","script"])) {
		const childNodes = node.nodeType === 3 ? [node] : Array.from(node.childNodes);
		
		for(const e of childNodes) {
			if(e.nodeType === 3) {
				e.parentNode.removeChild(e);
			} else {
				removeText(e);
			}
		}
	}
}

function fromCSStoCamelCase(prop) {
	if(DEBUG) {
		if(!instanceOf(prop,"string")) {
			error("fromCSStoCamelCase",1,prop,"string");
		}
	}
	
	const regex = new RegExp("-(.)","g");
	return prop.replace(regex,(match,p1,offset,string) => {
		return p1.toUpperCase();
	});
}

function fromCameltoCSSCase(prop) {
	if(DEBUG) {
		if(!instanceOf(prop,"string")) {
			error("fromCameltoCSSCase",1,prop,"string");
		}
	}
	
	const regex = new RegExp("[A-Z]","g");
	return prop.replace(regex,(match,offset,string) => {
		return `-${match.toLowerCase()}`;
	});
}

/*
build internal state for private class fields
*/
function buildNamespace() {
	const map = new WeakMap();
	
	return function(obj) {
		if(!map.has(obj)) {
			map.set(obj,{});
		}
		return map.get(obj);
	};
}

/*
custom instanceof method which enables solving issues with instanceof operator when "hard" is set to false (like "string" is not an instanceof String (same with other primitive types))
*/
function instanceOf(obj,types,hard) {
	if(!_instanceOf(types,Array)) {
		return _instanceOf(obj,types,hard);
	}
	
	for(const e of types) {
		if(_instanceOf(obj,e,hard)) {
			return true;
		}
	}
	
	return false;
}
function _instanceOf(obj,type,hard = true) {
	if(DEBUG) {
		if(typeof(hard) !== "boolean") {
			error("_instanceOf",3,hard,"boolean");
		}
		if(!isObj(type) && typeof(type) !== "string") {
			error("_instanceOf",2,type,"object|string");
		}
	}
	
	if([null,undefined].includes(obj)) {
		return false;
	}
	
	if(!isObj(obj)) {
		if(hard) {
			if(typeof(type) === "string") {
				return type === typeof(obj);
			}
			return false;
		}
		obj = new Object(obj);
	}
	
	if(!hard) {
		if(typeof(type) === "string") {
			switch(type) {
				case "boolean":
					type = Boolean;
					break;
				case "number":
					type = Number;
					break;
				case "bigint":
					type = BigInt;
					break;
				case "string":
					type = String;
					break;
				case "symbol":
					type = Symbol;
					break;
				case "function":
					type = Function;
					break;
				case "object":
					return true;
				break;
			}
		}
	}
	
	if(type.prototype === undefined) {
		return false;
	}
	
	let proto = type.prototype;
	let prototype = Reflect.getPrototypeOf(obj);
	
	while(prototype !== null && prototype !== proto) {
		prototype = Reflect.getPrototypeOf(prototype);
	}
	
	return prototype === proto;
}

/*
return true if "obj" is any object which could be created with Object.create()
*/
function isObj(obj) {
	return obj !== null && ["function","object"].includes(typeof(obj));
}

/*
check that "array" is an instanceOf Array, if not transform it into one
*/
function arrayInput(array) {
	return _instanceOf(array,Array) ? array : [array];
}

/*
generate custom error for errors while using "isObj" and "instanceOf" for function / method parameters
*/
function error(functionName,paramNum,value,types = "object") {
	throw(`"${functionName}" needs "param${paramNum}" to be: ${types} (found: ${value})`);
}

function* numericBuilder(seed = 1) {
	if(DEBUG) {
		if(!instanceOf(seed,"number")) {
			error("numericBuilder",1,seed,"number");
		}
	}
	
	while(true) {
		yield seed++;
	}
}

export {DEBUG,insertChildAtIndex,insertBefore,insertAfter,transferChildren,hasTagName,hasAttribute,hasProperty,hasType,getParentWithTagName,getParentWithAttribute,getParentInstanceOf,getParentWithProperty,getParentWithType,parsePx,stripPx,shallowCopy,shallowAssign,defaultIfUndefined,getAllKeys,removeArrayElement,getTemplate,fromCSStoCamelCase,fromCameltoCSSCase,buildNamespace,instanceOf,isObj,arrayInput,error,numericBuilder};