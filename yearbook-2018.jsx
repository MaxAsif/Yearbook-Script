#target photoshop
app.bringToFront();


/* Change pathname accordingly the folder you are using */
var pathname = "D:/Yearbook 18/PHOTO/";
var blankimage = "D:/Yearbook 18/standard.jpg";
var savepathpsd = "D:/Yearbook 18/Final/psd/";
var savepathjpeg = "D:/Yearbook 18/Final/jpeg/";

var JPGQuality = 12;
var rows = 5;
var columns = 5;
var eachPage = rows*columns;
var lines = 5;


var loadDoc = false;

/*var docWidth=activeDocument.width;
var docHeight=activeDocument.height;
var docResolution=activeDocument.resolution;
var docMode = NewDocumentMode.RGB;
var docFill = DocumentFill.WHITE; */

var defaultRulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
var defaultTypeUnits = app.preferences.typeUnits;
app.preferences.typeUnits = TypeUnits.PIXELS;
var defaultDisplayDialogs = app.displayDialogs;
app.displayDialogs = DialogModes.NO;

function makeEmail(inputName){
	inputName = inputName.toLowerCase();
	return inputName;
}

function capitaliseFirstLetter(str)
{
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function lowercaseName(inputName){
	inputName = inputName.toLowerCase();
	var outputName = capitaliseFirstLetter(inputName);
	return outputName;
}

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

if(documents.length==0){
	alert("You need to have your yearbook template open (-template.psd-)")
	var yearbook = null;
	while(yearbook == null)
		yearbook = File.openDialog("Please select psd file.","PHOTOSHOP :*.psd");
	app.load(yearbook);
	loadDoc = true;
}
var docWidth=activeDocument.width;
var docHeight=activeDocument.height;
var docResolution=activeDocument.resolution;
var docMode = NewDocumentMode.RGB;
var docFill = DocumentFill.WHITE;

var i = 0;
var dbText = new Array(10);

while(i<1)
	dbText[i++] = File.openDialog("Please select txt file.","TEXT:*.txt");

i = 0;
while(i<1){

dbText[i].open ('r');
var docname=dbText[i].name;

var globalArray = new Array(eachPage);
var img = new Array(eachPage);

var temp1;
var temp2;
var noOfLines=eachPage*lines;

temp2=1;

for(noOfPages=1;;noOfPages++) {

	if(noOfLines/lines==eachPage){
		for(a=1;a<=eachPage;a++){
			//var back = app.activeDocument.artLayers.add();
			//back.name = "Layer " + a;
			var back = app.activeDocument.artLayers.getByName("Layer"+a + " copy");
			back.visible=false;
		}

		var yearbookTemplate = activeDocument;
		var compilation = docname+"Pages Compilation N"+noOfPages;
		var newDoc = documents.add(docWidth, docHeight, docResolution, compilation,docMode, docFill);
		activeDocument = yearbookTemplate;
		for(a=0;a<=eachPage-1;a++)
		{
			globalArray[a] = new Array(lines);
		}
		noOfLines=0;
		for(a=1;a<=eachPage;a++)
		{
				for(b=1;b<=lines;b++)
				{
					temp1=dbText[i].readln();
					if(temp1!="")
					{
						globalArray[a-1][b-1] = temp1;
						noOfLines++;
					}
					else{
						// globalArray[a-1][b-1] = "No Data";
						//noOfLines++;
						break;
					}
				}
				temp2=dbText[i].readln();
			}
				
		for(a=1;a<=noOfLines/lines;a++) {

			//globalArray[a-1][0] = lowercaseName(globalArray[a-1][0]);
			//globalArray[a-1][3] = makeEmail(globalArray[a-1][3]);

			//if(globalArray[a-1][0].length >= 1)
			//{
				//app.activeDocument.artLayers.getByName("name"+a).textItem.size = 9;
				//app.activeDocument.artLayers.getByName("name"+a).textItem.size = 9;

			//}


			//var layerRef = app.activeDocument.artLayers.add();
			var layerRef = app.activeDocument.artLayers.getByName("name" + a);
			// layerRef.kind = LayerKind.TEXT;
			// layerRef.name = "name "+a;
			var back = app.activeDocument.artLayers.getByName("Layer"+ a);
			back.visible=false;
			layerRef.visible=true;
			layerRef.textItem.contents = globalArray[a-1][0];
			layerRef.justification = Justification.CENTER;

			// var layerRef2 = app.activeDocument.artLayers.add();
			// layerRef2.kind = LayerKind.TEXT;
			// layerRef2.name = "roll "+a;
			var layerRef2 = app.activeDocument.artLayers.getByName("roll" + a);
			layerRef2.visible=true;
			layerRef2.textItem.contents = globalArray[a-1][1] + " - " + globalArray[a-1][2];
			layerRef2.justification = Justification.CENTER;

			//var layerRef3 = app.activeDocument.artLayers.add();
			//layerRef3.kind = LayerKind.TEXT;
			//layerRef3.name = "email "+a;
			var layerRef3  = app.activeDocument.artLayers.getByName("email" + a);
			layerRef3.visible=true;
			layerRef3.textItem.contents = globalArray[a-1][3];
			layerRef3.justification = Justification.CENTER;
					
			//var layerRef4 = app.activeDocument.artLayers.add();
			//layerRef4.kind = LayerKind.TEXT;
			//layerRef4.name = "caption "+a;
			var layerRef4  = app.activeDocument.artLayers.getByName("Caption" + a);
			layerRef4.visible=true;
			layerRef4.textItem.contents = globalArray[a-1][4];
			layerRef4.justification = Justification.CENTER;

			var imgRef = activeDocument.layers["Layer"+a];

			activeDocument.activeLayer = activeDocument.layers["Layer"+a];

			imgRef.visible=true;
			bounds = activeDocument.activeLayer.bounds;
			width = bounds[2].value - bounds[0].value;
			height = bounds[3].value - bounds[1].value;

			img[a] = new File(pathname+globalArray[a-1][1]+".jpg");
			if(!img[a].exists){
				var blank = new File(blankimage);
				app.load(blank);
			}
			else{
				app.load(img[a]);
			
			}
			backFile= app.activeDocument;
			if((backFile.width.value / backFile.height.value) > (width / height)){
				backFile.resizeImage(backFile.width.value * (height / backFile.height.value), height);
				var selRegion = Array(Array((backFile.width.value - width) / 2, 0),Array((backFile.width.value + width) / 2, 0),Array((backFile.width.value + width) / 2, backFile.height.value),Array((backFile.width.value - width) / 2, backFile.height.value),Array((backFile.width.value - width) / 2, 0));
			} else if((backFile.width.value / backFile.height.value) < (width / height)){
				backFile.resizeImage(width, backFile.height.value * (width / backFile.width.value));
				var selRegion = Array(Array(0, (backFile.height.value - height) / 2),Array(backFile.width.value, (backFile.height.value - height) / 2),Array(backFile.width.value, (backFile.height.value + height) / 2),Array(0, (backFile.height.value + height) / 2),Array(0, (backFile.height.value - height) / 2));
			} else {
				backFile.resizeImage(width,height);
				var selRegion = Array(Array(0, 0),Array(backFile.width.value, 0),Array(backFile.width.value, backFile.height.value),Array(0, backFile.height.value),Array(0, 0));
			}
			backFile.selection.select(selRegion);
			backFile.selection.copy();
			backFile.selection.deselect();
			activeDocument=yearbookTemplate;
			activeDocument.activeLayer = activeDocument.layers["Layer"+a];

			imgRef.visible=true;
			bounds = activeDocument.activeLayer.bounds;
			width = bounds[2].value - bounds[0].value;
			height = bounds[3].value - bounds[1].value;
			anchor = new Array(bounds[0].value, bounds[1].value);
			makeSelection(activeDocument, anchor, width, height);
			activeDocument.paste();
			activeDocument.activeLayer.merge();
			var layerName = backFile.name;
			backFile.close(SaveOptions.DONOTSAVECHANGES);
			activeDocument=yearbookTemplate;
			//activeDocument.activeLayer.name = layerName;
		}
		var psdOptions = new PhotoshopSaveOptions();
		psdOptions.alphaChannels = true;
		psdOptions.annotations = false;
		psdOptions.embedColorProfile = false;
		psdOptions.layers = true;
		psdOptions.spotColors = false;
		var file = new File(savepathpsd + docname + "doc N#"+noOfPages+".psd");
		activeDocument.saveAs(file, psdOptions, true, Extension.LOWERCASE);
		app.activeDocument.flatten()
		app.activeDocument.selection.selectAll()
		app.activeDocument.selection.copy()
		activeDocument = documents[documents.length-1];
		curDoc=activeDocument;
		curDoc.paste();
		activeDocument = newDoc;
		activeDocument.flatten();
		saveFile = new File(savepathjpeg+docname+"Pages Compilation N"+noOfPages+".jpg");
		saveOptions = new JPEGSaveOptions();
		saveOptions.embedColorProfile = true;
		saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
		saveOptions.matte = MatteType.NONE;
		saveOptions.quality = JPGQuality;
		activeDocument.saveAs(saveFile, saveOptions, true,Extension.LOWERCASE);
		activeDocument = yearbookTemplate;
		newDoc.close(SaveOptions.DONOTSAVECHANGES);
		yearbookTemplate.activeHistoryState = yearbookTemplate.historyStates[0];
	}
	else
		break;
}
dbText[i].close();
i++;
}
if(loadDoc){
	while (app.documents.length) {
		app.activeDocument.close()
	}
}
