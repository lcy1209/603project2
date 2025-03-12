import axios from "axios";
import { SERVER_URL } from "../api/serverURL";

const useFileDownload = () => {
    const handleFileDownload = async (fileUrl, fileName) => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/board${fileUrl}`, {
                responseType: 'blob', // 파일 다운로드를 위한 응답 타입 설정
                withCredentials: false,
                headers: {
                    'Accept': '*/*',
                }
            });

            // 파일 다운로드를 위한 링크 생성
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', fileName); // 다운로드될 파일명 설정
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return { handleFileDownload };
};


export default useFileDownload;