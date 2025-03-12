import { useState } from "react";

const useFileUpload = () => {
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]); // 기존 파일 목록
    const [filesToDelete, setFilesToDelete] = useState([]); // 삭제할 파일 ID 목록

    // 기존 파일 목록 설정
    const setInitialFiles = (files) => {
        setExistingFiles(files || []);
    };

    // 파일 선택 처리
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(files);
        setFileNames(files.map(file => file.name));
    };

    // 선택된 파일 삭제 처리
    const handleRemoveFile = (index) => {
        const newAttachments = [...attachments];
        const newFileNames = [...fileNames];

        newAttachments.splice(index, 1);
        newFileNames.splice(index, 1);

        setAttachments(newAttachments);
        setFileNames(newFileNames);
    };

    // 기존 파일 삭제 처리
    const handleRemoveExistingFile = async (fileId) => {
        setFilesToDelete([...filesToDelete, fileId]);
        setExistingFiles(existingFiles.filter(file => file.id !== fileId));
    };

    // FormData에 파일 추가
    const appendFilesToFormData = (formData) => {
        // 새로운 파일 추가
        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }
        
        // 빈 배열일 때는 아예 보내지 않기
        if (filesToDelete && filesToDelete.length > 0) {
            filesToDelete.forEach((fileId) => {
                formData.append('filesToDelete', fileId); // 배열의 각 요소를 개별적으로 추가
            });
        }
    };

    return {
        attachments,
        fileNames,
        existingFiles,
        handleFileSelect,
        handleRemoveFile,
        handleRemoveExistingFile,
        setInitialFiles,
        appendFilesToFormData
    };
};

export default useFileUpload;