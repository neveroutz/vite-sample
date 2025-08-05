function GoogleSheetsUsers({ users = [], totalUsers = 0 }) {
  return (
    <div className="google-sheets-users">
      <div className="users-header">
        <h2>👥 Google Sheets DB</h2>
        <p className="users-count">총 {totalUsers}명의 사용자</p>
      </div>

      {/* 사용자 목록 */}
      {users.length === 0 ? (
        <div className="no-users">
          <p>조건에 맞는 사용자가 없습니다.</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-id">#{user.id}</div>
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-location">📍 {user.location}</p>
                <p className="user-phone">📞 {user.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 데이터 소스 표시 */}
      <div className="data-source">
        <small>📊 데이터 출처: Google Sheets API</small>
      </div>
    </div>
  );
}

export default GoogleSheetsUsers;
