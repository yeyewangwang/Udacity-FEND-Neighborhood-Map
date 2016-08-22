"use strict";function init(){new Map,ko.applyBindings(new AppVM)}function googleError(){document.body.innerHTML="<h2>Sorry Google Maps didn't load. Please check your internet connection.</h2>"}var iconList={workingPlace:{url:"icons/building-24@2x.png"},bar:{url:"icons/bar-24@2x.png"},restaurant:{url:"icons/restaurant-24@2x.png"},grocery:{url:"icons/grocery-24@2x.png"}},helpers={};helpers.composeInfoWindowContent=function(e){function o(o){var n=e.fourSquareData.photos.groups[0].items[o],r=n.prefix+"500x300"+n.suffix;return r}var n="";if(n+='<div class="infoWindowContent">',n+='<div class="infoWindowHeader">',e.fourSquareData&&e.fourSquareData.url?(n+='<a href="'+e.fourSquareData.url+'">',n+=e.name+"</a>"):n+=e.name,n+='<span class="like-icon"></span>',n+="</div>",e.fourSquareData.error)n+='<div class="venueImg">',n+="<p>"+e.fourSquareData.error+"</p>";else{var r=e.fourSquareData.stats.checkinsCount;n+="<h5>FourSquare Checkins: "+r+"</h5>",n+=" ",n+="<h5>"+e.fourSquareData.location.address+"</h5>",n+='<div id="carousel" class="venueImg carousel slide" data-ride="carousel">';var a=6;n+='<div class="carousel-inner" role="listbox">',n+='<div class="item active">',n+='<img src="'+o(0)+'"></div>';for(var i=1;i<a;i++)n+='<div class="item"><img src="'+o(i)+'"></div>';n+="</div>",n+="<!-- Controls -->",n+='<a class="left carousel-control" href="#carousel" ',n+='role="button" data-slide="prev">',n+='<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>',n+='<span class="sr-only">Previous</span></a>',n+='<a class="right carousel-control" href="#carousel" role="button" data-slide="next">',n+='<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>',n+='<span class="sr-only">Next</span></a>',n+="</div>"}var t="https://www.google.com/maps/embed/v1/streetview?";return t+="key=AIzaSyDOVXLsDsl7za9LKMI-TDWbWV1o_pa77VE",t+="&location="+e.geocode.lat+","+e.geocode.lng,t+="&fov=90&heading=235&pitch=10",n+='<iframe width="400" height="300" frameborder="0" style="border:0"',n+='src="'+t,n+='" allowfullscreen></iframe>',n+='<div class="attribution">',n+="<p>Attribution: Venue images are provided through Foursquare.</p></div>",n+="</div>",n+="</div>"},helpers.addAsyncData=function(e,o){var n,r="MYPFF3DXZ5ZG1APSZINGIEYSGIJKNXYLJPLUW25MOMSLT2JZ",a="5S2U44PXCMR3ZE1GIDPRCRFUA53J42QQ5MTJYPPH3PXLLQKN";n+="https://api.foursquare.com/v2/venues/search?",n+="ll="+e.geocode.lat+","+e.geocode.lng,n+="&query="+e.name,n+="&limit=2",e.apiData.fourSquareId&&(n="https://api.foursquare.com/v2/venues/",n+=e.apiData.fourSquareId+"?"),n+="&client_id="+r,n+="&client_secret="+a,n+="&v=20151124",$.getJSON(n).done(function(o){if(o.response.venue)e.fourSquareData=o.response.venue;else for(var n=0;n<o.response.venues;n++)o.response.venues[n]._id===e.apiData.fourSquareId&&(e.fourSquareData=o.response.venues[n])}).fail(function(o){e.fourSquareData={},e.fourSquareData.error="Foursquare API wasn't able to load.",console.log("Error message logged!")}).always(function(){o(e)})};var shouter=new ko.subscribable,Map=function(){var e=this,o={lat:13.7323776648197,lng:100.57712881481939},n={center:o,zoom:17,mapTypeControl:!1,styles:paperMapStyle},r=new google.maps.Map(document.getElementById("map"),n),a=new google.maps.InfoWindow({content:""});$("#recenterMap").click(function(){r.setOptions(n)}),window.setTimeout(function(){$(".recenterMap").css("display","inherit")},1e3);var i=function(e){var o=this,n={};for(var r in iconList)iconList.hasOwnProperty(r)&&(n[r]=new google.maps.MarkerImage(iconList[r].url,null,null,null,new google.maps.Size(36,36)));var a=new google.maps.Marker({position:e.geocode,title:e.name,icon:n[e.type]});a.addListener("click",o.onClick(e)),o.googleMarker=a,o.id=e.apiData.fourSquareId,e.fourSquareData&&!e.fourSquareData.error&&(o.infoWindowContent=helpers.composeInfoWindowContent(e))};i.prototype.onClick=function(e){return function(){shouter.notifySubscribers(e,"newPlaceClickedViaMarker")}},i.prototype.bounce=function(){var e=this.googleMarker;e.setAnimation(google.maps.Animation.BOUNCE),window.setTimeout(function(){e.setAnimation(null)},1e3)},i.prototype.openInfoWindow=function(){function e(){window.setTimeout(o.googleMarker.setAnimation(null),150),shouter.notifySubscribers("","infoWindowClosed")}var o=this;a.setContent(o.infoWindowContent),a.open(r,o.googleMarker),a.addListener("closeclick",e)};var t={};shouter.subscribe(function(e){if(a.close(),0===Object.keys(t).length&&t.constructor===Object)for(var o in t)o.googleMarker.setVisible(!1);var n={};e.forEach(function(e){var o=new i(e);o.googleMarker.setMap(r),n[e.apiData.fourSquareId]=o}),t=n},e,"newPlacesOnScreen"),shouter.subscribe(function(e){for(var o in t)t[o].googleMarker.setAnimation(null);var n=t[e.apiData.fourSquareId];n.infoWindowContent=helpers.composeInfoWindowContent(e),n.openInfoWindow(),n.bounce()},e,"newPlaceClicked")},AppVM=function(){var e=this,o=$(".menu-toggle-button, #sign-in-button"),n=firebase.database().ref("places/"),r=ko.observableArray([]);n.on("value",function(e){r(e.val())},function(e){console.log(e),alert("Firebase places data could not be fetched.")}),e.searchQuery=ko.observable(""),e.placesOnScreen=ko.computed(function(){return r().filter(function(o){return o.name.toLowerCase().indexOf(e.searchQuery())>=0})}),e.placesOnScreen.subscribe(function(e){shouter.notifySubscribers(e,"newPlacesOnScreen")}),e.clickedPlace=ko.observable(""),e.clickedPlace.subscribe(function(e){function o(e){shouter.notifySubscribers(e,"newPlaceClicked")}helpers.addAsyncData(e,o)}),e.onPlaceClicked=function(n){e.clickedPlace(n),window.setTimeout(function(){menuCheckBoxes.prop("checked",!1),o.css("opacity",.7)},200)},shouter.subscribe(function(o){e.onPlaceClicked(o)},e,"newPlaceClickedViaMarker"),shouter.subscribe(function(){window.setTimeout(function(){o.css("opacity","inherit")},100)},e,"infoWindowClosed")};