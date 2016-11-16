
// Loading and Initializing Google Map
var map;
var markersArray = [];
var infoWindow;
var defaultIcon;
var highlightedIcon;


var maperror = function() {
var mapTimeout = setTimeout(function() {
    alert("Unable to connect to Google Maps!!");
}, 5000);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {lat: 22.3072, lng: 73.1812},
        zoom: 13,
        mapTypeControl: false
    });

    loadMarkers();
    clearTimeout(maperror);
}


// These locations will be shown with the help of Markers
var markers = [
    {
        title: "Laxmi Vilas Palace",
        address: "Laxmi Vilas Palace Estate, J.N.Marg",
        location: {lat: 22.2936, lng: 73.1918},
        image: "img/lvp.jpg",
        id: "nav0",
        historical: true
    },
    {
        title: "Sursagar Lake",
        address: "Sursagar Lake",
        location : {lat: 22.3008, lng: 73.2039},
        image: "img/sl.jpg",
        id: "nav1",
        historical: false
    },
    {
        title: "Sardar Patel Planetarium",
        address: "Kalughoda Circle, Sayaji Baug, Dak Bunglaw, Sayajiganj",
        location : {lat: 22.3093, lng: 73.1894},
        image : "img/spp.gif",
        id: "nav2",
        historical: false
    },
    {
        title: "EME Temple",
        address: "EME Rd, Fatehgunj",
        location : {lat: 22.3312, lng: 73.1917},
        image : "img/eme.gif ",
        id: "nav3",
        historical: false
    },
    {
        title: "Kirti Mandir",
        address: "Kirti Mandir, Kothi Rd, Dak Bunglaw, Sayajiganj",
        location : {lat: 22.3076, lng: 73.1910},
        image : "img/km.png",
        id: "nav4",
        historical: true
    },
    {
        title: "Nyay Mandir",
        address: "Nyay Mandir, Sursagar Lake",
        location : {lat: 22.3001, lng: 73.2062},
        image : "img/nm.jpg",
        id: "nav5",
        historical: true
    },
    {
        title: "Mandvi Gate",
        address: "Mandvi Gate",
        location : {lat: 22.3001, lng: 73.2107},
        image : "img/mg.gif",
        id: "nav6",
        historical: true
    },
    {
        title: "Nazarbaug Palace",
        address: "Panigate Rd, Chhipwad",
        location : {lat: 22.3008, lng: 73.2117},
        image : "img/np.gif",
        id: "nav7",
        historical: true
    },
    {
        title: "Sayaji Baug",
        address: "Vinoba Bhave Road, Near Kala Ghoda, Sayajigunj",
        location : {lat: 22.3140, lng: 73.1882},
        image : "img/sb.gif",
        id: "nav8",
        historical: true
    },
    {
        title: "Hazira Maqbara",
        address: "Danteshwar",
        location : {lat: 22.2779, lng: 73.2069},
        image : "img/hm.jpg",
        id: "nav9",
        historical: true
    },
    {
        title: "Khanderao Market",
        address: "Palace Rd, Kevdabaug",
        location : {lat: 22.2965, lng: 73.2018},
        image : "img/kmar.jpg",
        id: "nav10",
        historical: true
    }
];

var Locations = function(data) {
    this.locationTitle = ko.observable(data.title);
    this.locationId = ko.observable(data.id);
    this.divId = ko.computed(function() {
        var div = "div" + this.locationId();
        return div;
    }, this);
    this.historical = ko.observable(data.historical);
    this.listVisible = ko.observable(true);
};


function loadMarkers() {
// Information Window for the locations
    infoWindow = new google.maps.InfoWindow();

// Style applied to highlight the Marker Icon when mouse is brought
// over any marker
    defaultIcon = markerIcon('ff0000');
    highlightedIcon = markerIcon('00ff00');

// A for loop to create a marker for each location
    for (var i = 0; i < markers.length; i++) {
      var title = markers[i].title;
      var position = markers[i].location;
      var address = markers[i].address;
      var image = markers[i].image;
      var marker = new google.maps.Marker({
        title: title,
        position: position,
        image: image,
        address: address,
        icon: defaultIcon,
        id: i
      });

// The marker is pushed to array of markers created earlier
        markersArray.push(marker);

// An onclick event to open the infowindow at each marker
        marker.addListener('click', function() {
            fillInfoWindow(this, infoWindow);
        });

// Mouseover and Mouseout event listeners for markers
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }

    var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markersArray.length; i++) {
          markersArray[i].setMap(map);
          bounds.extend(markersArray[i].position);
        }
        map.fitBounds(bounds);
}

    function historicalMarker() {
        for (var i = 0; i < markersArray.length; i++) {
            if(markers[i].historical === true) {
                markersArray[i].setMap(map);
            }
            else {
                markersArray[i].setMap(null);
            }
        }
    };

    function nonHistoricalMarker() {
        for (var i = 0; i < markersArray.length; i++) {
            if(markers[i].historical === false) {
                markersArray[i].setMap(map);
            }
            else {
                markersArray[i].setMap(null);
            }
        }
    };

    function allMarker() {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(map);
        }
    };

// Function to fill the content of the information window
// It will open when clicked on the marker or in list
    function fillInfoWindow(marker, infowindow) {
// Check to make sure the infowindow is not already opened
      if (infowindow.marker != marker) {
// Fill the content of information window
        infowindow.setContent('<img src="' + marker.image + '" alt="Image of ' +
                              marker.title + '"><br><hr style="margin-bottom: 5px"><strong>' +
                              marker.title + '</strong><br><p>' + marker.address+'<br><p>Link to Wikipedia Article:</p><br><div id="wiki-list-link"></div>');
        infowindow.marker = marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);
// Make sure the marker property is cleared if the infowindow is closed
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
          marker.setAnimation(null);
        });
// Open the infowindow on the correct marker
        infowindow.open(map, marker);
      }

      var wikiListURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json&callback=wikiCallback';

      $.ajax({
        url: wikiListURL,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[0];
            console.log(articleList);
            var list = $("#wiki-list-link")
                var url = 'http://en.wikipedia.org/wiki/' + articleList;
                console.log(url);
                list.append('<a href="' + url + '">' + articleList + '</a>');
        }
    });
    }


// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
    function markerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
      return markerImage;
    }

// viewmodal that enables filtering in the list and markers
var viewModel = function() {
    var self = this;
    this.locationList = ko.observableArray([]);
    this.filterIndicator = ko.observable("");
    this.filterInfo = ko.observable(false);
    this.displayFilter = ko.observable("dropdown-content");
    markers.forEach(function(location) {
        self.locationList.push(new Locations(location));
    });

    var flag;
    this.showDropDown = function() {
        if(flag !== 0) {
            self.displayFilter("dropdown-content" + " " + "show");
            flag = 0;
        }
        else {
            self.displayFilter("dropdown-content");
            flag = 1;
        }
    };

    this.filterHistorical = function() {
        var len = self.locationList().length;
        for (var i = 0; i < len; i++) {
            if(self.locationList()[i].historical() === true) {
                self.locationList()[i].listVisible(true);
                historicalMarker();
            }
            else {
                self.locationList()[i].listVisible(false);
            }
        }
    };

    this.filterNonHistorical = function() {
        var len = self.locationList().length;
        for (var i = 0; i < len; i++) {
            if(self.locationList()[i].historical() === false) {
                self.locationList()[i].listVisible(true);
                nonHistoricalMarker();
            }
            else {
                self.locationList()[i].listVisible(false);
            }
        }
    };

    this.filterAll = function() {
        var len = self.locationList().length;
        for (var i = 0; i < len; i++) {
            self.locationList()[i].listVisible(true);
            allMarker();
        }
    };

    this.openInfo = function(thisList) {
        var thisId = this.locationId();
        var newId = thisId.slice(-1);
        fillInfoWindow(markersArray[newId], infoWindow);
    };
};

ko.applyBindings(new viewModel());

var isListVisible = true;
function listDisappear() {
    $("#search-nav").animate({
                height: 0,
            }, 500);
            setTimeout(function() {
                $("#search-nav").hide();
            }, 500);
            isListVisible = false;
}
function listAppear() {
    $("#search-nav").show();
            var scrollerHeight = $("#scroller").height() + 55;
            if($(window).height() < 600) {
                $("#search-nav").animate({
                    height: scrollerHeight - 100,
                }, 500, function() {
                    $(this).css('height','auto').css("max-height", 439);
                });
            } else {
            $("#search-nav").animate({
                height: scrollerHeight,
            }, 500, function() {
                $(this).css('height','auto').css("max-height", 549);
            });
            }
            isListVisible = true;
}

function hideList() {
    if(isListVisible === true) {
            listDisappear();

    } else {
            listAppear();
    }
}
$("#list-button").click(hideList);

// load and make the Wikipedia container to animate
var wikiContainer = $("#wiki-image-container");
var isWikiVisible = false;
wikiContainer.click(function() {
    if(isWikiVisible === false) {
        if($(window).width() < 670) {
            $(".information li").css("display", "block");
            wikiContainer.animate({
                width: "230"
            }, 500);
        } else {
            $(".information li").css("display", "inline-block");
            wikiContainer.animate({
                width: "350"
            }, 500);
        }
        isWikiVisible = true;
    } else {
        wikiContainer.animate({
        width: "55"
    }, 500);
        isWikiVisible = false;
    }
});

// load Wikipedia using ajax request
    var $wikiElem = $('#wiki-links');

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=vadodara,gujarat&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia Resources");
        var alerted = localStorage.getItem('alerted') || '';
            if (alerted != 'yes') {
                alert("Unable to connect to Wikipedia");
//                localStorage.setItem('alerted','yes');
            }
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[1];
            var list = $("#wiki-links ul")
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                list.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });