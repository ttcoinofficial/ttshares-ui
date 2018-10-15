import React from "react"
import Webcam from "lib/react-webcam"
import PrivateKey from "ecc/key_private"
import qr from "common/qr-image"
import hash from "common/hash"
import key from "common/key_utils"

class KeyGenComponent extends React.Component {

    render() {
        var privkey = new BrainKeyUi().create()
        return <div>
            <QrScan/>
            <hr/>
            <ShowPrivateKey privkey={privkey}/>
            <QrCode data={privkey.toWif()}/>
        </div>
    }
    
}

class BrainKeyUi {
    
    create(entropy_string = "add mouse entropy...") {
        return key.suggest_brain_key(
            key.browserEntropy() +
            entropy_string
        )
    }
}

class QrScan extends React.Component {
    
    render() {
        return <div>
            <a className="button" onclick="scanPicture()">SCAN</a>
            <Webcam noAudio/>
        </div>
    }
}

class QrCode extends React.Component {
    
    render() {
        var svg_string = qr.imageSync(this.props.data, { type: 'svg' })
        return <div>
            <img dangerouslySetInnerHTML={{__html: svg_string}} />
        </div>
    }
}

class ShowPrivateKey extends React.Component {
    
    render() {
        return <div>
            <div>Private Key {this.props.privkey.toWif()}</div>
        </div>
    }
}


export default KeyGenComponent
