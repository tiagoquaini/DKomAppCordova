/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/core/delegate/ItemNavigation', 'sap/ui/unified/library'],
		function(jQuery, Control, LocaleData, ItemNavigation, library) {
	"use strict";

	/**
	 * Constructor for a new MonthPicker.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * renders a MonthPicker with ItemNavigation
	 * This is used inside the calendar. Not for stand alone usage
	 * @extends sap.ui.core.Control
	 * @version 1.34.9
	 *
	 * @constructor
	 * @public
	 * @since 1.28.0
	 * @alias sap.ui.unified.calendar.MonthPicker
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MonthPicker = Control.extend("sap.ui.unified.calendar.MonthPicker", /** @lends sap.ui.unified.calendar.MonthPicker.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * The month is initial focused and selected
			 * The value must be between 0 and 11
			 */
			month : {type : "int", group : "Data", defaultValue : 0},

			/**
			 * number of displayed months
			 * The value must be between 1 and 12
			 * @since 1.30.0
			 */
			months : {type : "int", group : "Appearance", defaultValue : 12},

			/**
			 * number of months in each row
			 * The value must be between 0 and 12 (0 means just to have all months in one row, independent of the number)
			 * @since 1.30.0
			 */
			columns : {type : "int", group : "Appearance", defaultValue : 3},

			/**
			 * If set, the calendar type is used for display.
			 * If not set, the calendar type of the global configuration is used.
			 * @since 1.34.0
			 */
			primaryCalendarType : {type : "sap.ui.core.CalendarType", group : "Appearance"}
		},
		events : {

			/**
			 * Month selection changed
			 */
			select : {}

		}
	}});

	MonthPicker.prototype.init = function(){

		// set default calendar type from configuration
		var sCalendarType = sap.ui.getCore().getConfiguration().getCalendarType();
		this.setProperty("primaryCalendarType", sCalendarType);

	};

	MonthPicker.prototype.onAfterRendering = function(){

		_initItemNavigation.call(this);

		// check if day names are too big -> use smaller ones
		_checkNamesLength.call(this);

	};

	MonthPicker.prototype.setMonth = function(iMonth){

		// no rerendering needed, just select new month
		this.setProperty("month", iMonth, true);
		iMonth = this.getProperty("month"); // to have type conversion, validation....

		if (iMonth < 0 || iMonth > 11) {
			throw new Error("Property month must be between 0 and 11; " + this);
		}

		if (this.getDomRef()) {
			if (this.getMonths() < 12) {
				var iStartMonth = _getStartMonth.call(this);
				if (iMonth >= iStartMonth && iMonth <= iStartMonth + this.getMonths() - 1) {
					_selectMonth.call(this, iMonth, true);
					this._oItemNavigation.focusItem(iMonth - iStartMonth);
				}else {
					_updateMonths.call(this, iMonth);
				}
			} else {
				_selectMonth.call(this, iMonth, true);
				this._oItemNavigation.focusItem(iMonth);
			}
		}


	};

	/*
	 * Use rendered locale for stand alone control
	 * But as Calendar can have an own locale, use this one if used inside Calendar
	 */
	MonthPicker.prototype._getLocale = function(){

		var oParent = this.getParent();

		if (oParent && oParent._getLocale) {
			return oParent._getLocale();
		} else if (!this._sLocale) {
			this._sLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();
		}

		return this._sLocale;

	};

	/*
	 * gets localeData for used locale
	 * Use rendered locale for stand alone control
	 * But as Calendar can have an own locale, use this one if used inside Calendar
	 */
	MonthPicker.prototype._getLocaleData = function(){

		var oParent = this.getParent();

		if (oParent && oParent._getLocaleData) {
			return oParent._getLocaleData();
		} else if (!this._oLocaleData) {
			var sLocale = this._getLocale();
			var oLocale = new sap.ui.core.Locale(sLocale);
			this._oLocaleData = LocaleData.getInstance(oLocale);
		}

		return this._oLocaleData;

	};

	MonthPicker.prototype.onsapselect = function(oEvent){

		// focused item must be selected
		var iIndex = this._oItemNavigation.getFocusedIndex();
		var iMonth = iIndex + _getStartMonth.call(this);

		_selectMonth.call(this, iMonth);
		this.fireSelect();

	};

	MonthPicker.prototype.onmouseup = function(oEvent){

		// fire select event on mouseup to prevent closing MonthPicker during click

		if (this._bMousedownChange) {
			this._bMousedownChange = false;
			this.fireSelect();
		}

	};

	MonthPicker.prototype.onThemeChanged = function(){

		if (this._bNoThemeChange) {
			// already called from Calendar
			return;
		}

		this._bNamesLengthChecked = undefined;
		var aMonths = this._oItemNavigation.getItemDomRefs();
		this._bLongMonth = false;
		var oLocaleData = this._getLocaleData();
		// change month name on button but not change month picker, because it is hided again
		var aMonthNames = oLocaleData.getMonthsStandAlone("wide", this.getPrimaryCalendarType());
		for (var i = 0; i < aMonths.length; i++) {
			var $Month = jQuery(aMonths[i]);
			$Month.text(aMonthNames[i]);
		}

		_checkNamesLength.call(this);

	};

	/**
	 * displays the next page
	 *
	 * @returns {sap.ui.unified.calendar.MonthPicker} <code>this</code> to allow method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	MonthPicker.prototype.nextPage = function(){

		var iStartMonth = _getStartMonth.call(this);
		var iIndex = this._oItemNavigation.getFocusedIndex();
		var iMonth = iIndex + iStartMonth;
		var iMonths = this.getMonths();

		iMonth = iMonth + iMonths;
		if (iMonth > 11) {
			iMonth = 11;
		}
		_updateMonths.call(this, iMonth);

		return this;

	};

	/**
	 * displays the previous page
	 *
	 * @returns {sap.ui.unified.calendar.MonthPicker} <code>this</code> to allow method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	MonthPicker.prototype.previousPage = function(){

		var iStartMonth = _getStartMonth.call(this);
		var iIndex = this._oItemNavigation.getFocusedIndex();
		var iMonth = iIndex + iStartMonth;
		var iMonths = this.getMonths();

		iMonth = iMonth - iMonths;
		if (iMonth < 0) {
			iMonth = 0;
		}
		_updateMonths.call(this, iMonth);
		return this;

	};

	function _initItemNavigation(){

		var oRootDomRef = this.getDomRef();
		var aDomRefs = this.$().find(".sapUiCalItem");
		var iColumns = this.getColumns();
		var iMonths = this.getMonths();
		var bCycling = true;

		if (iMonths < 12) {
			bCycling = false;
		}

		if (!this._oItemNavigation) {
			this._oItemNavigation = new ItemNavigation();
			this._oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, _handleAfterFocus, this);
			this._oItemNavigation.attachEvent(ItemNavigation.Events.FocusAgain, _handleFocusAgain, this);
			this._oItemNavigation.attachEvent(ItemNavigation.Events.BorderReached, _handleBorderReached, this);
			this.addDelegate(this._oItemNavigation);
			this._oItemNavigation.setHomeEndColumnMode(true, true);
			this._oItemNavigation.setDisabledModifiers({
				sapnext : ["alt"],
				sapprevious : ["alt"],
				saphome : ["alt"],
				sapend : ["alt"]
			});
		}
		this._oItemNavigation.setRootDomRef(oRootDomRef);
		this._oItemNavigation.setItemDomRefs(aDomRefs);
		this._oItemNavigation.setCycling(bCycling);
		this._oItemNavigation.setColumns(iColumns, !bCycling);
		var iIndex = this.getMonth() - _getStartMonth.call(this);
		this._oItemNavigation.setFocusedIndex(iIndex);
		this._oItemNavigation.setPageSize(aDomRefs.length); // to make sure that pageup/down goes out of month

	}

	function _handleAfterFocus(oControlEvent){

		var iIndex = oControlEvent.getParameter("index");
		var oEvent = oControlEvent.getParameter("event");

		if (!oEvent) {
			return; // happens if focus is set via ItemNavigation.focusItem directly
		}

		if (oEvent.type == "mousedown") {
			// as no click event is fired in some cases
			_handleMousedown.call(this, oEvent, iIndex);
		}

	}

	function _handleFocusAgain(oControlEvent){

		var iIndex = oControlEvent.getParameter("index");
		var oEvent = oControlEvent.getParameter("event");

		if (!oEvent) {
			return; // happens if focus is set via ItemNavigation.focusItem directly
		}

		if (oEvent.type == "mousedown") {
			// as no click event is fired in some cases
			_handleMousedown.call(this, oEvent, iIndex);
		}

	}

	function _handleMousedown(oEvent, iIndex){

		if (oEvent.button) {
			// only use left mouse button
			return;
		}

		var iMonth = iIndex + _getStartMonth.call(this);

		_selectMonth.call(this, iMonth);
		this._bMousedownChange = true;

		oEvent.preventDefault(); // to prevent focus set outside of DatePicker
		oEvent.setMark("cancelAutoClose");

	}

	function _handleBorderReached(oControlEvent){

		var oEvent = oControlEvent.getParameter("event");

		if (oEvent.type) {
			var iStartMonth = _getStartMonth.call(this);
			var iIndex = this._oItemNavigation.getFocusedIndex();
			var iMonth = iIndex + iStartMonth;
			var iMonths = this.getMonths();

			switch (oEvent.type) {
			case "sapnext":
			case "sapnextmodifiers":
				if (iMonth < 11) {
					iMonth++;
					_updateMonths.call(this, iMonth);
				}
				break;

			case "sapprevious":
			case "sappreviousmodifiers":
				if (iMonth > 0) {
					iMonth--;
					_updateMonths.call(this, iMonth);
				}
				break;

			case "sappagedown":
				if (iMonth < 12 - iMonths) {
					iMonth = iMonth + iMonths;
					_updateMonths.call(this, iMonth);
				}
				break;

			case "sappageup":
				if (iMonth > iMonths) {
					iMonth = iMonth - iMonths;
					_updateMonths.call(this, iMonth);
				}
				break;

			default:
				break;
			}
		}

	}

	function _selectMonth(iMonth, bNoSetDate){

		var aDomRefs = this._oItemNavigation.getItemDomRefs();
		var $DomRef;
		var sId = this.getId() + "-m" + iMonth;
		for ( var i = 0; i < aDomRefs.length; i++) {
			$DomRef = jQuery(aDomRefs[i]);
			if ($DomRef.attr("id") == sId) {
				$DomRef.addClass("sapUiCalItemSel");
			}else {
				$DomRef.removeClass("sapUiCalItemSel");
			}
		}

		if (!bNoSetDate) {
			this.setProperty("month", iMonth, true);
		}

	}

	function _checkNamesLength(){

		if (!this._bNamesLengthChecked) {
			var i = 0;
			// only once - cannot change by rerendering - only by theme change
			var aMonths = this._oItemNavigation.getItemDomRefs();
			var bTooLong = false;
			var iMonths = this.getMonths();
			var iBlocks = Math.ceil(12 / iMonths);
			var iMonth = iMonths - 1;
			for (var b = 0; b < iBlocks; b++) {
				if (iMonths < 12) {
					_updateMonths.call(this, iMonth);
					iMonth = iMonth + iMonths;
					if (iMonth > 11) {
						iMonth = 11;
					}
				}

				for (i = 0; i < aMonths.length; i++) {
					var oMonth = aMonths[i];
					if (Math.abs(oMonth.clientWidth - oMonth.scrollWidth) > 1) {
						bTooLong = true;
						break;
					}
				}

				if (bTooLong) {
					break;
				}
			}

			if (iMonths < 12) {
				// restore rendered block
				iMonth = this.getMonth();
				_updateMonths.call(this, iMonth);
			}

			if (bTooLong) {
				this._bLongMonth = false;
				var oLocaleData = this._getLocaleData();
				var sCalendarType = this.getPrimaryCalendarType();
				// change month name on button but not change month picker, because it is hided again
				var aMonthNames = oLocaleData.getMonthsStandAlone("abbreviated", sCalendarType);
				var aMonthNamesWide = oLocaleData.getMonthsStandAlone("wide", sCalendarType);
				for (i = 0; i < aMonths.length; i++) {
					var $Month = jQuery(aMonths[i]);
					$Month.text(aMonthNames[i]);
					$Month.attr("aria-label", aMonthNamesWide[i]);
				}
			} else {
				this._bLongMonth = true;
			}

			this._bNamesLengthChecked = true;
		}

	}

	function _getStartMonth(){

		if (this.getMonths() < 12) {
			var oFirstMonth = this._oItemNavigation.getItemDomRefs()[0];
			return parseInt( oFirstMonth.id.slice( this.getId().length + 2), 10);
		} else {
			return 0;
		}

	}

	function _updateMonths(iMonth){

		var aMonths = this._oItemNavigation.getItemDomRefs();
		if (aMonths.legth > 11) {
			return;
		}

		// Month blocks should start with multiple of number of displayed months
		var iMonths = aMonths.length;
		var iStartMonth = Math.floor( iMonth / iMonths) * iMonths;
		if (iStartMonth + iMonths > 12) {
			iStartMonth = 12 - iMonths;
		}

		var oLocaleData = this._getLocaleData();
		var aMonthNames = [];
		var aMonthNamesWide = [];
		var sCalendarType = this.getPrimaryCalendarType();
		if (this._bLongMonth || !this._bNamesLengthChecked) {
			aMonthNames = oLocaleData.getMonthsStandAlone("wide", sCalendarType);
		} else {
			aMonthNames = oLocaleData.getMonthsStandAlone("abbreviated", sCalendarType);
			aMonthNamesWide = oLocaleData.getMonthsStandAlone("wide", sCalendarType);
		}

		var iSelectedMonth = this.getMonth();

		for (var i = 0; i < aMonths.length; i++) {
			var $DomRef = jQuery(aMonths[i]);
			$DomRef.text(aMonthNames[i + iStartMonth]);
			$DomRef.attr("id", this.getId() + "-m" + (i + iStartMonth));
			if (!this._bLongMonth) {
				$DomRef.attr("aria-label", aMonthNamesWide[i + iStartMonth]);
			}
			if (i + iStartMonth == iSelectedMonth) {
				$DomRef.addClass("sapUiCalItemSel");
			}else {
				$DomRef.removeClass("sapUiCalItemSel");
			}
		}

		this._oItemNavigation.focusItem(iMonth - iStartMonth);
	}

	return MonthPicker;

}, /* bExport= */ true);
