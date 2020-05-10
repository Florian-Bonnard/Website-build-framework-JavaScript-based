import {Utilities} from "./import.js";

const serialBuilderRegex = new RegExp(",","g");
function serialBuilder(...args) {
	for(const [index,arg] of args.entries()) {
		args[index] = arg.toString().replace(serialBuilderRegex,",\\");
	}
	return args.join(", ");
}

function serialEqual(obj1,obj2) {
	return obj1.toSerial() === obj2.toSerial();
}

function serialInferior(obj1,obj2) {
	return obj1.toSerial() < obj2.toSerial();
}

export {serialBuilder,serialEqual,serialInferior};