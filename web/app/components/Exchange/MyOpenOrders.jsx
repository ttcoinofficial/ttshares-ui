import React from "react";
import {PropTypes} from "react/addons";
import Immutable from "immutable";
import classNames from "classnames";
import market_utils from "common/market_utils";
import {FormattedDate} from "react-intl";
import intlData from "../Utility/intlData";
import Ps from "perfect-scrollbar";
import utils from "common/utils";
import Translate from "react-translate-component";
import counterpart from "counterpart";


class TableHeader extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        let {buy, baseSymbol, quoteSymbol} = this.props;

        if (this.props.type === "buy") {
            return (
                <thead>
                    <tr>
                        <th style={{textAlign: "left"}}></th>
                        <th style={{textAlign: "right"}}><Translate content="transaction.expiration" /></th>
                        <th style={{textAlign: "right"}}><Translate content="exchange.value" /><br/>{baseSymbol ? <small>({baseSymbol})</small> : null}</th>
                        <th style={{textAlign: "right"}}><Translate content="transfer.amount" /><br/>{baseSymbol ? <small>({quoteSymbol})</small> : null}</th>
                        <th style={{textAlign: "right"}}><Translate content="exchange.price" /><br/>{baseSymbol ? <small>({baseSymbol}/{quoteSymbol})</small> : null}</th>
                    </tr>
                </thead>
            );
        } else {
            return (
                <thead>
                    <tr>
                        <th style={{textAlign: "right"}}><Translate content="exchange.price" /><br/>{baseSymbol ? <small>({baseSymbol}/{quoteSymbol})</small> : null}</th>
                        <th style={{textAlign: "right"}}><Translate content="transfer.amount" /><br/>{baseSymbol ? <small>({quoteSymbol})</small> : null}</th>
                        <th style={{textAlign: "right"}}><Translate content="exchange.value" /><br/>{baseSymbol ? <small>({baseSymbol})</small> : null}</th>
                        <th style={{textAlign: "right"}}><Translate content="transaction.expiration" /></th>
                        <th style={{textAlign: "right"}}></th>
                    </tr>
                </thead>
            );
        }
    }
}

TableHeader.defaultProps = {
    quoteSymbol: null,
    baseSymbol: null
};

class OrderRow extends React.Component {

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.order.for_sale !== this.props.order.for_sale ||
            nextProps.order.id !== this.props.order.id
        );
    }

    render() {
        let {base, quote, order, cancel_text, showSymbols, invert} = this.props;
        let {value, price, amount} = market_utils.parseOrder(order, base, quote);
        let isAskOrder = market_utils.isAsk(order, base);
        let tdClass = classNames({orderHistoryBid: !isAskOrder, orderHistoryAsk: isAskOrder});

        let priceSymbol = showSymbols ? <span>{` ${base.symbol}/${quote.symbol}`}</span> : null;
        let valueSymbol = showSymbols ? " " + quote.symbol : null;
        let amountSymbol = showSymbols ? " " + base.symbol : null;

        if (!isAskOrder && !invert) {

            return (
                <tr key={order.id}>
                    <td className="text-right" style={{padding: "2px 5px"}}>
                        <a style={{marginRight: "0"}} className="tiny button outline order-cancel" onClick={this.props.onCancel}>
                        <span>{cancel_text}</span>
                        </a>
                    </td>
                    <td><FormattedDate
                        value={order.expiration}
                        formats={intlData.formats}
                        format="short"
                        />
                    </td>
                    <td>{utils.format_number(value, quote.precision)} {valueSymbol}</td>
                    <td>{utils.format_number(amount, base.precision)} {amountSymbol}</td>
                    <td className={tdClass}>
                        <span className="price-integer">{price.int}</span>
                        .
                        <span className="price-decimal">{price.dec}</span>
                        {priceSymbol}
                    </td>
                </tr>
            );
        } else {
            return (
                <tr key={order.id}>
                    <td className={tdClass}>
                        <span className="price-integer">{price.int}</span>
                        .
                        <span className="price-decimal">{price.dec}</span>
                        {priceSymbol}
                    </td>
                    <td>{utils.format_number(amount, base.precision)} {amountSymbol}</td>
                    <td>{utils.format_number(value, quote.precision)} {valueSymbol}</td>
                    <td><FormattedDate
                        value={order.expiration}
                        formats={intlData.formats}
                        format="short"
                        />
                    </td>
                    <td className="text-right" style={{padding: "2px 5px"}}>
                        <a style={{marginRight: "0"}} className="tiny button outline order-cancel" onClick={this.props.onCancel}>
                        <span>{cancel_text}</span>
                        </a>
                    </td>
                </tr>
            );
        }
    }
}

OrderRow.defaultProps = {
    showSymbols: false,
    invert: false
};


class MyOpenOrders extends React.Component {

    shouldComponentUpdate(nextProps) {
        return (
                nextProps.currentAccount !== this.props.currentAccount ||
                !Immutable.is(nextProps.orders, this.props.orders)
            );
    }

    componentDidMount() {
        let orderContainer = React.findDOMNode(this.refs.orders);
        Ps.initialize(orderContainer);
    }

    render() {
        let {orders, currentAccount, base, quote, quoteSymbol, baseSymbol} = this.props;
        let bids = null, asks = null;
        if(orders.size > 0 && base && quote) {
            let cancel = counterpart.translate("account.perm.cancel");

            bids = orders.filter(a => {
                return (a.seller === currentAccount && a.sell_price.quote.asset_id !== base.id);
            }).sort((a, b) => {
                let {price: a_price} = market_utils.parseOrder(a, base, quote);
                let {price: b_price} = market_utils.parseOrder(b, base, quote);

                return b_price.full - a_price.full;
            }).map(order => {

                return <OrderRow key={order.id} order={order} base={base} quote={quote} cancel_text={cancel} onCancel={this.props.onCancel.bind(this, order.id)}/>;
            }).toArray();

            asks = orders.filter(a => {
                return (a.seller === currentAccount && a.sell_price.quote.asset_id === base.id);
            }).sort((a, b) => {
                let {price: a_price} = market_utils.parseOrder(a, base, quote);
                let {price: b_price} = market_utils.parseOrder(b, base, quote);

                return a_price.full - b_price.full;
            }).map(order => {
                return <OrderRow key={order.id} order={order} base={base} quote={quote} cancel_text={cancel} onCancel={this.props.onCancel.bind(this, order.id)}/>;
            }).toArray();

        } else {
            return (
                <div key="open_orders" className="grid-content text-center ps-container" ref="orders">
                    <table className="table order-table my-orders text-right table-hover">
                        <tbody>
                        </tbody>
                    </table>

                    <table className="table order-table my-orders text-right table-hover">
                        <tbody>
                        </tbody>
                </table>
                </div>
            );
        }

        return (
            <div key="open_orders" className="grid-content no-padding text-center ps-container" ref="orders">
                <table className="table order-table my-orders text-right table-hover">
                    <TableHeader type="buy" baseSymbol={baseSymbol} quoteSymbol={quoteSymbol}/>
                    <tbody>
                        {bids}
                    </tbody>
                </table>

                <table className="table order-table my-orders text-right table-hover">
                    <TableHeader type="sell" baseSymbol={baseSymbol} quoteSymbol={quoteSymbol}/>
                    <tbody>
                        {asks}
                    </tbody>
                </table>
            </div>
        );
    }
}

MyOpenOrders.defaultProps = {
    base: {},
    quote: {},
    orders: {},
    quoteSymbol: "",
    baseSymbol: ""
};

MyOpenOrders.propTypes = {
    base: PropTypes.object.isRequired,
    quote: PropTypes.object.isRequired,
    orders: PropTypes.object.isRequired,
    quoteSymbol: PropTypes.string.isRequired,
    baseSymbol: PropTypes.string.isRequired
};

exports.OrderRow = OrderRow;
exports.TableHeader = TableHeader;
exports.MyOpenOrders = MyOpenOrders;
