import React from 'react';
import './css/SearchBox.css';

const SearchBox = ({
    searchType,
    handleSearchTypeChange,
    handleSearch,
    handleSearchSubmit
}) => {

    const handleInputChange = (e) => {
        // 검색 키워드 변경 시 바로 부모 컴포넌트로 전달
        handleSearch(e.target.value);
    };

    const handleSubmit = () => {
        handleSearchSubmit();
    };

    return (
        <div className="common-board-search-box">
            <select
                value={searchType}
                onChange={handleSearchTypeChange}
            >
                <option value="title">제목</option>
                <option value="author">이름</option>
            </select>
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                // value={localSearchKeyword}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                    }
                }}
            />
            <button onClick={handleSubmit}>입력</button>
        </div>
    );
};

export default React.memo(SearchBox);