sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("qmportal.controller.Dashboard", {

        // Inspection List
        onPressInspection: function () {
            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteInspectionLot");
        },
onPressRecording: function () {
    this.getOwnerComponent().getRouter().navTo("RouteResultRecording");
},

onPressDecision: function () {
    this.getOwnerComponent().getRouter().navTo("RouteUsageDecision");
},


        onLogout: function () {
            this.getOwnerComponent().getModel("session").setData({});
            this.getOwnerComponent().getRouter().navTo("RouteLogin", {}, true);
        }
    });
});
