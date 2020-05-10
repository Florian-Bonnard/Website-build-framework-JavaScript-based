import {Utilities} from "./import.js";
import {SerialSet} from "./structures/export.js";

const namespace = Utilities.buildNamespace();

export default class DependencyNode {
	constructor(id,left,right) {
		const state = namespace(this);
		state.children = new SerialSet();
		state.id = id;
		state.parents = new SerialSet();
		state.serial = id;
	}
	
	get children() {
		return namespace(this).children;
	}
	
	get id() {
		return namespace(this).id;
	}
	
	get parents() {
		return namespace(this).parents;
	}
	
	getAllChildren() {
		const queue = Array.from(this.children);
		const res = new SerialSet();
		
		while(queue.length > 0) {
			const elem = queue.pop();
			
			if(!res.has(elem)) {
				res.add(elem);
				queue.push(...Array.from(elem.children));
			}
		}
		
		return res;
	}
	
	getAllParents() {
		const queue = Array.from(this.parents);
		const res = new SerialSet();
		
		while(queue.length > 0) {
			const elem = queue.pop();
			
			if(!res.has(elem)) {
				res.add(elem);
				queue.push(...Array.from(elem.parents));
			}
		}
		
		return res;
	}
	
	toSerial() {
		return namespace(this).serial;
	}
}