sap.ui.controller("com.sap.dkom.newUser", {

	onInit: function() {
		this._oNewUserModel = new sap.ui.model.json.JSONModel({
			name: "",
			age: "",
			company: "",
			phone: "",
			email: "",
			address: "",
			picture: ""
		});
		this.getView().setModel(this._oNewUserModel, "NewUser");
	},

	takePhoto: function() {
		if (navigator.camera) {
			var options = {
	        quality: 75,
	        destinationType: Camera.DestinationType.DATA_URL,
	        sourceType: Camera.PictureSourceType.CAMERA,
	        allowEdit: true,
	        encodingType: Camera.EncodingType.JPEG,
	        targetWidth: 300,
	        targetHeight: 300,
	        popoverOptions: CameraPopoverOptions,
	        saveToPhotoAlbum: false
	    };

			navigator.camera.getPicture(this.cameraSuccess.bind(this), this.handleError.bind(this), options);
		} else {
			sap.m.MessageToast.show("Your device does not have a camera!");
		}
	},

	choosePhoto: function() {
		if (navigator.camera) {
			var options = {
	        quality: 75,
	        destinationType: Camera.DestinationType.DATA_URL,
	        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	        allowEdit: true,
	        encodingType: Camera.EncodingType.JPEG,
	        targetWidth: 300,
	        targetHeight: 300,
	        popoverOptions: CameraPopoverOptions,
	        saveToPhotoAlbum: false
	    };

			navigator.camera.getPicture(this.cameraSuccess.bind(this), this.handleError.bind(this), options);
		} else {
			sap.m.MessageToast.show("Your device does not have a camera!");
		}
	},

	cameraSuccess: function(sPhotoUrl) {
		var oData = this._oNewUserModel.getData();
		oData.picture = "data:image/jpeg;base64," + sPhotoUrl;
		this._oNewUserModel.setData(oData);
	},

	openMap: function() {
		if (!this._oMapFragment) {
			this._oMapFragment = new sap.ui.xmlfragment("com.sap.dkom.map",	this);
			this.getView().addDependent(this._oMapFragment);

			this._oMapFragment.addDelegate({
				onBeforeRendering: this.mapBeforeRendering.bind(this),
				onAfterRendering: this.mapAfterRendering.bind(this)
			});
		}
		if (!this._oNavContainer) {
			this._oNavContainer = this.getView().byId("navConNewUser");
			this._oNavContainer.addPage(this._oMapFragment);
		}
		this._oNavContainer.to(this._oMapFragment);
	},

	mapBeforeRendering: function() {
		var oHtml = sap.ui.getCore().byId("idHtmlContent");
		var sContent = '<div id="GoogleMap" data-role="main" class="ui-content" style="height: 100%;"></div>';
		oHtml.setContent(sContent);
	},

	mapAfterRendering: function() {
		var mapOptions = {
				center: new google.maps.LatLng(-29.796820, -51.149240),
							zoom: 16,
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							mapTypeControl: false,
							disableDefaultUI: true
		};
		this._oMap = new google.maps.Map($("#GoogleMap")[0], mapOptions);
		this.locateUser();
	},

	locateUser: function() {
		if(navigator.geolocation) {
			var positionOptions = {
					enableHighAccuracy: true,
					timeout: 10 * 1000 // 10 seconds
			};
			navigator.geolocation.getCurrentPosition(this.geolocationSuccess.bind(this), this.handleError.bind(this), positionOptions);
		} else {
			sap.m.MessageToast.show("Your device does not have an active location system.")
		}
	},

	geolocationSuccess: function(position) {
		var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		this._getFormattedAddress(position);

    // set map center
    this._oMap.setCenter(userLatLng);
    this._oMap.setZoom(17);

    // create array for markers
    if (!this.aMarkers) {
    	this.aMarkers = [];
    }
    // remove marker and circle from last geolocation, if any
    for (var i = 0; i < this.aMarkers.length; i++) {
    	this.aMarkers[i].setMap(null);
    }

    // Place the marker
    var marker = new google.maps.Marker({
    	map: this._oMap,
    	position: userLatLng,
    	animation: google.maps.Animation.DROP
    });

    // Draw a circle around the user position to have an idea of the current localization accuracy
    var circle = new google.maps.Circle({
    	center: userLatLng,
    	radius: position.coords.accuracy,
    	map: this._oMap,
    	fillColor: '#0000FF',
    	fillOpacity: 0.25,
    	strokeColor: '#0000FF',
    	strokeOpacity: 0.25
    });

    // store marker and circle in array to remove in future geolocation
    this.aMarkers.push(marker);
    this.aMarkers.push(circle);
	},

	_getFormattedAddress: function(position) {
		var sUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude;
		$.ajax({
			url: sUrl,
			success: function(oResponse) {
				if (oResponse && oResponse.results) {
					// get address
					var sAddress = oResponse.results[0].formatted_address;
					// update model
					var oData = this._oNewUserModel.getData();
					oData.address = sAddress;
					this._oNewUserModel.setData(oData);
				}
			}.bind(this)
		})
	},

	handleError: function(param) {
		sap.m.MessageToast.show(param);
	},

	imageVisible: function(sPicture) {
		return sPicture !== "";
	},

	takePhotoBtnVisible: function(sPicture) {
		return sPicture === "";
	},

	handleBack: function(oEvent) {
		oEvent.getSource().getParent().getParent().getParent().back();
	},

	handleBackMap: function() {
		this._oNavContainer.back();
	}

});
