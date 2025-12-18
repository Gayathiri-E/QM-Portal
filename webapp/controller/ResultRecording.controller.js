sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, History, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("qmportal.controller.ResultRecording", {
        onInit: function () {
            var oViewModel = new JSONModel({
                editable: true
            });
            this.getView().setModel(oViewModel, "viewModel");

            this.getOwnerComponent().getRouter().getRoute("RouteResultRecording").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sLot = oEvent.getParameter("arguments").InspectionLot;
            this.getView().bindElement({
                path: "/ZQM_RECORD777('" + sLot + "')",
                events: {
                    dataReceived: this._onDataReceived.bind(this)
                }
            });
        },

        _onDataReceived: function (oEvent) {
            var oData = oEvent.getSource().getBoundContext().getObject();
            // If UD taken, read-only
            if (oData && oData.UsageDecisionCode) {
                this.getView().getModel("viewModel").setProperty("/editable", false);
                MessageToast.show("Usage Decision already taken. Read-only mode.");
            } else {
                this.getView().getModel("viewModel").setProperty("/editable", true);
            }
        },

        onSave: function () {
            var oContext = this.getView().getBindingContext();
            var oData = oContext.getObject();
            var fTotal = parseFloat(oData.UnrestrictedQty || 0) + parseFloat(oData.BlockedQty || 0) + parseFloat(oData.ProductionQty || 0);

            if (fTotal > parseFloat(oData.LotQuantity)) {
                MessageBox.error("Total recorded quantity cannot exceed Lot Quantity (" + oData.LotQuantity + ")");
                return;
            }

            var oModel = this.getView().getModel();

            // Busy Indicator
            sap.ui.core.BusyIndicator.show(0);

            oModel.submitChanges({
                success: function () {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Results Saved Successfully");
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Error saving results");
                }
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteDashboard", {}, true);
            }
        }
    });
});
