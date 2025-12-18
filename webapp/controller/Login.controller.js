sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("qmportal.controller.Login", {
        onLogin: function () {
            var oUsername = this.byId("usernameInput").getValue();
            var oPassword = this.byId("passwordInput").getValue();

            if (!oUsername || !oPassword) {
                MessageBox.error("Please enter both username and password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var that = this;

            // Busy Indicator
            sap.ui.core.BusyIndicator.show(0);

            // Using filters to simulate passing credentials to checks
            // Requirement: validate entered credentials against service response
            var aFilters = [
                new Filter("Username", FilterOperator.EQ, oUsername),
                new Filter("Password", FilterOperator.EQ, oPassword)
            ];

            oModel.read("/ZQM_LOGIN777", {
                filters: aFilters,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    
                    // Check if any record matches
                    if (oData.results && oData.results.length > 0) {
                        var oUser = oData.results[0];
                        
                        // Strict validation as per requirement "validate... against service response"
                        if (oUser.Username === oUsername && oUser.Password === oPassword) {
                            MessageToast.show("Login Successful");
                            
                            // Store user in session model
                            var oSessionModel = that.getOwnerComponent().getModel("session");
                            oSessionModel.setData({
                                User: oUser.Username,
                                Role: "Quality Engineer" 
                            });

                            // Navigate to Dashboard
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                            oRouter.navTo("RouteDashboard");
                        } else {
                            MessageBox.warning("Invalid Credentials");
                        }
                    } else {
                        MessageBox.warning("Invalid Credentials");
                    }
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Login failed: " + oError.message);
                }
            });
        }
    });
});
