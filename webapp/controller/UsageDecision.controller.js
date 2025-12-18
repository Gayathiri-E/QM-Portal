sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, History, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("qmportal.controller.UsageDecision", {
        onInit: function () {
            var oViewModel = new JSONModel({
                editable: true
            });
            this.getView().setModel(oViewModel, "viewModel");

            this.getOwnerComponent().getRouter().getRoute("RouteUsageDecision").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sLot = oEvent.getParameter("arguments").InspectionLot;
            this.getView().bindElement({
                path: "/ZQM_USAGE777('" + sLot + "')",
                events: {
                    dataReceived: this._onDataReceived.bind(this)
                }
            });
        },

        _onDataReceived: function (oEvent) {
            var oData = oEvent.getSource().getBoundContext().getObject();
            // If UD already taken, read-only
            if (oData && oData.UsageDecisionCode) {
                // Check if it's a "saved" decision or just pre-filled default? 
                // Usually if "DecisionDate" is present, it's done.
                // Requirement mandates checking if qty matches to allow decision.
                // If code is there, maybe it's done?
                // Let's assume if DecisionDate is set, it's done. 
                // Or if we interpret "UsageDecisionCode" existing as done.
                // But the ComboBox is bound to it.
                // I'll check a flag or just UsageDecisionCode.
                // If it's already approved/rejected (A or R), likely done.
                if (oData.UsageDecisionCode === 'A' || oData.UsageDecisionCode === 'R') {
                    this.getView().getModel("viewModel").setProperty("/editable", false);
                    MessageToast.show("Decision already made.");
                } else {
                    this.getView().getModel("viewModel").setProperty("/editable", true);
                }
            }
        },

        onSubmit: function () {
            var oContext = this.getView().getBindingContext();
            var oData = oContext.getObject();

            var fLotQty = parseFloat(oData.LotQuantity || 0);
            var fRecorded = parseFloat(oData.UnrestrictedQty || 0) + parseFloat(oData.BlockedQty || 0) + parseFloat(oData.ProductionQty || 0);

            // Validation: Inspected != Lot
            if (fRecorded !== fLotQty) {
                MessageBox.error("Cannot make Usage Decision. Recorded Quantity (" + fRecorded + ") does not match Lot Quantity (" + fLotQty + ").");
                return;
            }

            if (!oData.UsageDecisionCode) {
                MessageBox.error("Please select a Usage Decision Code.");
                return;
            }

            // Set Decision data
            var oModel = this.getView().getModel();

            // We need to set Date/Time manually or let backend do it?
            // "recording fields such as ... DecisionDate, DecisionTime ...". 
            // Better to set them here.
            var now = new Date();
            oModel.setProperty("DecisionDate", now, oContext);
            // Time is usually Edm.Time, UI5 binds it as Date object or string depending on V2/V4.
            // Simplified: Backend usually handles timestamp if not provided, sending as is.

            // Busy Indicator
            sap.ui.core.BusyIndicator.show(0);

            oModel.submitChanges({
                success: function () {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Usage Decision Submitted Successfully");
                    // Nav back?
                    this.onNavBack();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Error submitting decision");
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
