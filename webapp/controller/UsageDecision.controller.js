sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, BusyIndicator, MessageToast) {

    "use strict";

    return Controller.extend("qmportal.controller.UsageDecision", {

        onInit: function () {
            this.getView().setModel(new JSONModel({
                showData: false
            }), "viewModel");

            this.getView().setModel(new JSONModel(), "usage");
        },

        onSearch: function () {
            var sLot = this.byId("lotInput").getValue();
            if (!sLot) {
                MessageBox.error("Enter Inspection Lot");
                return;
            }

            var oModel = this.getView().getModel();
            var oUsageModel = this.getView().getModel("usage");
            var oViewModel = this.getView().getModel("viewModel");

            BusyIndicator.show(0);

            oModel.read("/ZQM_USAGE777('" + sLot + "')", {
                success: function (oData) {
                    BusyIndicator.hide();
                    oUsageModel.setData(oData);
                    oViewModel.setProperty("/showData", true);
                },
                error: function () {
                    BusyIndicator.hide();
                    MessageBox.error("No Usage Decision found");
                    oViewModel.setProperty("/showData", false);
                }
            });
        },
        onApprove: function () {
    MessageToast.show("Approved successfully");
},

onReject: function () {
    MessageToast.show("Denied successfully");
},


        onNavBack: function () {
            history.go(-1);
        }
    });
});
