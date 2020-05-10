import {Utilities} from "./import.js";
import {ExtendedMap,ExtendedSet,SerialSet} from "./structures/export.js";
import RegularExpression from "./regularExpression/regularExpression.class.js";
import DependencyNode from "./dependencyNode.class.js";
import ParserWrapper from "./parserWrapper.class.js";

const namespace = Utilities.buildNamespace();

const instances = {};
const cssInstances = new ExtendedSet();
const dependencies = new ExtendedMap();

let lexer;
let gramBNF;
let mapProps;

lexer = [
	{
		token: ":"
	},
	{
		token: ";"
	},
	{
		token: " ",
		matcher: "[ \n\r\t]{1,}"
	},
	{
		token: "zero-float",
		matcher: "[+\\-]{,1}0(.0{1,}((E|e)[+\\-]{,1}[0-9]{1,}){,1}|(.0{1,}){,1}(E|e)[+\\-]{,1}[0-9]{1,})",
	},
	{
		token: "positive-float",
		matcher: "+{,1}(0|[1-9][0-9]{,})(.[0-9]{1,}((E|e)[+\\-]{,1}[0-9]{1,}){,1}|(.[0-9]{1,}){,1}(E|e)[+\\-]{,1}[0-9]{1,})"
	},
	{
		token: "negative-float",
		matcher: "-(0|[1-9][0-9]{,})(.[0-9]{1,}((E|e)[+\\-]{,1}[0-9]{1,}){,1}|(.[0-9]{1,}){,1}(E|e)[+\\-]{,1}[0-9]{1,})"
	},
	{
		token: "zero-integer",
		matcher: "[+\\-]{,1}0"
	},
	{
		token: "positive-integer",
		matcher: "+{,1}[1-9][0-9]{,}"
	},
	{
		token: "negative-integer",
		matcher: "-[1-9][0-9]{,}"
	},
	{
		token: "string",
		matcher: `"([^"\\\\]|\\\\|\\"){,}"`
	},
	{
		token: "color-hexa",
		matcher: "#[0-9a-fA-F]{6}([0-9a-fA-F]{2}){,1}"
	},
	{
		token: "%"
	},
	{
		token: ","
	},
	{
		token: "/"
	},
	{
		token: "(",
		matcher: "\\("
	},
	{
		token: ")",
		matcher: "\\)"
	},
	{
		token: "keyword",
		matcher: "[a-z\\-]{1,}"
	}
];

gramBNF = {
	"S": "<Blank> <S-2>",
	"S-2": "<Property> <Blank> <;> <S> | ",
	
	"Property": `
		<margin> <Two-dots> <Margin-content> |
		<margin-top> <Two-dots> <Margin-top> |
		<margin-right> <Two-dots> <Margin-right> |
		<margin-bottom> <Two-dots> <Margin-bottom> |
		<margin-left> <Two-dots> <Margin-left> |
		
		<padding> <Two-dots> <Padding-content> |
		<padding-top> <Two-dots> <Padding-top> |
		<padding-right> <Two-dots> <Padding-right> |
		<padding-bottom> <Two-dots> <Padding-bottom> |
		<padding-left> <Two-dots> <Padding-left> |
		
		<overflow> <Two-dots> <Overflow-content> |
		<overflow-x> <Two-dots> <Overflow-x> |
		<overflow-y> <Two-dots> <Overflow-y> |
		
		<font> <Two-dots> <Font-content> |
		<font-style> <Two-dots> <Font-style> |
		<font-variant> <Two-dots> <Font-variant> |
		<font-weight> <Two-dots> <Font-weight> |
		<font-stretch> <Two-dots> <Font-stretch> |
		<font-size> <Two-dots> <Font-size> |
		<line-height> <Two-dots> <Line-height> |
		<font-family> <Two-dots> <Font-family> |
		
		<box-shadow-inset> <Two-dots> <Box-shadow-inset> |
		<box-shadow-offset-x> <Two-dots> <Box-shadow-offset-x> |
		<box-shadow-offset-y> <Two-dots> <Box-shadow-offset-y> |
		<box-shadow-blur-radius> <Two-dots> <Box-shadow-blur-radius> |
		<box-shadow-spread-radius> <Two-dots> <Box-shadow-spread-radius> |
		<box-shadow-color> <Two-dots> <Box-shadow-color> |
		
		<border> <Two-dots> <Border-content> |
		<border-width> <Two-dots> <Border-width> |
		<border-style> <Two-dots> <Border-style> |
		<border-color> <Two-dots> <Border-color> |
		
		<position> <Two-dots> <Position> |
		<top> <Two-dots> <Top> |
		<right> <Two-dots> <Right> |
		<bottom> <Two-dots> <Bottom> |
		<left> <Two-dots> <Left> |
		
		<float> <Two-dots> <Float> |
		
		<background-color> <Two-dots> <Background-color> |
		
		<color> <Two-dots> <Color> |
		
		<text-align> <Two-dots> <Text-align> |
		
		<vertical-align> <Two-dots> <Vertical-align> |
		
		<white-space> <Two-dots> <White-space> |
		
		<display> <Two-dots> <Display> |
		
		<box-sizing> <Two-dots> <Box-sizing> |
		<height> <Two-dots> <Height> |
		<min-height> <Two-dots> <Min-height> |
		<max-height> <Two-dots> <Max-height> |
		<width> <Two-dots> <Width> |
		<min-width> <Two-dots> <Min-width> |
		<max-width> <Two-dots> <Max-width> |
		
		<cursor> <Two-dots> <Cursor> |
		
		<grid-template-columns> <Two-dots> <Grid-template-columns> |
		<grid-template-rows> <Two-dots> <Grid-template-rows> |
		
		<grid-column> <Two-dots> <Grid-column-content> |
		<grid-column-start> <Two-dots> <Grid-column-start> |
		<grid-column-end> <Two-dots> <Grid-column-end> |
		<grid-row> <Two-dots> <Grid-row-content> |
		<grid-row-start> <Two-dots> <Grid-row-start> |
		<grid-row-end> <Two-dots> <Grid-row-end> |
		
		<place-self> <Two-dots> <Place-self-content> |
		<align-self> <Two-dots> <Align-self> |
		<justify-self> <Two-dots> <Justify-self>
	`,
	
	"Margin-content": "<Margin> | <Margin-top> < > <Margin-right> < > <Margin-bottom> < > <Margin-left>",
	"Margin": "<Margin-element>",
	"Margin-top": "<Margin-element>",
	"Margin-right": "<Margin-element>",
	"Margin-bottom": "<Margin-element>",
	"Margin-left": "<Margin-element>",
	"Margin-element": "<Non-negative-pixel> | <Non-negative-percentage> | <auto>",
	
	"Padding-content": "<Padding> | <Padding-top> < > <Padding-right> < > <Padding-bottom> < > <Padding-left>",
	"Padding": "<Padding-element>",
	"Padding-top": "<Padding-element>",
	"Padding-right": "<Padding-element>",
	"Padding-bottom": "<Padding-element>",
	"Padding-left": "<Padding-element>",
	"Padding-element": "<Non-negative-pixel> | <Non-negative-percentage>",
	
	"Overflow-content": "<Overflow> | <Overflow-x> < > <Overflow-y>",
	"Overflow": "<Overflow-element>",
	"Overflow-x": "<Overflow-element>",
	"Overflow-y": "<Overflow-element>",
	"Overflow-element": "<visible> | <hidden> | <clip> | <scroll> | <auto> | <inherit>",
	
	"Font-content": "<Font> | <Font-style> < > <Font-variant> < > <Font-weight> < > <Font-stretch> < > <Font-size> <Slash> <Line-height> < > <Font-family>",
	"Font": "<inherit>",
	"Font-style": "<normal> | <italic> | <inherit>",
	"Font-variant": "<normal> | <inherit>",
	"Font-weight": "<normal> | <bold> | <inherit>",
	"Font-stretch": "<normal> | <inherit>",
	"Font-size": "<Non-negative-pixel> | <Non-negative-percentage> | <inherit>",
	"Line-height": "<Non-negative-pixel> | <Non-negative-percentage> | <normal> | <inherit>",
	"Font-family": "<Font-family-string-sequence> <Font-family-generic> | <inherit>",
	"Font-family-string-sequence": "<string> <Blank> <,> <Blank> <Font-family-string-sequence> | ",
	"Font-family-generic": "<serif> | <sans-serif> | <monospace> | <cursive>",
	
	"Box-shadow-inset": "<inset> | ",
	"Box-shadow-offset-x": "<Box-shadow-offset-element>",
	"Box-shadow-offset-y": "<Box-shadow-offset-element>",
	"Box-shadow-blur-radius": "<Pixel>",
	"Box-shadow-spread-radius": "<Non-negative-pixel>",
	"Box-shadow-color": "<Color-item>",
	"Box-shadow-offset-element": "<Pixel>",
	
	"Border-content": "<Border> | <Border-width> < > <Border-style> < > <Border-color>",
	"Border": "<inherit>",
	"Border-width": "<Non-negative-pixel> | <inherit>",
	"Border-style": "<none> | <hidden> | <dotted> | <dashed> | <solid> | <double> | <groove> | <ridge> | <inset> | <outset> | <inherit>",
	"Border-color": "<Color-item> | <inherit>",
	
	"Position": "<relative> | <absolute> | <fixed> | <sticky> | <inherit>",
	"Top": "<Position-element>",
	"Right": "<Position-element>",
	"Bottom": "<Position-element>",
	"Left": "<Position-element>",
	"Position-element": "<Pixel> | <auto>",

	"Float": "<none> | <left> | <right>",
	
	"Background-color": "<Color-item> | <inherit>",
	
	"Color": "<Color-item> | <inherit>",
	
	"Text-align": "<left> | <right> | <center> | <justify> | <inherit>",
	
	"Vertical-align": "<baseline> | <sub> | <super> | <text-top> | <text-bottom> | <middle> | <top> | <bottom> | <inherit>",

	"White-space": "<normal> | <pre-wrap> | <nowrap> | <inherit>",
	
	"Display": "<none> | <inline> | <block> | <inline-block> | <grid> | <inherit>",

	"Box-sizing": "<content-box> | <border-box> | <inherit>",
	"Height": "<Size-element>",
	"Min-height": "<Size-element-2>",
	"Max-height": "<Size-element-3>",
	"Width": "<Size-element>",
	"Min-width": "<Size-element-2>",
	"Max-width": "<Size-element-3>",
	"Size-element": "<Size-element-2> | <auto>",
	"Size-element-2": "<Non-negative-pixel> | <Non-negative-percentage>",
	"Size-element-3": "<Size-element-2> | <none>",
	
	"Cursor": "<auto> | <default> | <none> | <context-menu> | <help> | <pointer> | <progress> | <wait> | <cell> | <crosshair> | <text> | <vertical-text> | <alias> | <copy> | <move> | <no-drop> | <grab> | <grabbing> | <not-allowed> | <all-scroll> | <col-resize> | <row-resize> | <n-resize> | <e-resize> | <s-resize> | <w-resize> | <ne-resize> | <nw-resize> | <se-resize> | <sw-resize> | <ew-resize> | <ns-resize> | <nesw-resize> | <nwse-resize> | <zoom-in> | <zoom-out> | <inherit>",
	
	"Grid-template-columns": "<Grid-template-element>",
	"Grid-template-rows": "<Grid-template-element>",
	"Grid-template-element": "<Grid-template-element-2> | <none> | <inherit>",
	"Grid-template-element-2": "<Grid-template-element-4> <Grid-template-element-3>",
	"Grid-template-element-3": "< > <Grid-template-element-4> <Grid-template-element-3> | ",
	"Grid-template-element-4": "<Grid-template-element-5> | <Grid-template-element-8>",
	"Grid-template-element-5": "<repeat> <(> <positive-integer> <,> <Grid-template-element-6> <)>",
	"Grid-template-element-6": "<Grid-template-element-8> <Grid-template-element-7>",
	"Grid-template-element-7": "< > <Grid-template-element-8> <Grid-template-element-7> | ",
	"Grid-template-element-8": "<Non-negative-pixel> | <Non-negative-percentage> | <Non-negative-flex> | <auto>",
	
	"Grid-column-content": "<Grid-column-start> <Slash> <Grid-column-end>",
	"Grid-column-start": "<Grid-element>",
	"Grid-column-end": "<Grid-element>",
	"Grid-row-content": "<Grid-row-start> <Slash> <Grid-row-end>",
	"Grid-row-start": "<Grid-element>",
	"Grid-row-end": "<Grid-element>",
	"Grid-element": "<Grid-element-2> <positive-integer> | <auto> | <inherit>",
	"Grid-element-2": "<span> < > | ",
	
	"Place-self-content": "<Place-self> | <Align-self> < > <Justify-self>",
	"Place-self": "<Grid-self-element>",
	"Align-self": "<Grid-self-element>",
	"Justify-self": "<Grid-self-element>",
	"Grid-self-element": "<stretch> | <center> | <start> | <end> | <inherit>",
	
	"Two-dots": "<Blank> <:> <Blank>",
	"Slash": "<Blank> </> <Blank>",
	"Color-item": "<color-hexa>",
	"Pixel": "<Number> <px>",
	"Non-negative-pixel": "<Non-negative-number> <px>",
	"Non-negative-percentage": "<Non-negative-number> <%>",
	"Non-negative-flex": "<Non-negative-number> <fr>",
	"Number": "<Integer> | <positive-float> | <negative-float> | <zero-float>",
	"Non-negative-number": "<Non-negative-integer> | <positive-float> | <zero-float>",
	"Non-positive-number": "<Non-positive-integer> | <negative-float> | <zero-float>",
	"Integer": "<positive-integer> | <negative-integer> | <zero-integer>",
	"Non-negative-integer": "<positive-integer> | <zero-integer>",
	"Non-positive-integer": "<negative-integer> | <zero-integer>",
	"Blank": "< > | "
};

mapProps = {
	map: [
		{
			symbols: "Margin",
			names: ["margin-top","margin-right","margin-bottom","margin-left"]
		},
		{
			symbols: "Margin-top",
			names: "margin-top"
		},
		{
			symbols: "Margin-right",
			names: "margin-right"
		},
		{
			symbols: "Margin-bottom",
			names: "margin-bottom"
		},
		{
			symbols: "Margin-left",
			names: "margin-left"
		},
		
		{
			symbols: "Padding",
			names: ["padding-top","padding-right","padding-bottom","padding-left"]
		},
		{
			symbols: "Padding-top",
			names: "padding-top"
		},
		{
			symbols: "Padding-right",
			names: "padding-right"
		},
		{
			symbols: "Padding-bottom",
			names: "padding-bottom"
		},
		{
			symbols: "Padding-left",
			names: "padding-left"
		},
		
		{
			symbols: "Overflow",
			names: ["overflow-x","overflow-y"]
		},
		{
			symbols: "Overflow-x",
			names: "overflow-x"
		},
		{
			symbols: "Overflow-y",
			names: "overflow-y"
		},
		
		{
			symbols: "Font",
			names: ["font-style","font-variant","font-weight","font-stretch","font-size","line-height","font-family"]
		},
		{
			symbols: "Font-style",
			names: "font-style"
		},
		{
			symbols: "Font-variant",
			names: "font-variant"
		},
		{
			symbols: "Font-weight",
			names: "font-weight"
		},
		{
			symbols: "Font-stretch",
			names: "font-stretch"
		},
		{
			symbols: "Font-size",
			names: "font-size"
		},
		{
			symbols: "Line-height",
			names: "line-height"
		},
		{
			symbols: "Font-family",
			names: "font-family"
		},

		{
			symbols: "Box-shadow-inset",
			names: "box-shadow-inset"
		},
		{
			symbols: "Box-shadow-offset-x",
			names: "box-shadow-offset-x"
		},
		{
			symbols: "Box-shadow-offset-y",
			names: "box-shadow-offset-y"
		},
		{
			symbols: "Box-shadow-blur-radius",
			names: "box-shadow-blur-radius"
		},
		{
			symbols: "Box-shadow-spread-radius",
			names: "box-shadow-spread-radius"
		},
		{
			symbols: "Box-shadow-color",
			names: "box-shadow-color"
		},

		{
			symbols: "Border",
			names: ["border-width","border-style","border-color"]
		},
		{
			symbols: "Border-width",
			names: "border-width"
		},
		{
			symbols: "Border-style",
			names: "border-style"
		},
		{
			symbols: "Border-color",
			names: "border-color"
		},

		{
			symbols: "Position",
			names: "position"
		},
		{
			symbols: "Top",
			names: "top"
		},
		{
			symbols: "Right",
			names: "right"
		},
		{
			symbols: "Bottom",
			names: "bottom"
		},
		{
			symbols: "Left",
			names: "left"
		},
		
		{
			symbols: "Float",
			names: "float"
		},
		
		{
			symbols: "Background-color",
			names: "background-color"
		},
		
		{
			symbols: "Color",
			names: "color"
		},
		
		{
			symbols: "Text-align",
			names: "text-align"
		},
		
		{
			symbols: "Vertical-align",
			names: "vertical-align"
		},
		
		{
			symbols: "White-space",
			names: "white-space"
		},
		
		{
			symbols: "Display",
			names: "display"
		},
		
		{
			symbols: "Box-sizing",
			names: "box-sizing"
		},
		{
			symbols: "Height",
			names: "height"
		},
		{
			symbols: "Min-height",
			names: "min-height"
		},
		{
			symbols: "Max-height",
			names: "max-height"
		},
		{
			symbols: "Width",
			names: "width"
		},
		{
			symbols: "Min-width",
			names: "min-width"
		},
		{
			symbols: "Max-width",
			names: "max-width"
		},
		
		{
			symbols: "Cursor",
			names: "cursor"
		},
		
		{
			symbols: "Grid-template-columns",
			names: "grid-template-columns"
		},
		{
			symbols: "Grid-template-rows",
			names: "grid-template-rows"
		},
		
		{
			symbols: "Grid-column-start",
			names: "grid-column-start"
		},
		{
			symbols: "Grid-column-end",
			names: "grid-column-end"
		},
		{
			symbols: "Grid-row-start",
			names: "grid-row-start"
		},
		{
			symbols: "Grid-row-end",
			names: "grid-row-end"
		},
		
		{
			symbols: "Place-self",
			names: ["align-self","justify-self"]
		},
		{
			symbols: "Align-self",
			names: "align-self"
		},
		{
			symbols: "Justify-self",
			names: "justify-self"
		}
	]
};





const lexerBuild = ParserWrapper.buildLexer(lexer);
const parserBuild = ParserWrapper.buildParser(gramBNF);
const lexerWrapperBuild = ParserWrapper.buildLexerWrapper(lexerBuild,parserBuild);
const mapPropsBuild = ParserWrapper.buildMapProps(mapProps);

function buildInstance(name,startSymbol,isCss = true,nameDependencies = null) {
	instances[name] = new ParserWrapper(lexerWrapperBuild,parserBuild.withNewStartSymbol(startSymbol),mapPropsBuild);
	
	if(isCss) {
		cssInstances.add(name);
	}
	
	if(nameDependencies !== null) {
		if(!dependencies.has(name)) {
			dependencies.set(name,new DependencyNode(name));
		}
		
		const newDependency = dependencies.get(name);
		
		const dependenciesSet = new SerialSet();
		
		for(const nameDependency of nameDependencies) {
			if(!dependencies.has(nameDependency)) {
				dependencies.set(nameDependency,new DependencyNode(nameDependency));
			}
			
			const dependency = dependencies.get(nameDependency);
			dependency.parents.add(newDependency);
			
			dependenciesSet.add(dependency);
		}
		
		newDependency.children.union(dependenciesSet,true);
	}
}

instances["css"] = new ParserWrapper(lexerWrapperBuild,parserBuild,mapPropsBuild);










buildInstance("margin","Margin-content",true,["margin-top","margin-right","margin-bottom","margin-left"]);
buildInstance("margin-top","Margin-top");
buildInstance("margin-right","Margin-right");
buildInstance("margin-bottom","Margin-bottom");
buildInstance("margin-left","Margin-left");

buildInstance("padding","Padding-content",true,["padding-top","padding-right","padding-bottom","padding-left"]);
buildInstance("padding-top","Padding-top");
buildInstance("padding-right","Padding-right");
buildInstance("padding-bottom","Padding-bottom");
buildInstance("padding-left","Padding-left");

buildInstance("overflow","Overflow-content",true,["overflow-x","overflow-y"]);
buildInstance("overflow-x","Overflow-x");
buildInstance("overflow-y","Overflow-y");

buildInstance("font","Font-content",true,["font-style","font-variant","font-weight","font-stretch","font-size","line-height","font-family"]);
buildInstance("font-style","Font-style");
buildInstance("font-variant","Font-variant");
buildInstance("font-weight","Font-weight");
buildInstance("font-stretch","Font-stretch");
buildInstance("font-size","Font-size");
buildInstance("line-height","Line-height");
buildInstance("font-family","Font-family");

buildInstance("box-shadow-inset","Box-shadow-inset");
buildInstance("box-shadow-offset-x","Box-shadow-offset-x");
buildInstance("box-shadow-offset-y","Box-shadow-offset-y");
buildInstance("box-shadow-blur-radius","Box-shadow-blur-radius");
buildInstance("box-shadow-spread-radius","Box-shadow-spread-radius");
buildInstance("box-shadow-color","Box-shadow-color");

buildInstance("border","Border-content",true,["border-width","border-style","border-color"]);
buildInstance("border-width","Border-width");
buildInstance("border-style","Border-style");
buildInstance("border-color","Border-color");

buildInstance("position","Position");
buildInstance("top","Top");
buildInstance("right","Right");
buildInstance("bottom","Bottom");
buildInstance("left","Left");

buildInstance("float","Float");

buildInstance("background-color","Background-color");

buildInstance("color","Color");

buildInstance("text-align","Text-align");

buildInstance("vertical-align","Vertical-align");

buildInstance("white-space","White-space");

buildInstance("display","Display");

buildInstance("box-sizing","Box-sizing");
buildInstance("height","Height");
buildInstance("min-height","Min-height");
buildInstance("max-height","Max-height");
buildInstance("width","Width");
buildInstance("min-width","Min-width");
buildInstance("max-width","Max-width");

buildInstance("cursor","Cursor");

buildInstance("grid-template-columns","Grid-template-columns");
buildInstance("grid-template-rows","Grid-template-rows");

buildInstance("grid-column","Grid-column-content",true,["grid-column-start","grid-column-end"]);
buildInstance("grid-column-start","Grid-column-start");
buildInstance("grid-column-end","Grid-column-end");
buildInstance("grid-row","Grid-row-content",true,["grid-row-start","grid-row-end"]);
buildInstance("grid-row-start","Grid-row-start");
buildInstance("grid-row-end","Grid-row-end");

buildInstance("place-self","Place-self-content",true,["align-self","justify-self"]);
buildInstance("align-self","Align-self");
buildInstance("justify-self","Justify-self");





const dependenciesPriority = buildDependenciesPriority(dependencies);
function buildDependenciesPriority(dependencies) {
	const dependenciesPriority = [];
	const visited = new SerialSet();

	for(const dependency of dependencies.values()) {
		addDependency(dependency,visited,dependenciesPriority);
	}
	
	return dependenciesPriority;
}
function addDependency(dependency,visited,dependenciesPriority,parents = new SerialSet()) {
	if(parents.has(dependency)) {
		throw("cyclic dependencies aren't allowed");
	}
	
	if(!visited.has(dependency)) {
		visited.add(dependency);
		
		for(const parent of dependency.parents) {
			const newParents = new SerialSet(parents);
			newParents.add(dependency);
			addDependency(parent,visited,dependenciesPriority,newParents);
		}
		
		dependenciesPriority.push(dependency.id);
	}
}





export {instances,cssInstances,dependencies,dependenciesPriority};