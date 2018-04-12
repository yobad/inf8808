var page1 = {};
page1.$page = $('#page1');
page1.$mainTitle = $('#page1 > .mainTitle');
page1.$cadre = $('#page1 > .cadre');
page1.$divTitle = $('#page1 > .cadre > .divTitle');
page1.$polylogo = $('#page1 > .cadre > #polylogo');
page1.$authors = $('#page1 > .cadre > #authors');
page1.$guide = $('#page1 > #guide');


/*
function startBlinking() {
	page1.$guide.animate({"font-size": "18px", "margin-top":"70px"},300);
	page1.$guide.animate({"font-size": "16px", "margin-top":"80px"},300);
	page1.$guide.animate({"font-size": "16px"},1200, startBlinking);
}
function stopBlinking() {
	page1.$guide.animate.stop(true,true,true);
}*/

function animateHomePage(n) {
	if (n == 0) {
		page1.$mainTitle.css({"opacity":"0", "position": "relative", "top": "-50px"});
		page1.$cadre.css({"border-width":"0px", "width": "40%"});
		page1.$divTitle.css({"opacity":"0", "position": "relative", "top": "50px"});
		page1.$polylogo.css({"opacity":"0"});
		page1.$authors.css({"opacity":"0", "position": "relative", "top": "-50px"});
		page1.$guide.css({"opacity":"0", "position": "absolute", "bottom": "90px"});
	}
	else if (n == 1) { // Show
		elts.$arrow[1].css({"opacity":"0", "position": "absolute", "bottom": "70px"}).show();
		page1.$mainTitle.animate({
			opacity: '1', top: '0px'
		}, function(){
			page1.$cadre.animate({
				"border-width": "1px",
				"width": "60%"
			}, function(){
				page1.$divTitle.animate({
					opacity: "1",
					top: '0px'
				}, function() {
				page1.$polylogo.animate({
					opacity: "1"
				}, function(){
					page1.$authors.animate({
						opacity: "1",
						top: '0px'
					}, function(){
						page1.$guide.animate({
							opacity: "1",
							bottom: '50px'
						} );
						elts.$arrow[1].animate({
							opacity: "1",
							bottom: '20px'
						})
					})
				})})
			})
		});
	}
}
elts.$arrow[1].css({"opacity":"0", "position": "absolute", "bottom": "70px"});
animateHomePage(0);