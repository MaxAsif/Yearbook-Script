#target photoshop
app.bringToFront();

function makeSelection(docRef, anchor, width, height) {
	var selRegion;
	var pointTR, pointBR, pointBL;
	pointTR = new Array(anchor[0] + width, anchor[1]);
	pointBR = new Array(pointTR[0], anchor[1] + height);
	pointBL = new Array(anchor[0], pointBR[1]);
	selRegion = new Array(anchor, pointTR, pointBR, pointBL, anchor);
	docRef.selection.select(selRegion);
	return;
}


/* Change pathname accordingly the folder you are using */
var savepathjpeg = "D:/Yearbook 18/Page Numbering/final/";

var docWidth=activeDocument.width;
var docHeight=activeDocument.height;
var docResolution=activeDocument.resolution;
var docMode = NewDocumentMode.RGB;
var docFill = DocumentFill.WHITE;
var JPGQuality = 12;


var defaultRulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
var defaultTypeUnits = app.preferences.typeUnits;
app.preferences.typeUnits = TypeUnits.PIXELS;
var defaultDisplayDialogs = app.displayDialogs;
app.displayDialogs = DialogModes.NO;


var inputFolder = Folder.selectDialog("Select the Folder: ");
var fileList = inputFolder.getFiles("*.jpg");

var template = activeDocument;

for(var i=0;i<fileList.length;i++){

	var docName = fileList[i].name;
	docName = docName.split(".");
	if(docName.length > 1)
		docName.length--;
	docName = docName.join(".");
	
	if(fileList[i] instanceof Folder)
		continue;
	
	var textLayer = template.artLayers.getByName("1");
	textLayer.textItem.contents = File.decode(docName);
	
	bounds = activeDocument.activeLayer.bounds;
	var width = bounds[2].value - bounds[0].value;
	var height = bounds[3].value - bounds[1].value;
	
	var doc = app.open(fileList[i]);
	activeDocument = doc;
	
	doc.resizeImage(width, height);
	var selRegion = Array(Array(0,0), Array(doc.width.value, 0), Array(doc.width.value, doc.height.value), Array(0, doc.height.value), Array(0, 0));
	doc.selection.select(selRegion);
	doc.selection.copy();
	doc.selection.deselect();
	
	activeDocument=template;
	activeDocument.activeLayer = activeDocument.layers["Layer 0"];
	var backLayer = activeDocument.artLayers.getByName("Layer 0");
	backLayer.visible=true;
	
	bounds = activeDocument.activeLayer.bounds;
	width = bounds[2].value - bounds[0].value;
	height = bounds[3].value - bounds[1].value;
	anchor = new Array(bounds[0].value, bounds[1].value);
	makeSelection(activeDocument, anchor, width, height);
	activeDocument.paste();
	activeDocument.activeLayer.merge();
	
	activeDocument=template;
	
	activeDocument.flatten();
	saveFile = new File(savepathjpeg + "#" + docName + ".jpg");
	saveOptions = new JPEGSaveOptions();
	saveOptions.embedColorProfile = true;
	saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
	saveOptions.matte = MatteType.NONE;
	saveOptions.quality = JPGQuality;
	activeDocument.saveAs(saveFile, saveOptions, true,Extension.LOWERCASE);
	doc.close(SaveOptions.DONOTSAVECHANGES);
	
	template.activeHistoryState = template.historyStates[0];
}