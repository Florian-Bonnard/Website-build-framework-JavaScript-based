import {Utilities} from "./import.js";
import {ExtendedMap,ExtendedSet,instances,cssInstances,dependencies,dependenciesPriority} from "./../parser/export.js";

const namespace = Utilities.buildNamespace();

export default class WebElement extends HTMLElement {
    constructor() {
        super();
        if(this.constructor === WebElement) {
        	throw("can't instantiate abstract class WebElement");
        }
        namespace(this).attributes = new ExtendedMap();
    }
    
    appendChild(child) {
    	super.appendChild(child);
    	changedEnvironmentCallback(this);
    }
    
    insertBefore(newNode,referenceNode) {
    	super.insertBefore(newNode,referenceNode);
    	changedEnvironmentCallback(this);
    }
    
    replaceChild(newChild,oldChild) {
    	super.replaceChild(newChild,oldChild);
    	changedEnvironmentCallback(this);
    }
    
    removeChild(child) {
    	super.removeChild(child);
    	changedEnvironmentCallback(this);
    }

    connectedCallback() {
    	const state = namespace(this);
	    state.connected = 1;
    	
        initStyle(this);
    	
    	for(const e of dependenciesPriority) {
    		if(Utilities.hasAttribute(this,e)) {
	    		this[e] = WebElement.getAttribute(this,e);
	    	}
    	}
    	for(const e of namespace(this.constructor).observedAttributes) {
    		if(Utilities.hasAttribute(this,e) && !dependencies.has(e)) {
	    		this[e] = WebElement.getAttribute(this,e);
	    	}
    	}
    	setDefaultValues(this);

	    connectedCallbackEnd(this);
    }
    
    isConnected() {
    	return namespace(this).connected;
    }
    
    disconnectedCallback() {}
    
    static isType(type) {
    	if(Utilities.DEBUG) {
    		validateIsType(type);
    	}
    	
    	return namespace(this).isType.has(type);
    }
    
    static getAttribute(elem,prop) {
    	if(Utilities.DEBUG) {
    		if(!Utilities.instanceOf(elem,WebElement)) {
    			Utilities.error("getAttribute",1,elem,"WebElement");
    		}
    		if(!Utilities.instanceOf(prop,"string")) {
    			Utilities.error("getAttribute",2,prop,"string");
    		}
    	}
    	
    	return elem.hasAttribute(prop) ? elem.getAttribute(prop) : "";
    }
    static setAttribute(elem,prop,v) {
    	if(Utilities.DEBUG) {
    		if(!Utilities.instanceOf(elem,WebElement)) {
    			Utilities.error("setAttribute",1,elem,"WebElement");
    		}
    		if(!Utilities.instanceOf(prop,"string")) {
    			Utilities.error("setAttribute",2,prop,"string");
    		}
    		if(!Utilities.instanceOf(v,["number","string"])) {
    			Utilities.error("setAttribute",3,v,"number|string");
    		}
    	}
    	
    	elem.setAttribute(prop,v.toString());
    	
    	if(elem.isConnected()) {
    		changedCallback(elem,removeHiddenProp(elem,prop),v);
    	}
    }
    
    static build(obj) {
    	if(Utilities.DEBUG) {
			validateBuild(obj,"build",1,false,true);
		}
    	
    	const type = obj.type;
    	
    	setIsType(type,obj.isType);
    	
		setObservedAttributes(type,obj.observedAttributes);
    	if(Utilities.hasProperty(obj,"observedAttributes")) {
    		for(const e of obj.observedAttributes) {
    			if(dependencies.has(e)) {
    				const children = dependencies.get(e).getAllChildren();
    				for(const dependency of children) {
    					setObservedAttribute(type,dependency.id);
    					namespace(type).observedAttributes.add(dependency.id);
    				}
    			}
    			
    			setObservedAttribute(type,e);
        	}
    	}
    	
    	if(Utilities.hasProperty(obj,"defaultValue")) {
    		const items = new ExtendedMap(Object.entries(obj.defaultValue));
    		const priority = getPropInitPriority(items);
    		namespace(type).defaultValue = {
    			items: items,
    			priority: priority
    		};
    	}
    	
    	if(Utilities.hasProperty(obj,"initStyle")) {
	    	const items = new ExtendedMap(Object.entries(obj.initStyle));
    		const priority = getPropInitPriority(items);
    		namespace(type).initStyle = {
    			items: items,
    			priority: priority
    		};
    	}
    	
    	if(Utilities.hasProperty(obj,"connectedCallback")) {
        	type.prototype.connectedCallback = function() {
		     	obj.connectedCallback.apply(this);
				Reflect.getPrototypeOf(type.prototype).connectedCallback.apply(this);
        	};
    	}
    	
    	if(Utilities.hasProperty(obj,"connectedCallbackEnd")) {
    		namespace(type).connectedCallbackEnd = obj.connectedCallbackEnd;
    	}
    	
    	if(Utilities.hasProperty(obj,"disconnectedCallback")) {
        	type.prototype.disconnectedCallback = function() {
		     	obj.disconnectedCallback.apply(this);
				Reflect.getPrototypeOf(type.prototype).disconnectedCallback.apply(this);
        	};
    	}
    	
    	if(Utilities.hasProperty(obj,"changedEnvironmentCallback")) {
    		namespace(type).changedEnvironmentCallback = obj.changedEnvironmentCallback;
    	}
    	
    	if(Utilities.hasProperty(obj,"changedEnvironmentCallbackEnd")) {
    		namespace(type).changedEnvironmentCallbackEnd = obj.changedEnvironmentCallbackEnd;
    	}
    	
    	if(Utilities.hasProperty(obj,"changedCallback")) {
    		namespace(type).changedCallback = obj.changedCallback;
    	}
    }
    
    static combineBuilds(...objs) {
		if(Utilities.DEBUG) {
			for(const e of objs) {
				validateBuild(e,"combineBuilds",1);
			}
		}
    	
    	const obj = {};
    	for(const e of objs) {
    		combineBuildArray(obj,e,"isType");
    		combineBuildArray(obj,e,"observedAttributes");
    		combineBuildObject(obj,e,"defaultValue");
    		combineBuildObject(obj,e,"initStyle");
    		combineBuildFunction(obj,e,"connectedCallback");
    		combineBuildFunction(obj,e,"connectedCallbackEnd");
    		combineBuildFunction(obj,e,"disconnectedCallback");
    		combineBuildFunction(obj,e,"changedEnvironmentCallback");
    		combineBuildFunction(obj,e,"changedEnvironmentCallbackEnd");
    		combineBuildFunction(obj,e,"changedCallback");
    	}
    	return obj;
    }
}

function getPropInitPriority(props) {
	const priority = [];
	const priorityVisited = new ExtendedSet();
	
	for(const e of dependenciesPriority) {
		if(props.has(e)) {
    		priority.push(e);
    		priorityVisited.add(e);
		}
	}
	for(const e of props.keys()) {
		if(!priorityVisited.has(e)) {
    		priority.push(e);
		}
	}
	
	return priority;
}

function removeHiddenProp(elem,prop) {
	if(prop.length >= 3 && prop.substring(prop.length-3,prop.length) === "---") {
		prop = prop.substring(0,prop.length-3);
		if(Utilities.hasProperty(elem,prop)) {
			throw(`an instance of ${elem.constructor} can't have an observed attribute ${prop} when he has a hidden attribute with the same name`);
		}
	}
	return prop;
}

function combineBuildArray(obj,e,prop) {
	if(Utilities.hasProperty(e,prop)) {
		if(!(prop in obj)) {
			obj[prop] = [];
		}
		obj[prop].push(...e[prop]);
	}
}

function combineBuildObject(obj,e,prop) {
	if(Utilities.hasProperty(e,prop)) {
		if(!(prop in obj)) {
			obj[prop] = {};
		}
		Utilities.shallowAssign(obj[prop],e[prop]);
	}
}

function combineBuildFunction(obj,e,prop) {
	if(Utilities.hasProperty(e,prop)) {
		if(!(prop in obj)) {
			obj[prop] = e[prop];
		} else {
			const fun = obj[prop];
			obj[prop] = function(...args) {
				return e[prop].apply(this,args) || fun.apply(this,args);
			};
		}
	}
}

WebElement.baseDefaultValue = new ExtendedMap(Object.entries({
	"margin-top": "0px",
	"margin-right": "0px",
	"margin-bottom": "0px",
	"margin-left": "0px",
	
	"padding-top": "0px",
	"padding-right": "0px",
	"padding-bottom": "0px",
	"padding-left": "0px",
	
	"overflow-x": "hidden",
	"overflow-y": "hidden",
	
	"font-style": "normal",
	"font-variant": "normal",
	"font-weight": "normal",
	"font-stretch": "normal",
	"font-size": "100%",
	"line-height": "normal",
	"font-family": "serif",
	
	"box-shadow-inset": "",
	"box-shadow-offset-x": "0px",
	"box-shadow-offset-y": "0px",
	"box-shadow-blur-radius": "0px",
	"box-shadow-spread-radius": "0px",
	"box-shadow-color": "#FFFFFF00",
	
	"border-width": "0px",
	"border-style": "solid",
	"border-color": "#000000",
	
	"position": "relative",
	"top": "auto",
	"right": "auto",
	"bottom": "auto",
	"left": "auto",
	
	"float": "none",
	
	"background-color": "#FFFFFF00",
	
	"color": "#000000",
	
	"text-align": "center",
	
	"vertical-align": "baseline",
	
	"white-space": "normal",
	
	"display": "inline-block",
	
	"box-sizing": "border-box",
	"height": "auto",
	"min-height": "0px",
	"max-height": "none",
	"width": "auto",
	"min-width": "0px",
	"max-width": "none",
	
	"cursor": "default",
	
	"grid-template-columns": "none",
	"grid-template-rows": "none",
	
	"grid-column-start": "auto",
	"grid-column-end": "auto",
	"grid-row-start": "auto",
	"grid-row-end": "auto",
	
	"align-self": "stretch",
	"justify-self": "stretch"		
}));

function setObservedAttribute(type,e) {
	const camelCase = Utilities.fromCSStoCamelCase(e);
	
	if(!Utilities.hasProperty(type.prototype,e)) {
		const prop = {
			set: function(v) {
				WebElement.setAttribute(this,e,v);
			}
		};
		
		if(!dependencies.has(e) || dependencies.get(e).children.size === 0) {
			prop.get = function() {
	    		return WebElement.getAttribute(this,e);
	    	};
		}
		
		Object.defineProperty(type.prototype,e,prop);
		
		if(e !== camelCase) {
			Object.defineProperty(type.prototype,camelCase,prop);
		}
	}	
}

function setIsType(type,isType) {
	setSetFromArray(type,isType,"isType");
}
namespace(WebElement).isType = new ExtendedSet();
function setObservedAttributes(type,observedAttributes) {
	setSetFromArray(type,observedAttributes,"observedAttributes");
}
namespace(WebElement).observedAttributes = new ExtendedSet();
function setSetFromArray(type,array,name) {
	const state = namespace(type);
	state[name] = new ExtendedSet(array);
	state[name].union(namespace(Reflect.getPrototypeOf(type))[name],true);
}

function setDefaultValues(elem) {
	const map = new ExtendedMap();
	
	for(const e of namespace(elem.constructor).observedAttributes) {
		if(!Utilities.hasAttribute(elem,e) && (!dependencies.has(e) || dependencies.get(e).children.size === 0)) {
			map.set(e,WebElement.baseDefaultValue.has(e) ? WebElement.baseDefaultValue.get(e) : "");
		}
	}
	
	setDefaultValuesExec(elem.constructor,elem,map);
	
	for(const [name,value] of map) {
		elem[name] = value;
	}
}
function setDefaultValuesExec(prototype,elem,map) {
	if(prototype !== WebElement) {
		setDefaultValuesExec(Reflect.getPrototypeOf(prototype),elem,map);
		const obj = namespace(prototype).defaultValue;
		
		if(obj !== undefined) {
			const {items,priority} = obj;
			for(const e of priority) {
				if(!Utilities.hasAttribute(elem,e)) {
					map.set(e,items.get(e));
				}
			}
		}
	}
}

function initStyle(elem) {
	setStyle(elem,"box-sizing","border-box");
	initStyleExec(elem.constructor,elem);
}
function initStyleExec(prototype,elem) {
	if(prototype !== WebElement) {
		initStyleExec(Reflect.getPrototypeOf(prototype),elem);
		const obj = namespace(prototype).initStyle;
		
		if(obj !== undefined) {
			const {items,priority} = obj;
			for(const e of priority) {
				setStyle(elem,e,items.get(e));
			}
		}
	}
}

function connectedCallbackEnd(elem) {
	callbackEndExec(elem.constructor,(prototype) => {
		const obj = namespace(prototype).connectedCallbackEnd;
		if(obj !== undefined) {
    		obj.apply(elem);
		}
	});
}

function changedEnvironmentCallback(elem) {
	let prototype = elem.constructor;
	while(prototype !== WebElement) {
		const obj = namespace(prototype).changedEnvironmentCallback;
		if(obj !== undefined) {
    		obj.apply(elem);
		}
		prototype = Reflect.getPrototypeOf(prototype);
	}
	changedEnvironmentCallbackEnd(elem);
}

function changedEnvironmentCallbackEnd(elem) {
	callbackEndExec(elem.constructor,(prototype) => {
		const obj = namespace(prototype).changedEnvironmentCallbackEnd;
		if(obj !== undefined) {
    		obj.apply(elem);
		}
	});
}

function changedCallback(elem,name,value) {
	let prototype = elem.constructor;
	while(prototype !== WebElement) {
		const obj = namespace(prototype).changedCallback;
		if(obj !== undefined) {
    		const res = obj.apply(elem,[name,value]);
		    if(res === true) {
		   		return;
		   	}
		}
		prototype = Reflect.getPrototypeOf(prototype);
	}
	
	if(cssInstances.has(name)) {
		setStyle(elem,name,value,true);
	}
}

function callbackEndExec(prototype,fun) {
	if(prototype !== WebElement) {
		callbackEndExec(Reflect.getPrototypeOf(prototype),fun);
		fun(prototype);
	}
}

function setStyle(elem,name,value,changedCallback = false) {
	value = value.toString();
	
	if(Utilities.DEBUG) {
		const res = instances[name].parse(value);
		
		if(!res.res) {
			propError(name,value);
		} else {	
			switch(name) {
				case "box-shadow-inset":
				case "box-shadow-offset-x":
				case "box-shadow-offset-y":
				case "box-shadow-blur-radius":
				case "box-shadow-spread-radius":
				case "box-shadow-color": {
					setBoxShadow(elem,res.map);
					break;
				}
				default: {
					if(res.map.size === 1) {
						elem.style[name] = value;
					} else {
						for(const [name,value] of res.map) {
							if(changedCallback) {
								elem[name] = value;
							} else {
								setStyle(elem,name,value);
							}
						}
					}
					break;
				}
			}
			
			if(res.map.size === 1) {
				namespace(elem).attributes.set(name,value);
			}
		}
	} else {
		if(dependencies.has(name) && dependencies.get(name).children.size > 0) {
			const res = instances[name].parse(value);
			
			for(const [name,value] of res.map) {
				if(changedCallback) {
					elem[name] = value;
				} else {
					setStyle(elem,name,value);
				}
			}
		} else {
			switch(name) {
				case "box-shadow-inset":
				case "box-shadow-offset-x":
				case "box-shadow-offset-y":
				case "box-shadow-blur-radius":
				case "box-shadow-spread-radius":
				case "box-shadow-color": {
					setBoxShadow(elem,new ExtendedMap([[name,value]]));
					break;
				}
				default: {
					elem.style[name] = value;
					break;
				}
			}
			
			namespace(elem).attributes.set(name,value);
		}
	}
}
const boxShadow = ["box-shadow-inset","box-shadow-offset-x","box-shadow-offset-y","box-shadow-blur-radius","box-shadow-spread-radius","box-shadow-color"];
function getboxShadow(elem) {
	const build = buildBaseBoxShadow(elem);
	return formatBoxShadow(elem,build);
}
function setBoxShadow(elem,map) {
	const build = buildBaseBoxShadow(elem);
	
	for(const [name,value] of map) {
		build.set(name,value);
	}
	
	elem.style["box-shadow"] = formatBoxShadow(elem,build);
}
function buildBaseBoxShadow(elem) {
	const build = new ExtendedMap();

	const attributes = namespace(elem).attributes;
	for(const e of boxShadow) {
		build.set(e,attributes.has(e) ? attributes.get(e) : WebElement.baseDefaultValue.get(e));
	}
	
	return build;
}
function formatBoxShadow(elem,props) {
	const a = boxShadow;
	return `${props.get(a[0])} ${props.get(a[1])} ${props.get(a[2])} ${props.get(a[3])} ${props.get(a[4])} ${props.get(a[5])}`;
}





let validateIsType;
let propError;
let validateBuild;
if(Utilities.DEBUG) {
	validateIsType = function(type) {
		if(!Utilities.instanceOf(type,"string")) {
			Utilities.error("isType",1,type,"string");
		}
	}
	
	
	
	propError = function(name,value) {
		throw(`wrong value input (${value}) for a ${name} attribute`);
	}
	
	
	
	
	const buildPropsExceptions = [
		"length",
		"name",
		"prototype"
	];
	const buildProtoProps = Utilities.getAllKeys(WebElement.prototype);

	const buildProtoPropsExceptions = [
		"constructor"
	];
	const buildProps = Utilities.getAllKeys(WebElement);
	
	validateBuild = function(obj,functionName,param,withArray = true,needType = false) {
		const errorParam = `${param}${withArray ? "([number]?)" : ""}`;
		
		if(!Utilities.isObj(obj)) {
			Utilities.error(functionName,errorParam,obj);
		}
		
		if(needType) {
	    	if(!obj || !obj.type || !Utilities.instanceOf(obj.type.prototype,WebElement)) {
	    		throw("you must build a class which inherits from WebElement");
	    	}
	    	
	    	const type = obj.type;
	
		    for(const e of buildProps) {
		    	if(Utilities.hasProperty(type,e) && !buildPropsExceptions.includes(e)) {
		    		throw("you can't build an object in the framework using methods which are owned by WebElement");
		    	}
		    }
	
		    const proto = type.prototype;
		    for(const e of buildProtoProps) {
		    	if(Utilities.hasProperty(proto,e) && !buildProtoPropsExceptions.includes(e)) {
		    		throw("you can't build an object in the framework using methods which are owned by WebElement");
		    	}
	    	}
		}
    	
    	if(Utilities.hasProperty(obj,"isType")) {
    		if(!Utilities.instanceOf(obj.isType,Array)) {
    			Utilities.error(functionName,`${errorParam}.isType`,obj.isType,"Array<string>");
    		}
    		for(const e of obj.isType) {
				if(!Utilities.instanceOf(e,"string")) {
	    			Utilities.error(functionName,`${errorParam}.isType`,obj.isType,"Array<string>");
				}
			}
    	}
    	
    	if(Utilities.hasProperty(obj,"observedAttributes")) {
    		if(!Utilities.instanceOf(obj.observedAttributes,Array)) {
    			Utilities.error(functionName,`${errorParam}.observedAttributes`,obj.observedAttributes,"Array<string(not ending with ---)>");
    		}
    		for(const e of obj.observedAttributes) {
				if(!Utilities.instanceOf(e,"string") || e.substring(e.length-3,e.length) === "---") {
	    			Utilities.error(functionName,`${errorParam}.observedAttributes`,obj.observedAttributes,"Array<string(not ending with ---)>");
				}
			}
    	}
    	
    	if(Utilities.hasProperty(obj,"defaultValue")) {
    		if(!Utilities.isObj(obj.defaultValue)) {
    			Utilities.error(functionName,`${errorParam}.defaultValue`,obj.defaultValue,"object<string,number|string>");
    		}
    		for(const e of Reflect.ownKeys(obj.defaultValue)) {
				if(!Utilities.instanceOf(e,"string") || !Utilities.instanceOf(obj.defaultValue[e],["number","string"])) {
	    			Utilities.error(functionName,`${errorParam}.defaultValue`,obj.defaultValue,"object<string,number|string>");
				}
			}
    	}
    	
    	if(Utilities.hasProperty(obj,"initStyle")) {
			if(!Utilities.isObj(obj.initStyle)) {
				Utilities.error(functionName,`${errorParam}.initStyle`,obj.initStyle,"object<string,number|string>");
			}
			for(const e of Reflect.ownKeys(obj.initStyle)) {
				if(!Utilities.instanceOf(e,"string") || !Utilities.instanceOf(obj.initStyle[e],["number","string"])) {
    				Utilities.error(functionName,`${errorParam}.initStyle`,obj.initStyle,"object<string,number|string>");
				}
			}
    	}
    	
    	if(Utilities.hasProperty(obj,"connectedCallback")) {
	    	if(!Utilities.instanceOf(obj.connectedCallback,Function)) {
	    		Utilities.error(functionName,`${errorParam}.connectedCallback`,obj.connectedCallback,"Function");
	    	}
    	}
    	
    	if(Utilities.hasProperty(obj,"connectedCallbackEnd")) {
	    	if(!Utilities.instanceOf(obj.connectedCallbackEnd,Function)) {
	    		Utilities.error(functionName,`${errorParam}.connectedCallbackEnd`,obj.connectedCallbackEnd,"Function");
	    	}
    	}
    	
    	if(Utilities.hasProperty(obj,"disconnectedCallback")) {
	    	if(!Utilities.instanceOf(obj.disconnectedCallback,Function)) {
	    		Utilities.error(functionName,`${errorParam}.disconnectedCallback`,obj.disconnectedCallback,"Function");
	    	}
    	}
    	
    	if(Utilities.hasProperty(obj,"changedEnvironmentCallback")) {
	    	if(!Utilities.instanceOf(obj.changedEnvironmentCallback,Function)) {
	    		Utilities.error(functionName,`${errorParam}.changedEnvironmentCallback`,obj.changedEnvironmentCallback,"Function");
	    	}
    	}
    	
    	if(Utilities.hasProperty(obj,"changedEnvironmentCallbackEnd")) {
	    	if(!Utilities.instanceOf(obj.changedEnvironmentCallbackEnd,Function)) {
	    		Utilities.error(functionName,`${errorParam}.changedEnvironmentCallbackEnd`,obj.changedEnvironmentCallbackEnd,"Function");
	    	}
    	}
    	
    	if(Utilities.hasProperty(obj,"changedCallback")) {
	    	if(!Utilities.instanceOf(obj.changedCallback,Function)) {
	    		Utilities.error(functionName,`${errorParam}.changedCallback`,obj.changedCallback,"Function");
	    	}
    	}
	}
}