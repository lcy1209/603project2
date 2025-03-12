import React from 'react';

const FormUser = ({ userInfo, updateUser, deleteUser }) => {
  // 사용자 정보 수정
  const onUpdate = (e) => {
    e.preventDefault();

    const form = e.target;
    const userId = form.username.value; // 읽기 전용
    const password = form.password.value || null; // 비밀번호는 선택 사항
    const name = form.name.value;
    const email = form.email.value;

    // 비밀번호가 입력되지 않은 경우 제외
    const updatedData = { userId, name, email };
    if (password) updatedData.password = password;

    updateUser(updatedData);
  };

  return (
    <div className="form">
      <h2 className="login-title">User Info</h2>

      <form className="login-form" onSubmit={onUpdate}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="username"
            defaultValue={userInfo?.userId || ''}
            readOnly
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="New Password"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="name"
            defaultValue={userInfo?.name || ''}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            defaultValue={userInfo?.email || ''}
            required
          />
        </div>

        <div className="button-group">
          <button className="btn btn--form btn-update" type="submit">
            정보 수정
          </button>
          <button
            className="btn btn--form btn-delete"
            type="button"
            onClick={() => {
              if (window.confirm('정말로 회원 탈퇴하시겠습니까?')) {
                deleteUser(userInfo?.userId);
              }
            }}
          >
            회원 탈퇴
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormUser;
