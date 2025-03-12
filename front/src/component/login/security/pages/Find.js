import FindId from "../components/Login/FindId";
import FindPw from "../components/Login/FindPw";
// import Header from "../../../fragments/header/header";
// import Footer from "../../../fragments/footer/footer";
import { useParams } from "react-router-dom";

const Find = () => {
    const { id } = useParams();

    return (<>
        {/* <Header /> */}
        {(id === "id") ? <FindId /> : <FindPw />}
        {/* <Footer /> */}
    </>
    )
}
export default Find;