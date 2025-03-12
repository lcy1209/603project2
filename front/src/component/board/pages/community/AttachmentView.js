import useFileDownload from "../../hooks/useFileDownload";

const AttachmentView = ({ fileList }) => {

    const { handleFileDownload } = useFileDownload();

    return (
        <tr>
            <th>첨부파일</th>
            <td>
                {fileList?.map(file => (
                    <div key={file.id}>
                        <span 
                            onClick={(e) => {
                                e.preventDefault();
                                handleFileDownload(file.url, file.name);
                            }}
                        >
                            {file.name}
                        </span>
                    </div>
                ))}
            </td>
        </tr>
    );

};

export default AttachmentView;
