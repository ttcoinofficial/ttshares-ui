import React from "react";
import SettingsStore from "stores/SettingsStore";
import IntlStore from "stores/IntlStore";
import AltContainer from "alt/AltContainer";
import Settings from "./Settings";

class SettingsContainer extends React.Component {

    render() {

        return (
              <AltContainer 
                  stores={[SettingsStore]}
                  inject={{
                    settings: () => {
                        return SettingsStore.getState().settings;
                    },
                    defaults: () => {
                        return SettingsStore.getState().defaults;
                    },
                    localesObject: () => {
                        return IntlStore.getState().localesObject;
                    }
                  }} 
                  >
                <Settings/>
              </AltContainer>
        );
    }
}

export default SettingsContainer;
