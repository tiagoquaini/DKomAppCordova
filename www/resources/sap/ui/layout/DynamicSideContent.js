/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/ResizeHandler'],function(q,C,R){"use strict";var D=C.extend("sap.ui.layout.DynamicSideContent",{metadata:{library:"sap.ui.layout",properties:{showSideContent:{type:"boolean",group:"Appearance",defaultValue:true},showMainContent:{type:"boolean",group:"Appearance",defaultValue:true},sideContentVisibility:{type:"sap.ui.layout.SideContentVisibility",group:"Appearance",defaultValue:sap.ui.layout.SideContentVisibility.ShowAboveS},sideContentFallDown:{type:"sap.ui.layout.SideContentFallDown",group:"Appearance",defaultValue:sap.ui.layout.SideContentFallDown.OnMinimumWidth},equalSplit:{type:"boolean",group:"Appearance",defaultValue:false},containerQuery:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"mainContent",events:{breakpointChanged:{parameters:{currentBreakpoint:{type:"string"}}}},aggregations:{mainContent:{type:"sap.ui.core.Control",multiple:true},sideContent:{type:"sap.ui.core.Control",multiple:true}}}});var S="S",M="M",L="L",X="XL",H="sapUiHidden",a="sapUiDSCSpan12",b="sapUiDSCMCFixed",c="sapUiDSCSCFixed",d=3,e=4,f=6,g=8,h=9,i=12,I="Invalid Breakpoint. Expected: S, M, L or XL",j="SCGridCell",k="MCGridCell",l=720,m=1024,n=1440;D.prototype.init=function(){this._bSuppressInitialFireBreakPointChange=true;};D.prototype.setShowSideContent=function(v,s){this.setProperty("showSideContent",v,true);this._SCVisible=v;if(!s&&this.$().length){this._setResizeData(this.getCurrentBreakpoint(),this.getEqualSplit());if(this._currentBreakpoint===S){this._MCVisible=true;}this._changeGridState();}return this;};D.prototype.setShowMainContent=function(v,s){this.setProperty("showMainContent",v,true);this._MCVisible=v;if(!s&&this.$().length){this._setResizeData(this.getCurrentBreakpoint(),this.getEqualSplit());if(this._currentBreakpoint===S){this._SCVisible=true;}this._changeGridState();}return this;};D.prototype.getShowSideContent=function(){if(this._currentBreakpoint===S){return this._SCVisible&&this.getProperty("showSideContent");}else{return this.getProperty("showSideContent");}};D.prototype.getShowMainContent=function(){if(this._currentBreakpoint===S){return this._MCVisible&&this.getProperty("showMainContent");}else{return this.getProperty("showMainContent");}};D.prototype.setEqualSplit=function(s){this._MCVisible=true;this._SCVisible=true;this.setProperty("equalSplit",s,true);if(this._currentBreakpoint){this._setResizeData(this._currentBreakpoint,s);this._changeGridState();}return this;};D.prototype.addSideContent=function(o){this.addAggregation("sideContent",o,true);this._rerenderControl(this.getAggregation("sideContent"),this.$(j));return this;};D.prototype.addMainContent=function(o){this.addAggregation("mainContent",o,true);this._rerenderControl(this.getAggregation("mainContent"),this.$(k));return this;};D.prototype.toggle=function(){if(this._currentBreakpoint===S){if(!this.getProperty("showMainContent")){this.setShowMainContent(true,true);this._MCVisible=false;}if(!this.getProperty("showSideContent")){this.setShowSideContent(true,true);this._SCVisible=false;}if(this._MCVisible&&!this._SCVisible){this._SCVisible=true;this._MCVisible=false;}else if(!this._MCVisible&&this._SCVisible){this._MCVisible=true;this._SCVisible=false;}this._changeGridState();}return this;};D.prototype.getCurrentBreakpoint=function(){return this._currentBreakpoint;};D.prototype.onBeforeRendering=function(){this._detachContainerResizeListener();this._SCVisible=this.getProperty("showSideContent");this._MCVisible=this.getProperty("showMainContent");if(!this.getContainerQuery()){this._iWindowWidth=q(window).width();this._setBreakpointFromWidth(this._iWindowWidth);this._setResizeData(this._currentBreakpoint,this.getEqualSplit());}};D.prototype.onAfterRendering=function(){if(this.getContainerQuery()){this._attachContainerResizeListener();this._adjustToScreenSize();}else{var t=this;q(window).resize(function(){t._adjustToScreenSize();});}this._changeGridState();this._initScrolling();};D.prototype.exit=function(){this._detachContainerResizeListener();if(this._oSCScroller){this._oSCScroller.destroy();this._oSCScroller=null;}if(this._oMCScroller){this._oMCScroller.destroy();this._oMCScroller=null;}};D.prototype._rerenderControl=function(o,$){if(this.getDomRef()){var r=sap.ui.getCore().createRenderManager();this.getRenderer().renderControls(r,o);r.flush($[0]);r.destroy();}return this;};D.prototype._initScrolling=function(){var s=this.getId(),o=s+"-"+j,p=s+"-"+k;if(!this._oSCScroller&&!this._oMCScroller){q.sap.require("sap.ui.core.delegate.ScrollEnablement");this._oSCScroller=new sap.ui.core.delegate.ScrollEnablement(this,null,{scrollContainerId:o,horizontal:false,vertical:true});this._oMCScroller=new sap.ui.core.delegate.ScrollEnablement(this,null,{scrollContainerId:p,horizontal:false,vertical:true});}};D.prototype._attachContainerResizeListener=function(){if(!this._sContainerResizeListener){this._sContainerResizeListener=R.register(this,q.proxy(this._adjustToScreenSize,this));}};D.prototype._detachContainerResizeListener=function(){if(this._sContainerResizeListener){R.deregister(this._sContainerResizeListener);this._sContainerResizeListener=null;}};D.prototype._getBreakPointFromWidth=function(w){if(w<=l&&this._currentBreakpoint!==S){return S;}else if((w>l)&&(w<=m)&&this._currentBreakpoint!==M){return M;}else if((w>m)&&(w<=n)&&this._currentBreakpoint!==L){return L;}else if(w>n&&this._currentBreakpoint!==X){return X;}return this._currentBreakpoint;};D.prototype._setBreakpointFromWidth=function(w){this._currentBreakpoint=this._getBreakPointFromWidth(w);if(this._bSuppressInitialFireBreakPointChange){this._bSuppressInitialFireBreakPointChange=false;}else{this.fireBreakpointChanged({currentBreakpoint:this._currentBreakpoint});}};D.prototype._adjustToScreenSize=function(){if(this.getContainerQuery()){this._iWindowWidth=this.$().parent().width();}else{this._iWindowWidth=q(window).width();}if(this._iWindowWidth!==this._iOldWindowWidth){this._iOldWindowWidth=this._iWindowWidth;this._oldBreakPoint=this._currentBreakpoint;this._setBreakpointFromWidth(this._iWindowWidth);if((this._oldBreakPoint!==this._currentBreakpoint)||(this._currentBreakpoint===M&&this.getSideContentFallDown()===sap.ui.layout.SideContentFallDown.OnMinimumWidth)){this._setResizeData(this._currentBreakpoint,this.getEqualSplit());this._changeGridState();}}};D.prototype._setResizeData=function(s,o){var p=this.getSideContentVisibility(),r=this.getSideContentFallDown();if(!o){switch(s){case S:this._setSpanSize(i,i);if(this.getProperty("showSideContent")&&this.getProperty("showMainContent")){this._SCVisible=p===sap.ui.layout.SideContentVisibility.AlwaysShow;}this._bFixedSideContent=false;break;case M:var t=Math.ceil((33.333/100)*this._iWindowWidth);if(r===sap.ui.layout.SideContentFallDown.BelowL||r===sap.ui.layout.SideContentFallDown.BelowXL||(t<=320&&r===sap.ui.layout.SideContentFallDown.OnMinimumWidth)){this._setSpanSize(i,i);this._bFixedSideContent=false;}else{this._setSpanSize(e,g);this._bFixedSideContent=true;}this._SCVisible=p===sap.ui.layout.SideContentVisibility.ShowAboveS||p===sap.ui.layout.SideContentVisibility.AlwaysShow;this._MCVisible=true;break;case L:if(r===sap.ui.layout.SideContentFallDown.BelowXL){this._setSpanSize(i,i);}else{this._setSpanSize(e,g);}this._SCVisible=p===sap.ui.layout.SideContentVisibility.ShowAboveS||p===sap.ui.layout.SideContentVisibility.ShowAboveM||p===sap.ui.layout.SideContentVisibility.AlwaysShow;this._MCVisible=true;this._bFixedSideContent=false;break;case X:this._setSpanSize(d,h);this._SCVisible=p!==sap.ui.layout.SideContentVisibility.NeverShow;this._MCVisible=true;this._bFixedSideContent=false;break;default:throw new Error(I);}}else{switch(s){case S:this._setSpanSize(i,i);this._SCVisible=false;break;default:this._setSpanSize(f,f);this._SCVisible=true;this._MCVisible=true;}this._bFixedSideContent=false;}return this;};D.prototype._shouldSetHeight=function(){var s,B,o,O,p,F,r;s=(this._iScSpan+this._iMcSpan)===i;B=this._MCVisible&&this._SCVisible;o=!this._MCVisible&&this._SCVisible;O=this._MCVisible&&!this._SCVisible;p=o||O;F=this._fixedSideContent;r=this.getSideContentVisibility()===sap.ui.layout.SideContentVisibility.NeverShow;return((s&&B)||p||F||r);};D.prototype._changeGridState=function(){var $=this.$(j),o=this.$(k),p=this.getProperty("showMainContent"),s=this.getProperty("showSideContent");if(this._bFixedSideContent){$.removeClass().addClass(c);o.removeClass().addClass(b);}else{$.removeClass(c);o.removeClass(b);}if(this._SCVisible&&this._MCVisible&&s&&p){if(!this._bFixedSideContent){o.removeClass().addClass("sapUiDSCSpan"+this._iMcSpan);$.removeClass().addClass("sapUiDSCSpan"+this._iScSpan);}if(this._shouldSetHeight()){$.css("height","100%").css("float","left");o.css("height","100%").css("float","left");}else{$.css("height","auto").css("float","none");o.css("height","auto").css("float","none");}}else if(!this._SCVisible&&!this._MCVisible){o.addClass(H);$.addClass(H);}else if(this._MCVisible&&p){o.removeClass().addClass(a);$.addClass(H);}else if(this._SCVisible&&s){$.removeClass().addClass(a);o.addClass(H);}else if(!p&&!s){o.addClass(H);$.addClass(H);}};D.prototype._setSpanSize=function(s,o){this._iScSpan=s;this._iMcSpan=o;};return D;},true);