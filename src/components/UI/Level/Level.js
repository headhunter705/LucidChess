import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Level.scss";
import { gameModes } from "../../../utils/constant";

export const Level = () => {
	const navigate = useNavigate();

	const machinePlayAction = ( aiLevel ) => {
		navigate('/gameScene', { state: { mode: gameModes['P2E'], aiLevel: aiLevel } });
	}

    return (
		<div className="selectLevel">
			<div className="u-container">
				<div className="u-ribbon">Choose Level</div>
				<div className="u-content">
					<div className="u-content-container">
						<div className="u-table-wrap">
							<div className="u-row">
								<div className="u-item-container">
									<button className="u-item" onClick={ () => { navigate('/connect') } }>AI MonKey</button>
								</div>
								{/* <div className="u-item-container">
									<button className="u-item" onClick={ () => machinePlayAction(0)}>AI MonKey</button>
								</div> */}
								<div className="u-item-container">
									<button className="u-item" onClick={ () => { navigate('/connect')} }>Beginner</button>
								</div>
							</div>
							<div className="u-row">
								<div className="u-item-container">
									<button className="u-item" onClick={ () => { navigate('/connect')} }>Intermediate</button>
								</div>
								<div className="u-item-container">
									<button className="u-item" onClick={ () => { navigate('/connect')} }>Advanced</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* <div className="u-ribbon1" onClick={ () => { navigate('/connect')} }>Connect Wallet</div> */}
			</div>
		</div>
    );
}

export default Level;