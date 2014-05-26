$(document).ready(function () {
	loadcurbk();
});

function loadcurbk(){
	var curbk = localStorage.getItem("newTabBkImg");
	if ( curbk != "../backgrounds/squairy_light.png"){
		$("#bkurl").val(curbk);	
	}	
}


$("#applyBk").click(function(){
	console.log($("#bkurl").val());
	bk = $("#bkurl").val();
	console.log(window.parent.parent.$('body').css('background-image'));
	window.parent.parent.$('body').css('background-image','url("'+bk+'")'); 
	localStorage.setItem("newTabBkImg", bk);
});