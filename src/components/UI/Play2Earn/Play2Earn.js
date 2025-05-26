import "bootstrap/dist/css/bootstrap.min.css";
import "./Play2Earn.scss";
import { useNavigate } from "react-router-dom";

export const Play2Earn = () => {
	const navigate = useNavigate();

	return (
		<div className="playToEarn">
			<div className="u-container">
				<div className="u-ribbon">Play2Earn</div>
				<div className="u-content">
					<div className="u-logo"></div>

					<div className="u-buttongroup">
						<button className="u-button" onClick={ () => { alert('Connect Wallet please!') } }>Create Game</button>
						<button className="u-button" onClick={ () => { alert('Connect Wallet please!') } }>Join Game</button>
					</div>
				</div>
				<div className="u-ribbon1" onClick={ () => { window.openMetaMaskModal()} }>Connect Wallet</div>
			</div>
		</div>
	);
}

export default Play2Earn;