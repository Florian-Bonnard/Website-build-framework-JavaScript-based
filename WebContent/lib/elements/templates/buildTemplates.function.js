import {Utilities} from "./import.js";

export default async () => {
	await Utilities.getTemplate("webArticle");
	await Utilities.getTemplate("webArticlePart");
	await Utilities.getTemplate("webCopyright");
	await Utilities.getTemplate("webFooter");
	await Utilities.getTemplate("webHeader");
	await Utilities.getTemplate("webHeaderTitle");
	await Utilities.getTemplate("webImage");
	await Utilities.getTemplate("webIndex");
	await Utilities.getTemplate("webList");
	await Utilities.getTemplate("webListElement");
	await Utilities.getTemplate("webMain");
	await Utilities.getTemplate("webPage");
	await Utilities.getTemplate("webTopPage");
	await Utilities.getTemplate("webVideo");
}