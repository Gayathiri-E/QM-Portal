sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator"
], function (Controller, JSONModel, MessageBox, BusyIndicator) {
    "use strict";

    return Controller.extend("qmportal.controller.ResultRecording", {

        onInit: function () {
            this.getView().setModel(new JSONModel({
                showData: false
            }), "viewModel");

            this.getView().setModel(new JSONModel(), "record");
        },

        onSearch: function () {
            var sLot = this.byId("lotInput").getValue();
            if (!sLot) {
                MessageBox.error("Enter Inspection Lot");
                return;
            }

            var oModel = this.getView().getModel();
            var oRecordModel = this.getView().getModel("record");
            var oViewModel = this.getView().getModel("viewModel");

            BusyIndicator.show(0);

            oModel.read("/ZQM_RECORD777('" + sLot + "')", {
                success: function (oData) {
                    BusyIndicator.hide();
                    oRecordModel.setData(oData);
                    oViewModel.setProperty("/showData", true);
                },
                error: function () {
                    BusyIndicator.hide();
                    MessageBox.error("No Record found for Inspection Lot " + sLot);
                    oViewModel.setProperty("/showData", false);
                }
            });
        },

        onSave: function () {
            MessageBox.success("Saved Successfully");
        },

        onNavBack: function () {
            history.go(-1);
        }
    });
});
