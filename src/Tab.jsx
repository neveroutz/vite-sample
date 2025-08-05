import { useState } from 'react';

function Tab() {

  const [activeTab, setActiveTab] = useState(0);

  const activeTabChgIdx = (tabIndex) => {
    setActiveTab(tabIndex)
  }

  return (
    <>
      <div className="tab-area">
        <div className="tab-buttons">
          <button type="button" className={activeTab === 0 ? 'active' : ''} onClick={() => activeTabChgIdx(0)}>탭1</button>
          <button type="button" className={activeTab === 1 ? 'active' : ''} onClick={() => activeTabChgIdx(1)}>탭2</button>
          <button type="button" className={activeTab === 2 ? 'active' : ''} onClick={() => activeTabChgIdx(2)}>탭3</button>
        </div>
        <div className="tab-contents-area">
          <div className={`tab-contents ${activeTab === 0 ? 'active' : ''}`}>
            탭 내용1
          </div>
          <div className={`tab-contents ${activeTab === 1 ? 'active' : ''}`}>
            탭 내용2
          </div>
          <div className={`tab-contents ${activeTab === 2 ? 'active' : ''}`}>
            탭 내용3
          </div>
        </div>
      </div>
    </>
  );
}

export default Tab;
