import {Utilities} from "./import.js";
import {SerialMap,SerialSet} from "./../structures/export.js";
import AutomatonIdSerializer from "./automatonIdSerializer.class.js";

const namespace = Utilities.buildNamespace();

class AutomatonStateAbstract {
	constructor(id,information = {},idSerializer = AutomatonIdSerializer) {
		const state = namespace(this);
		state.id = new idSerializer(id);
		state.information = information;
		state.lockPrevious = 0;
		state.lockPurge = 0;
		state.lockNext = 0;
		state.next = new SerialMap();
		state.previous = new SerialMap();
		state.serial = state.id.toSerial();
	}
	
	get id() {
		const {id,lockPurge} = namespace(this);
		
		if(!lockPurge) {
			return id.id;
		}
	}
	
	get information() {
		return namespace(this).information;
	}
	
	get next() {
		return namespace(this).next;
	}
	
	get previous() {
		const {lockPurge,previous} = namespace(this);
		
		if(!lockPurge) {
			return previous;
		}
	}
	
	hasNext(arrow) {
		return namespace(this).next.has(arrow);
	}
	
	getNext(arrow) {
		return namespace(this).next.get(arrow);
	}
	
	getAllNext() {
		return namespace(this).next.entries();
	}
	
	hasPrevious(arrow) {
		const {lockPurge,previous} = namespace(this);
		
		if(!lockPurge) {
			return previous.has(arrow);
		}
	}
	
	addPrevious(arrow,state) {
		const thisState = namespace(this);
		const {lockPrevious,lockPurge,previous} = thisState;
		
		if(!lockPurge) {
			if(!lockPrevious) {
				thisState.lockPrevious = 1;
				
				if(!previous.has(arrow)) {
					previous.set(arrow,new SerialSet());
				}
				
				previous.get(arrow).add(state);
				state.addNext(arrow,this);
			}
			thisState.lockPrevious = 0;
		}
	}
	
	removePrevious(arrow,state) {
		const thisState = namespace(this);
		const {lockPrevious,lockPurge,previous} = thisState;
		
		if(!lockPurge) {
			if(!lockPrevious) {
				thisState.lockPrevious = 1;
				
				if(!previous.has(arrow)) {
					return;
				}
				
				previous.get(arrow).delete(state);
				if(previous.get(arrow).size === 0) {
					previous.delete(arrow);
				}
				state.removeNext(arrow,this);
			}
			thisState.lockPrevious = 0;
		}
	}
	
	getPrevious(arrow) {
		const {lockPurge,previous} = namespace(this);
		
		if(!lockPurge) {
			return previous.get(arrow);
		}
	}
	
	getAllPrevious() {
		const {lockPurge,previous} = namespace(this);
		
		if(!lockPurge) {
			return previous.entries();
		}
	}
	
	toSerial() {
		return namespace(this).serial;
	}
}

class AutomatonState extends AutomatonStateAbstract {
	constructor(id,information,idSerializer) {
		super(id,information,idSerializer);
	}
	
	addNext(arrow,state) {
		const thisState = namespace(this);
		const {lockNext,lockPurge,next} = thisState;
		
		if(!lockPurge) {
			if(!lockNext) {
				thisState.lockNext = 1;
				
				if(!next.has(arrow)) {
					next.set(arrow,new SerialSet());
				}
				
				next.get(arrow).add(state);
				state.addPrevious(arrow,this);
			}
			thisState.lockNext = 0;
		}
	}
	
	removeNext(arrow,state) {
		const thisState = namespace(this);
		const {lockNext,lockPurge,next} = thisState;
		
		if(!lockPurge) {
			if(!lockNext) {
				thisState.lockNext = 1;
				
				if(!next.has(arrow)) {
					return;
				}
				
				next.get(arrow).delete(state);
				if(next.get(arrow).size === 0) {
					next.delete(arrow);
				}
				state.removePrevious(arrow,this);
			}
			thisState.lockNext = 0;
		}
	}
	
	purge() {
		const state = namespace(this);
		const {lockPurge,next,previous,tempPurge} = state;
		
		if(!lockPurge && !tempPurge) {
			state.tempPurge = 1;
			
			for(const [arrow,states] of previous) {
				arrow.purge();
				
				for(const state of states) {
					state.purge();
				}
			}
			
			for(const [arrow,states] of next) {
				arrow.purge();
				
				for(const state of states) {
					state.purge();
				}
			}
			
			delete(state.id);
			delete(state.lockPrevious);
			delete(state.lockNext);
			delete(state.previous);
			delete(state.tempPurge);
			
			state.lockPurge = 1;
		}
	}
}

class AutomatonStateDeterministic extends AutomatonStateAbstract {
	constructor(id,information,idSerializer) {
		super(id,information,idSerializer);
	}
	
	addNext(arrow,state) {
		const thisState = namespace(this);
		const {lockNext,lockPurge,next} = thisState;
		
		if(!lockPurge) {
			if(!lockNext) {
				thisState.lockNext = 1;
				
				next.set(arrow,state);
				
				state.addPrevious(arrow,this);
			}
			thisState.lockNext = 0;
		}
	}
	
	removeNext(arrow,state) {
		const thisState = namespace(this);
		const {lockNext,lockPurge,next} = thisState;
		
		if(!lockPurge) {
			if(!lockNext) {
				thisState.lockNext = 1;
				
				next.delete(arrow);
				
				state.removePrevious(arrow,this);
			}
			thisState.lockNext = 0;
		}
	}
	
	purge() {
		const state = namespace(this);
		const {lockPurge,next,previous,tempPurge} = state;
		
		if(!lockPurge && !tempPurge) {
			state.tempPurge = 1;
			
			for(const [arrow,states] of previous) {
				arrow.purge();
				
				for(const state of states) {
					state.purge();
				}
			}
			
			for(const [arrow,state] of next) {
				arrow.purge();
				state.purge();
			}
			
			delete(state.id);
			delete(state.lockPrevious);
			delete(state.lockNext);
			delete(state.previous);
			delete(state.tempPurge);
			
			state.lockPurge = 1;
		}
	}
}

export {AutomatonState,AutomatonStateDeterministic};