import { useState, useCallback } from 'react';

const useSearch = (initialSearchType = 'title', initialKeyword = '') => {
    const [searchType, setSearchType] = useState(initialSearchType);
    const [searchKeyword, setSearchKeyword] = useState(initialKeyword);

    const handleSearch = useCallback((keyword) => {
        setSearchKeyword(keyword);
    }, []);

    const handleSearchTypeChange = useCallback((e) => {
        setSearchType(e.target.value);
    }, []);

    return {
        searchType,
        searchKeyword,
        handleSearch,
        handleSearchTypeChange
    };
};

export default useSearch;
