import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./MatchPlayLogin.scss";
import { gameModes } from "../../../utils/constant";
import { useRef, useState } from "react";

export const MatchPlayLogin = () => {
	const [name, setName] = useState('');
	const navigate = useNavigate();
	const inputRef = useRef(null);

	const createAction = () => {
		if( name === '' ){
			if (inputRef.current) inputRef.current.focus();
			return;
		}

		navigate('/friendPlay/rooms', { state: { mode: gameModes['P2P'], username: name, friendMatch: false }});

    }

    return (
        <div className="MatchPlayLogin">
			<div className="u-container">
				<div className="u-ribbon">Match matching game</div>
				<div className="u-content">
					<div className="u-logo"></div>

					<div className="u-input-wrap">
						<input
							ref={inputRef}
							className="u-input"
							type="text"
							placeholder="Enter your name"
							onChange={(e) => setName(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' ? createAction() : null}
						/>
					</div>

					<div className="u-buttongroup">
						<button className="u-button" onClick={ createAction }>Play</button>
					</div>
				</div>
				{/* <div className="u-ribbon1" onClick={ () => { navigate('/connect')} }>Connect Wallet</div> */}
			</div>
        </div>
    )
}

export default MatchPlayLogin;