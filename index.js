const FACE_PLUS_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
const FACE_PLUS_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";

//const IMAGE_URL = "http://www.pianohelp.net/pictures/PSY%20-%20Gangnam%20Style.jpeg"; //PSY
//const IMAGE_URL = "https://goo.gl/v8Mr1h"; //Beyonce
//const IMAGE_URL = "https://goo.gl/56QsnY"; //Elon Musk
//const IMAGE_URL = "http://cdn.cnn.com/cnnnext/dam/assets/161109151138-04-hillary-clinton-concession-speech-1109-full-169.jpg"; //Clinton
//const IMAGE_URL = "http://1.bp.blogspot.com/-hMUpDcPMJUI/Vm75r4udnGI/AAAAAAAARLc/cUm2sWkeODk/s1600/Jennifer%2BLawrence%2Bhunger%2Bgames%2Bprequels%2Btoo%2Bsoon.jpg";
//const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/7/71/Tom_Cruise_avp_2014_4.jpg"; //Tom Cruise
//const IMAGE_URL = "http://i.dailymail.co.uk/i/pix/2015/10/21/01/016E0FB30000044D-0-image-a-40_1445387689827.jpg" //Yao Ming

var DETECT_IMAGE_URL = "";
var COMPARE_IMAGE_URL = "";

function postDetectData(IMAGE_URL, callback) {
	//Query parameters for face detection API call
	console.log(`postDetectData: `+IMAGE_URL);
		
	const query = {
		api_key: "ed6us9-OR9eJ-TEAfUuI1btwiAeIEqrm",
		api_secret: "JEnUSKtyvfiXX8xQnxfqD8NJKIMllhbp",
		image_url: IMAGE_URL,
		return_landmark: 2,
		return_attributes: "gender,age,smiling,facequality,eyestatus,emotion,skinstatus,beauty,ethnicity,headpose"
/*
gender
age
smiling
headpose
facequality
blur
eyestatus
emotion
ethnicity
beauty
mouthstatus
eyegaze
skinstatus
*/
	}
	//console.log('Posting Detect Data! '+callback);
	console.log('Query '+query.image_url);

	//$.getJSON(FACE_PLUS_URL, query, callback);
	$.post(FACE_PLUS_DETECT_URL, query, callback, "json");
	
}

function postCompareData(callback) {
	const query = {
		api_key: "ed6us9-OR9eJ-TEAfUuI1btwiAeIEqrm",
		api_secret: "JEnUSKtyvfiXX8xQnxfqD8NJKIMllhbp",
		image_url1: DETECT_IMAGE_URL,
		image_url2: COMPARE_IMAGE_URL
	}
	$.post(FACE_PLUS_COMPARE_URL, query, callback, "json");

}

function renderDetectResult(idString, IMAGE_URL, result) {
	const imgIdString = idString+"-face-img";

	//const genderScore = gender.toLowerCase()+"_score";
	//const beauty = result.faces[0].attributes.beauty.genderScore;

	//Sort emotion object in an array to find out the greatest confidence
	const emotions = result.faces[0].attributes.emotion;
	var sortEmotions = [];
	
	for (var emotion in emotions) {
		sortEmotions.push([emotion,emotions[emotion]]);
	}
	//Sort emotion confidence level from high to low
	sortEmotions.sort((a,b) => b[1]-a[1]);

	//Sort skin object in an array to find out the greatest confidence
	const skins = result.faces[0].attributes.skinstatus;
	var sortSkins = [];
	
	for (var skin in skins) {
		sortSkins.push([skin,skins[skin]]);
	}
	//Sort skin confidence level from high to low
	sortSkins.sort((a,b) => b[1]-a[1]);

	const getGender = result.faces[0].attributes.gender.value;
	const getAge = result.faces[0].attributes.age.value;
	const getEthnicity = result.faces[0].attributes.ethnicity.value;
	const getEmotion = sortEmotions[0][0];
	const getSkin = sortSkins[0][0];

	return `
		<div class="handle-img">
			<div class="img-box">
				<span class="helper"></span>
				<img id="${imgIdString}" src="${IMAGE_URL}">
				<div class="js-${idString}-drawFaceBorder drawFaceBorder">
					<div class="js-${idString}-landmarkBox landmarkBox"></div>
				</div>
			</div>
		</div>
		
		<div class="face-details">

			<div class="face-circle border-warning">
				<h3 class="face-title">${getGender}</h3>
				<span class="face-text">Gender</span>
			</div>
			<div class="face-circle border-danger">
				<h3 class="face-title">${getAge}</h3>
				<span class="face-text">Age</span>
			</div>
			<div class="face-circle border-info">
				<h3 class="face-title">${getEthnicity}</h3>
				<span class="face-text">Race</span>
			</div>
			<div class="face-circle border-primary">
				<h3 class="face-title">${getEmotion}</h3>
				<span class="face-text">Emotion</span>
			</div>
			<div class="face-circle border-success">
				<h3 class="face-title">${getSkin}</h3>
				<span class="face-text">Skin</span>
			</div>
		</div>
	`;
}

/*
			<div class="bs-callout bs-callout-danger">
       			<h4>Key Expertise</h4>
        		<ul class="list-group">
          			<li class="list-group-item"> Lorem ipsum dolor sit amet, ea vel prima adhuc</li>
        		</ul>
      		</div>

      		<div class="bs-callout bs-callout-warning">
        		<p>Using color to add meaning only provides a visual text hidden with the </p>
      		</div>

*/

function renderCompareResult(result) {
	const getConfidence = result.confidence;

	return `
		<div class="face-circle">
			<h3 class="face-title">${getConfidence}%</h3>
			<span class="face-text">Alike</span>
		</div>
	`;

}

function renderCompareUpload() {
	return `
		<h2>Upload another pic for comparison!</h2>	
		<label class="col-12" for="compare-url"></label>	
		<input class="col-6" type="text" id="compare-url">
		<button id="compare-button" class="btn btn-primary" type="button">Upload</button>
	`;
}

function displayLandmarkBox(idString, data) {
	const imgIdString = idString+"-face-img";

	//Defining dimension and positioning of original and displayed (resized) image
	const naturalWidth = document.getElementById(imgIdString).naturalWidth;
	const naturalHeight = document.getElementById(imgIdString).naturalHeight;
	const width = document.getElementById(imgIdString).clientWidth;
	const height = document.getElementById(imgIdString).clientHeight;
	const marginleft = -(width/2);
	const margintop= -(height/2);
	var resize_ratio = 1;
	
	//Calculate resize ratio for correct positioning of landmarkBox 
	if (naturalWidth>width) {
		resize_ratio = naturalWidth/width;
	} 
		
	//Based on displayed (resized) image dimension	
	//Set the dimension of the landmarkBox (box(es) around the face(s))
	const roll_angle = data.faces[0].attributes.headpose.roll_angle/resize_ratio;
	const face_rectangle_width = data.faces[0].face_rectangle.width/resize_ratio;
	const face_rectangle_height = data.faces[0].face_rectangle.height/resize_ratio;
	const face_rectangle_left = data.faces[0].face_rectangle.left/resize_ratio;
	const face_rectangle_top = data.faces[0].face_rectangle.top/resize_ratio;

	//Update the drawFaceBorder(current image dimention and position)
	//Update the landmarkBox(box(es) around the face(s))
	$(`.js-${idString}-drawFaceBorder`).attr('style', `width:${width}px; height:${height}px; top:50%; left:50%; margin-left:${marginleft}px; margin-top:${margintop}px;`);
	$(`.js-${idString}-landmarkBox`).attr('style', `transform: rotateZ(${roll_angle}deg); width:${face_rectangle_width}px; height:${face_rectangle_height}px; left:${face_rectangle_left}px; top:${face_rectangle_top}px;`);
}

//Displaying face detection data from Face++ API
//Dimension variables calculated based on original image are updated to reflect displayed (resized) image dimension 
function displayFaceDetectData(data) {
  //Calling function for html generation
	$('.face-detect').html('');
	$('.face-upload').html('');

	const result = renderDetectResult('detect', DETECT_IMAGE_URL, data);
	$('.js-detect-box').html(result);

	const compareButton = renderCompareUpload();
	$('.face-compare').html(compareButton);

	//Listen to image loading complete event to trigger the drawing of landmark box
	$('#detect-face-img').on('load', event => {
		displayLandmarkBox('detect', data);
	});
}

function displayFaceCompareData(data) {
//	console.log('Displaying Compare data!');
	const detectResult = renderDetectResult('compare', COMPARE_IMAGE_URL, data);
	$('.js-compare-box').html(detectResult);
//	console.log('Loading Compare Image!');
	$('#compare-face-img').on('load', event => {
		console.log('Compare load complete!');
		displayLandmarkBox('compare', data);
	});

	$('.js-detect-box').addClass('col-lg-6');
	$('.js-compare-box').addClass('col-lg-6');

}

function displayFaceCompareResult(data) {
	const compareResult = renderCompareResult(data);
	$('.face-compare-results').html(compareResult);
	$('.face-compare').html('');
}

function renderInit() {
	return `
		<header class="col-12 text-center mt-20">
			<h1>Are you pretty, ugly, or pretty ugly :)</h1>
			<h2>Upload a selfie for analysis!</h2>
		</header>	
	`;
}

function renderUpload() {
	return `
		<form class="col-12 detect-img-url text-center" action="#">
			<label class="col-12" for="detect-url"></label>	
			<input class="col-6" type="text" id="detect-url">
			<button id="detect-button" class="btn btn-primary" type="submit">Upload</button>
		</form>	
	`;
}


function displayInit() {
	const init = renderInit();
	const upload = renderUpload();
	$('.face-detect').html(init);
	$('.face-detect-results').html('');
	$('.face-compare-results').html('');
	$('.face-compare').html('');
	//$('.face-restart').html('');
	$('.js-detect-box').html('');
	$('.js-compare-box').html('');
	$('.face-upload').html(upload);
	uploadDetect();
}

//Upload event triggered when user click upload button to input an image URL
/////////////////////////////////////////////
/////////////////////////////////////////////
////////////////////change from submit to click???//////////////////////////////
function uploadDetect() {
	$('.detect-img-url').submit(event => {
//		console.log(`Uploading Detect!`);
		event.preventDefault();
		DETECT_IMAGE_URL = $('#detect-url').val();
//		console.log(DETECT_IMAGE_URL);
		$('#detect-url').val("");
		postDetectData(DETECT_IMAGE_URL, displayFaceDetectData);
		uploadCompare();	
	});
}


function restartDetect() {
	$('#link-home').on('click', event => {
		DETECT_IMAGE_URL = "";
		COMPARE_IMAGE_URL = "";
		$('.js-detect-box').removeClass('col-lg-6');
		$('.js-compare-box').removeClass('col-lg-6');
		
//		console.log(`Restart Clicked!`);
		
		//Reload the page
		location.reload();
		//Alternative woring method to reload page
		//window.location.href=window.location.href;
	});
}

function uploadCompare() {
//	console.log(`Checking Compare!`);
	$('.face-compare').on('click', '#compare-button', event => {
//		console.log(`Compare clicked!`);
		event.preventDefault();
		COMPARE_IMAGE_URL = $('#compare-url').val();
//		console.log(COMPARE_IMAGE_URL);
		$('#compare-url').val("");
		postDetectData(COMPARE_IMAGE_URL, displayFaceCompareData);
		postCompareData(displayFaceCompareResult);
		
	});
}


function initApp() {
//	console.log(`Starting Fresh!`);
	displayInit();
	restartDetect();
}

$(initApp);