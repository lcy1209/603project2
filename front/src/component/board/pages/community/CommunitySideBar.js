import { Link } from "react-router-dom";
import "./css/CommunitySideBar.css";

const CommunitySideBar = () => {


    return (
        <div className="community-side-bar">
            <h2 className="font-bold">MENU</h2>
            <div className="community-side-bar-division-line"></div>
            <div className="community-side-bar-menu">
                <Link to="/community/notice" reloadDocument>
                    공지사항
                </Link>
                <Link to="/community/faq" reloadDocument>
                    FAQ
                </Link>
                <Link to="/community/archive" reloadDocument>
                    자료실
                </Link>
            </div>
        </div>
    );
}

export default CommunitySideBar;