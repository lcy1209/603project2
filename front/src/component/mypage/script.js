import React, { useState } from 'react';

const script = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [favorites, setFavorites] = useState([]);
  const [tabData, setTabData] = useState({
    tab1: ["회사 A", "회사 B", "회사 C"],
    tab2: ["회사 D", "회사 E", "회사 F"],
    tab3: []
  });

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const toggleFavorite = (company) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(company)
        ? prevFavorites.filter((item) => item !== company)
        : [...prevFavorites, company]
    );
  };

  const handleDeleteRow = (index, tabId) => {
    setTabData((prevData) => ({
      ...prevData,
      [tabId]: prevData[tabId].filter((_, i) => i !== index)
    }));
  };

  const renderTabContent = (tabId) => {
    if (tabId === 'tab3') {
      return (
        <div>
          <h2>교외 채용</h2>
          <div className="favorite-container">
            {favorites.length > 0 ? (
              <ul>
                {favorites.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>교외 채용 정보가 여기에 표시됩니다.</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2>{tabId === 'tab1' ? '교내 채용' : '추천 채용'}</h2>
        <table className="recruitment-table">
          <thead>
            <tr>
              <th>회사명</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {tabData[tabId].map((company, index) => (
              <tr key={index}>
                <td>{company}</td>
                <td>
                  <button
                    className={`star ${favorites.includes(company) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(company)}
                  >
                    ★
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteRow(index, tabId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'tab1' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab1')}
        >
          교내 채용
        </button>
        <button
          className={`tab ${activeTab === 'tab2' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab2')}
        >
          추천 채용
        </button>
        <button
          className={`tab ${activeTab === 'tab3' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab3')}
        >
          교외 채용
        </button>
      </div>

      <div className="tab-content">{renderTabContent(activeTab)}</div>
    </div>
  );
};

export default script;
