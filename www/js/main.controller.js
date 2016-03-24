sap.ui.controller("com.sap.dkom.main", {

	onInit: function() {
		this._oUserCollectionModel = new sap.ui.model.json.JSONModel(this._oMockData);
		this.getView().setModel(this._oUserCollectionModel, "UserCollection");
	},

	handleUserSelected: function(oEvent) {
		if (!this._oNavContainer) {
			this._oNavContainer = this.getView().byId("navCon");
		}
		if (!this._oDetailPage) {
			this._oDetailPage = this.getView().byId("detailPage");
		}

		var sUserPath = oEvent.getSource().getSelectedItem().getBindingContextPath();
		var oSelectedUserData = this._oUserCollectionModel.getProperty(sUserPath);

		if (!this._oSelectedUserModel) {
			this._oSelectedUserModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this._oSelectedUserModel, "SelectedUser");
		}
		this._oSelectedUserModel.setData(oSelectedUserData);

		this._oNavContainer.to(this._oDetailPage);

		oEvent.getSource().removeSelections(true);
	},

	handleNewUserPress: function() {
		if (!this._oNavContainer) {
			this._oNavContainer = this.getView().byId("navCon");
		}
		if (!this._oNewUserPage || !this._oNavContainer.getPage("newUser")) {
			this._oNewUserPage = sap.ui.view({
				id:"newUser",
				viewName:"com.sap.dkom.newUser",
				type:sap.ui.core.mvc.ViewType.XML
			});
			this._oNavContainer.addPage(this._oNewUserPage);
		}

		this._oNavContainer.to(this._oNewUserPage);
	},

	handleBack: function(oEvent) {
		oEvent.getSource().getParent().back();
	},

	_oMockData: [
	             {
	            	    "_id": "56f06961998107206e09b91c",
	            	    "index": 0,
	            	    "balance": "$3,827.42",
	            	    "age": 34,
	            	    "name": "Cruz Mcpherson",
	            	    "gender": "male",
	            	    "company": "MOMENTIA",
	            	    "email": "cruzmcpherson@momentia.com",
	            	    "phone": "+1 (880) 579-3080",
	            	    "address": "195 Lawn Court, Ogema, Louisiana, 223",
	            	    "picture": "./img/profile/men1.jpg"
	            	  },
	            	  {
	            	    "_id": "56f06961b10aa2be74f4e18f",
	            	    "index": 1,
	            	    "balance": "$1,814.55",
	            	    "age": 34,
	            	    "name": "Victoria Jacobson",
	            	    "gender": "female",
	            	    "company": "ZYTRAC",
	            	    "email": "victoriajacobson@zytrac.com",
	            	    "phone": "+1 (981) 586-2660",
	            	    "address": "128 Ridge Court, Bodega, Missouri, 8253",
	            	    "picture": "./img/profile/women1.jpg"
	            	  },
	            	  {
	            	    "_id": "56f06961bddb254f057b649f",
	            	    "index": 2,
	            	    "balance": "$3,705.29",
	            	    "age": 27,
	            	    "name": "Mcneil Preston",
	            	    "gender": "male",
	            	    "company": "MEDIOT",
	            	    "email": "mcneilpreston@mediot.com",
	            	    "phone": "+1 (947) 589-2335",
	            	    "address": "974 Arion Place, Roderfield, Vermont, 2540",
	            	    "picture": "./img/profile/men2.jpg"
	            	  },
	            	  {
	            	    "_id": "56f0696179735ff6582fd03e",
	            	    "index": 3,
	            	    "balance": "$2,350.10",
	            	    "age": 34,
	            	    "name": "Lambert Watts",
	            	    "gender": "male",
	            	    "company": "QUINEX",
	            	    "email": "lambertwatts@quinex.com",
	            	    "phone": "+1 (909) 581-2967",
	            	    "address": "173 Terrace Place, Urbana, Tennessee, 961",
	            	    "picture": "./img/profile/men3.jpg"
	            	  },
	            	  {
	            	    "_id": "56f06961b274f5b617264305",
	            	    "index": 4,
	            	    "balance": "$3,812.66",
	            	    "age": 28,
	            	    "name": "Gertrude Everett",
	            	    "gender": "female",
	            	    "company": "ZISIS",
	            	    "email": "gertrudeeverett@zisis.com",
	            	    "phone": "+1 (887) 407-3716",
	            	    "address": "174 Lewis Avenue, Tivoli, Puerto Rico, 362",
	            	    "picture": "./img/profile/women2.jpg"
	            	  },
            		  {
            		    "_id": "56f06971af2c91bc657d75bf",
            		    "index": 5,
            		    "balance": "$1,622.39",
            		    "age": 22,
            		    "name": "Olivia Ward",
            		    "gender": "female",
            		    "company": "PROVIDCO",
            		    "email": "oliviaward@providco.com",
            		    "phone": "+1 (856) 450-3430",
            		    "address": "499 Mersereau Court, Rosedale, Vermont, 7868",
            		    "picture": "./img/profile/women3.jpg"
            		  }
            		  ]

});
