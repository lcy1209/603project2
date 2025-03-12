function WorkboardPagination ({ currentPage, totalPages, onPageChange }) {
    
    /* 페이징 */
    return (
        <ul className="workboard-pagination">
            <li className="workboard-page-item">
                <button onClick={() => onPageChange(1)} className="workboard-page-link">
                    {'<<'}
                </button>
            </li>
            <li className="workboard-page-item">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    className="workboard-page-link">
                    {'<'}
                </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
                <li key={i} className="workboard-page-item">
                    <button
                        onClick={() => onPageChange(i + 1)}
                        className="workboard-page-link">
                        {i + 1}
                    </button>
                </li>
            ))}
            <li className="workboard-page-item">
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    className="workboard-page-link">
                    {'>'}
                </button>
            </li>
            <li className="workboard-page-item">
                <button onClick={() => onPageChange(totalPages)} className="workboard-page-link">
                    {'>>'}
                </button>
            </li>
        </ul>
    );
};

export default WorkboardPagination;
