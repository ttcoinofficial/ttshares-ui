import React from "react";
import AccountStore from "stores/AccountStore";
import AssetStore from "stores/AssetStore";
import AltContainer from "alt/AltContainer";
import Dashboard from "./Dashboard";
import Immutable from "immutable";

class DashboardContainer extends React.Component {
    render() {
        return (
            <AltContainer
                stores={[AccountStore]}
                inject={{
                /** bind to chain state will use this to trigger updates to the dashboard */
                resolvedLinkedAccounts: () => {
                    //console.log( "Linked Accounts: ", AccountStore.getState().linkedAccounts,  AccountStore.getState().linkedAccounts.toJS() );
                    return Immutable.List(AccountStore.getState().linkedAccounts);
                },
                /** the dashboard only really needs the list of accounts */
                linkedAccounts: () => {
                    //console.log( "Linked Accounts: ", AccountStore.getState().linkedAccounts,  AccountStore.getState().linkedAccounts.toJS() );
                    return AccountStore.getState().linkedAccounts;
                }
              }}>
                <Dashboard/>
            </AltContainer>
        );
    }
}

export default DashboardContainer;
