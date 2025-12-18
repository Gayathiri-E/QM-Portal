sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("qmportal.controller.Dashboard", {
        onInit: function () {
            // Check session?
        },

        onPressInspection: function () {
            this.getOwnerComponent().getRouter().navTo("RouteInspectionLot", {
                query: {
                    mode: "view"
                }
            });
        },

        onPressRecording: function () {
            this.getOwnerComponent().getRouter().navTo("RouteInspectionLot", {
                query: {
                    mode: "record"
                }
            });
        },

        onPressDecision: function () {
            this.getOwnerComponent().getRouter().navTo("RouteInspectionLot", {
                query: {
                    mode: "decision"
                }
            });
        },

        onLogout: function () {
            var oSessionModel = this.getOwnerComponent().getModel("session");
            oSessionModel.setData({}); // Clear session
            this.getOwnerComponent().getRouter().navTo("RouteLogin");
        }
    });
});
