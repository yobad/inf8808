var elts = {};
elts.$nb = $(".page").length;
elts.$page = [];
elts.$link = [];

$("#navbar").mouseenter(function() {
	$(this).css({left: "0px"})
});
$("#navbar").mouseleave(function() {
	$(this).css({left: "-181px"})
});

for (var i = 0; i < elts.$nb; i++) {
	elts.$page[i] = $("#page"+(i+1) );

	elts.$link[i] = $("#link"+(i+1) );
	elts.$link[i].click(function() {
		var nb = parseInt( $(this).attr("id").slice(-1) ) - 1;
		if (elts.$active !== nb) {
			$("#navbar").css({left: "-181px"});
			elts.$lastactive = elts.$active;
			elts.$active = nb;
			updatePage();
		}
	});
}
elts.$arrow = [$('#uparrow'), $('#downarrow')];
elts.$active = 0; elts.$lastactive = -1;
elts.$arrow[0].click(function() {
	if (elts.$active > 0) {
		elts.$lastactive = elts.$active;
		elts.$active -= 1;
		updatePage();
	}
});
elts.$arrow[1].click(function() {
	if (elts.$active < elts.$nb - 1) {
		elts.$lastactive = elts.$active;
		elts.$active += 1;
		updatePage();
	}
});
$("#guide").click(function() {
	elts.$lastactive = elts.$active;
	elts.$active += 1;
	updatePage();
});

function updatePage() {
	for (var i = 1; i < elts.$nb; i++) {
		if (elts.$active == i) {
			elts.$page[i].show("slow");
		} else {
			elts.$page[i].hide("slow");
		}
	}
	if (elts.$active == 0) {
		elts.$arrow[0].hide();
	} else if (elts.$active == elts.$nb-1) {
		elts.$arrow[1].hide();
	} else {
		elts.$arrow[0].show();
		elts.$arrow[1].show();
	}

	if (elts.$lastactive == 0) {
		animateHomePage(0);
		elts.$page[0].hide("slow");
	} else if (elts.$active == 0) {
		elts.$page[0].show("slow", function() {
			animateHomePage(1);
		});
	}

//console.log("Changed to page " + (elts.$active+1) );
}

//console.log(elts);
updatePage();


var winH = $(window).height();
$("html").css({height: winH})
$(".page").css({height: winH - 122})
$("#left").css({height: winH-1})
$("#list").css({height: winH-31, "max-height": winH-31})

