// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/core/routing/History",
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator"
// ], function (Controller, History, Filter, FilterOperator) {
//     "use strict";

//     return Controller.extend("qmportal.controller.InspectionLot", {
//         onInit: function () {
//             this.getOwnerComponent().getRouter().getRoute("RouteInspectionLot").attachPatternMatched(this._onRouteMatched, this);
//         },

//         _onRouteMatched: function (oEvent) {
//             var oArgs = oEvent.getParameter("arguments");
//             this._sMode = oArgs["?query"] ? oArgs["?query"].mode : "view";

//             var oTitle = "Inspection Lots";
//             if (this._sMode === "record") {
//                 oTitle = "Select Lot for Result Recording";
//             } else if (this._sMode === "decision") {
//                 oTitle = "Select Lot for Usage Decision";
//             }
//             this.byId("inspectionLotPage").setTitle(oTitle);
//         },

//         onSearch: function (oEvent) {
//             var sQuery = oEvent.getParameter("query");
//             var aFilters = [];
//             if (sQuery) {
//                 aFilters.push(new Filter("InspectionLot", FilterOperator.Contains, sQuery));
//             }
//             var oList = this.byId("inspectionTable");
//             var oBinding = oList.getBinding("items");
//             oBinding.filter(aFilters);
//         },

//         // onItemPress: function (oEvent) {
//         //     var oItem = oEvent.getParameter("listItem");
//         //     var sPath = oItem.getBindingContext().getPath();
//         //     var oObject = oItem.getBindingContext().getObject();
//         //     var sLot = oObject.InspectionLot;

//         //     if (this._sMode === "record") {
//         //         this.getOwnerComponent().getRouter().navTo("RouteResultRecording", {
//         //             InspectionLot: sLot
//         //         });
//         //     } else if (this._sMode === "decision") {
//         //         this.getOwnerComponent().getRouter().navTo("RouteUsageDecision", {
//         //             InspectionLot: sLot
//         //         });
//         //     } else {
//         //         // View mode - maybe stay or show details in dialog? 
//         //         // For now, no detail view specified in plan for "View Only", so just select it.
//         //     }
//         // },
//         onItemPress: function (oEvent) {
//     var oObject = oEvent.getParameter("listItem")
//         .getBindingContext()
//         .getObject();

//     var sLot = oObject.InspectionLot;
//     var oRouter = this.getOwnerComponent().getRouter();

//     if (this._sMode === "record") {
//         oRouter.navTo("RouteResultRecording", {
//             InspectionLot: sLot
//         });
//     } else if (this._sMode === "decision") {
//         oRouter.navTo("RouteUsageDecision", {
//             InspectionLot: sLot
//         });
//     }
// },

//         onNavBack: function () {
//             var oHistory = History.getInstance();
//             var sPreviousHash = oHistory.getPreviousHash();

//             if (sPreviousHash !== undefined) {
//                 window.history.go(-1);
//             } else {
//                 this.getOwnerComponent().getRouter().navTo("RouteDashboard", {}, true);
//             }
//         }
//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, History, MessageToast, Filter, FilterOperator) {

    "use strict";

    return Controller.extend("qmportal.controller.InspectionLot", {

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteInspectionLot")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var sMode = this.getOwnerComponent()
                .getModel("session")
                .getProperty("/mode");

            this._sMode = sMode || "view";

            var sTitle = "Inspection Lots";
            if (this._sMode === "record") {
                sTitle = "Select Inspection Lot for Result Recording";
            } else if (this._sMode === "decision") {
                sTitle = "Select Inspection Lot for Usage Decision";
            }

            this.byId("inspectionLotPage").setTitle(sTitle);
        },

        onItemPress: function (oEvent) {
            var oObject = oEvent
                .getParameter("listItem")
                .getBindingContext()
                .getObject();

            var sLot = oObject.InspectionLot;
            var oRouter = this.getOwnerComponent().getRouter();

            if (this._sMode === "record") {
                oRouter.navTo("RouteResultRecording", {
                    InspectionLot: sLot
                });
            } 
            else if (this._sMode === "decision") {
                oRouter.navTo("RouteUsageDecision", {
                    InspectionLot: sLot
                });
            } 
            else {
                MessageToast.show("View-only mode");
            }
        },

        onSearch: function (oEvent) {
    var sQuery = oEvent.getParameter("query");

    var oTable = this.byId("inspectionTable");
    var oBinding = oTable.getBinding("items");

    if (sQuery) {
        var aFilters = [
            new Filter("InspectionLot", FilterOperator.Contains, sQuery)
        ];
        oBinding.filter(aFilters);
    } else {
        oBinding.filter([]);
    }
},

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteDashboard", {}, true);
            }
        }
    });
});
