import React from "react";
import {Link} from "react-router";
import FormattedAsset from "../Utility/FormattedAsset";
import FormattedPrice from "../Utility/FormattedPrice";
import Translate from "react-translate-component";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import ChainStore from "api/ChainStore";

@BindToChainState()
class MarketCard extends React.Component {

    static propTypes = {
        quote: ChainTypes.ChainAsset.isRequired,
        base: ChainTypes.ChainAsset.isRequired
    }

    static contextTypes = {router: React.PropTypes.func.isRequired};

    _onClick(marketID) {
        this.context.router.transitionTo("exchange", {marketID: marketID});
    }

    render() {

        let {quote, base} = this.props;
        if (!quote || !base) {
            return null;
        }
        let marketID = quote.get("symbol") + "_" + base.get("symbol");
        let marketName = quote.get("symbol") + " vs " + base.get("symbol");
        let dynamic_data = quote.get("dynamic");

        return (
            <div style={{padding: "0.5em 0.5em"}} className="grid-content account-card">
                <div className="card">
                        <div onClick={this._onClick.bind(this, marketID)}>
                            <div style={{padding: "5px"}}>
                            </div>
                            <div style={{color: "black"}} className="card-divider text-center">
                                <span>{marketName}</span>
                            </div>
                            <div className="card-section">
                                <ul >
                                    <li>
                                        <Translate content="markets.core_rate" />:&nbsp;
                                        <FormattedPrice
                                            style={{fontWeight: "bold"}}
                                            quote_amount={quote.getIn(["options", "core_exchange_rate", "quote", "amount"])}
                                            quote_asset={quote.getIn(["options", "core_exchange_rate", "quote", "asset_id"])}
                                            base_amount={quote.getIn(["options", "core_exchange_rate", "base", "amount"])}
                                            base_asset={quote.getIn(["options", "core_exchange_rate", "base", "asset_id"])}
                                        />
                                    </li>
                                    <li><Translate content="markets.supply" />:&nbsp;
                                        {dynamic_data ? <FormattedAsset
                                            style={{fontWeight: "bold"}}
                                            amount={parseInt(dynamic_data.get("current_supply"), 10)}
                                            asset={quote.get("id")}/> : null}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    <span style={{marginBottom: "5px", marginRight: "5px",zIndex:999, backgroundColor: "#6A6A6A"}} onClick={this.props.removeMarket} className="badge float-right">-</span>
                </div>
            </div>
        );
    }
}

export default MarketCard;
