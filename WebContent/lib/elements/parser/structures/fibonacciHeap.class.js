import {Utilities} from "./import.js";
import ExtendedMap from "./extendedMap.class.js";

const namespace = Utilities.buildNamespace();

export default class FibonacciHeap {
	constructor(compare) {
		const state = namespace(this);
		state.compare = compare;
		state.min = null;
		state.size = 0;
	}
	
	insert(elem) {
		const state = namespace(this);
		const {compare,min} = state;
		const heapElem = new FibonacciHeapElement(this,elem);
		
		state.min = addToList(min,heapElem);
		if(compare(heapElem.value,state.min.value) < 0) {
			state.min = heapElem;
		}
		
		state.size += 1;
		
		return heapElem;
	}
	
	get size() {
		return namespace(this).size;
	}
	
	get minimum() {
		return namespace(this).min;
	}
	
	union(heap) {
		const heap1 = namespace(this);
		const heap2 = namespace(heap);
		
		const min1 = heap1.min;
		const min2 = heap2.min;

		heap1.min = fusionList(min1,min2);
		
		if(min1 !== null && min2 !== null) {
			if(heap1.compare(min2.value,min1.value) < 0) {
				heap1.min = min2;
			}
		}
		
		heap1.size += heap2.size;
	}
	
	extractMin() {
		const state = namespace(this);
		
		const min = state.min;

		if(min !== null) {
			removeFromListAndStoreChildrenInParent(min);
			
			if(min === namespace(min).right) {
				state.min = null;
			} else {
				state.min = namespace(min).right;
				consolidate(state);
			}
			
			state.size -= 1;
		}
		
		return min;
	}
	
	decreaseKey(elem,value) {
		const state = namespace(this);
		
		if(namespace(elem).heap !== this) {
			throw("the element doesn't belong to this heap");
		}
		
		const compare = state.compare;
		
		if(compare(elem.value,value) < 0) {
			throw(`can't increase a key using "decreaseKey" function`);
		}
		
		elem.value = value;
		
		const parent = namespace(elem).parent;
		if(parent !== null && compare(elem.value,parent.value) < 0) {
			cut(state,elem);
			cascadingCut(state,parent);
		}
		
		if(compare(elem.value,state.min.value) < 0) {
			state.min = elem;
		}
	}
	
	delete(elem) {
		const state = namespace(this);
		
		if(namespace(elem).heap !== this) {
			throw("the element doesn't belong to this heap");
		}
		
		if(state.min === elem) {
			extractMin();
		} else {
			const parent = namespace(elem).parent;
			if(parent !== null) {
				cut(state,elem);
				cascadingCut(state,parent);
			}
			
			removeFromListAndStoreChildrenInParent(elem);
			consolidate(state);
			
			state.size -= 1;
		}
	}
}

function fusionList(list1,list2) {
	if(list1 === null) {
		return list2;
	}
	if(list2 === null) {
		return list1;
	}
	
	const tmp1 = namespace(list1).left;
	const tmp2 = namespace(list2).left;
	namespace(tmp1).right = list2;
	namespace(tmp2).right = list1;
	namespace(list1).left = tmp2;
	namespace(list2).left = tmp1;
	
	return list1;
}

function appendChild(list,elem) {
	if(list === null || elem === null) {
		return null;
	}
	
	if(namespace(list).child === null) {
		namespace(list).child = addToList(namespace(list).child,elem);
		namespace(list).degree = 1;
		namespace(namespace(list).child).parent = list;
	} else {
		addToList(namespace(list).child,elem);
	}
	
	return list;
}

function addToList(list,elem) {
	if(elem === null) {
		return list;
	}
	
	removeChild(elem);
	
	if(list === null) {
		namespace(elem).parent = null;
		namespace(elem).left = elem;
		namespace(elem).right = elem;
		return elem;
	}
	
	namespace(elem).parent = namespace(list).parent;
	if(namespace(list).parent !== null) {
		namespace(namespace(list).parent).degree++;
	}
	namespace(elem).right = list;
	namespace(elem).left = namespace(list).left;
	namespace(namespace(list).left).right = elem;
	namespace(list).left = elem;
	
	return list;
}

function removeChild(elem) {
	if(elem === null) {
		return null;
	}
	
	namespace(namespace(elem).right).left = namespace(elem).left;
	namespace(namespace(elem).left).right = namespace(elem).right;
	
	const parent = namespace(elem).parent;
	if(parent !== null) {
		namespace(parent).child = namespace(elem).right !== elem ? namespace(elem).right : null;;
		namespace(parent).degree--;
	}
	
	return parent;
}

function removeFromListAndStoreChildrenInParent(elem) {
	let child = namespace(elem).child;
	while(child !== null) {
		const next = namespace(child).right;
		addToList(elem,child);
		child = child !== next ? next : null;
	}
	
	removeChild(elem);
}

function consolidate(state) {
	const compare = state.compare;
	
	const degreeIndexer = new ExtendedMap();
	
	let current = state.min;
	const ending = namespace(current).left;
	while(true) {
		const next = namespace(current).right;
		let x = current;
		
		let degree = namespace(x).degree;
		while(degreeIndexer.has(degree)) {
			let y = degreeIndexer.get(degree);
			
			if(compare(y.value,x.value) < 0) {
				const tmp = x;
				x = y;
				y = tmp;
			}
			
			appendChild(x,y);
			namespace(y).mark = false;
			
			degreeIndexer.delete(degree);
			
			degree += 1;
		}
		
		degreeIndexer.set(namespace(x).degree,x);
		
		if(current === ending) {
			break;
		}
		current = next;
	}
	
	state.min = null;
	
	for(const elem of degreeIndexer.values()) {
		let currentMin = state.min;
		
		if(state.min === null) {
			state.min = addToList(state.min,elem);
		} else {
			addToList(state.min,elem);
			if(compare(elem.value,state.min.value) < 0) {
				state.min = elem;
			}
		}
	}
}

function cut(state,elem) {
	addToList(state.min,elem);
	namespace(elem).mark = false;
}

function cascadingCut(state,elem) {
	const parent = namespace(elem).parent;
	if(parent !== null) {
		if(!namespace(parent).mark) {
			namespace(parent).mark = true;
		} else {
			cut(state,elem);
			cascadingCut(state,parent);
		}
	}
}

class FibonacciHeapElement {
	constructor(heap,value) {
		const state = namespace(this);
		state.child = null;
		state.degree = 0;
		state.heap = heap;
		state.left = this;
		state.mark = false;
		state.parent = null;
		state.right = this;
		this.value = value;
	}
}










function logFibo(base) {
	if(base !== null) {
		const start = base;
		let current = base;
		while(current !== null) {
			console.log("HEAD",current);
			recursiveLog(current,1);
			current = namespace(current).right;
			if(current === start) {
				current = null;
			}
		}
	}
}
function recursiveLog(node,depth) {
	if(depth > 5) {
		throw("");
	}
	if(namespace(node).degree > 0) {
		const start = namespace(node).child;
		let current = namespace(node).child;
		console.log("PARENT",node,depth);
		while(current !== null) {
			console.log("CHILD",current,namespace(current).mark,namespace(current).degree,namespace(current).parent);
			current = namespace(current).right;
			if(current === start) {
				current = null;
			}
		}
		current = start;
		while(current !== null) {
			recursiveLog(current,depth+1);
			current = namespace(current).right;
			if(current === start) {
				current = null;
			}
		}
	}
}