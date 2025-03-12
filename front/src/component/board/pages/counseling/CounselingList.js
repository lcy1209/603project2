import onlineCouns from "./images/onlineCouns.png";
import offlineCouns from "./images/offlineCouns.png";
import realTimeCouns from "./images/realTimeCouns.png";
import "./css/CounselingList.css";
import { Link } from "react-router-dom";

const CounselingList = () => {


    return (
        <div className="couns-container">
            <div className="list">
                <div className="online">
                    <Link to="./online">
                        <img src={onlineCouns} alt="online-counseling" />
                        <h2 className="font-bold">온라인 상담</h2>
                    </Link>
                </div>
                <div className="offline">
                    <Link to="./offline">
                        <img src={offlineCouns} alt="offline-counseling" />
                        <h2 className="font-bold">오프라인 상담</h2>
                    </Link>
                </div>
                <div className="realtime">
                    <Link to="./realtime">
                        <img src={realTimeCouns} alt="realTime-counseling" />
                        <h2 className="font-bold">실시간 상담</h2>
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default CounselingList;