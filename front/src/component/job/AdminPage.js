import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import "./styles/AdminPage.css";

function AdminPage() {
  const [newProgram, setNewProgram] = useState({
    name: "",
    startDate: "",
    endDate: "",
    maxParticipants: "",
    category: "전체", 
    target: "",
    gradeGender: "",
    department: "",
    posterName: "",
    posterEmail: "",
    posterPhone: "",
    posterLocation: "",
    description: "",
    schedules: [
      { scheduleName: "", date: "", maxApplicants: "", status: "" },
    ],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [client, setClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8090/ws",
      onConnect: () => {
        console.log("WebSocket 연결 성공");
      },
      onStompError: (frame) => {
        console.error("WebSocket STOMP 오류:", frame.headers["message"]);
      },
      onDisconnect: () => {
        console.log("WebSocket 연결 종료");
      },
    });
    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview("");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...newProgram.schedules];
    updatedSchedules[index][field] = value;
    setNewProgram((prev) => ({ ...prev, schedules: updatedSchedules }));
  };

  const addSchedule = () => {
    setNewProgram((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        { scheduleName: "", date: "", maxApplicants: "", status: "" },
      ],
    }));
  };

  const removeSchedule = (index) => {
    const updatedSchedules = newProgram.schedules.filter((_, i) => i !== index);
    setNewProgram((prev) => ({ ...prev, schedules: updatedSchedules }));
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "startDate",
      "endDate",
      "maxParticipants",
      "category",
      "posterName",
      "posterEmail",
      "posterPhone",
      "posterLocation",
      "description",
    ];

    for (let field of requiredFields) {
      if (!newProgram[field]) {
        alert(`"${field}" 항목은 필수입니다.`);
        return false;
      }
    }

    for (let schedule of newProgram.schedules) {
      if (!schedule.scheduleName || !schedule.date || !schedule.maxApplicants || !schedule.status) {
        alert("모든 일정 필드를 입력해야 합니다.");
        return false;
      }
    }

    return true;
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", newProgram.name);
    formData.append("startDate", newProgram.startDate);
    formData.append("endDate", newProgram.endDate);
    formData.append("maxParticipants", newProgram.maxParticipants);
    formData.append("category", newProgram.category);
    formData.append("target", newProgram.target);
    formData.append("gradeGender", newProgram.gradeGender);
    formData.append("department", newProgram.department);
    formData.append("posterName", newProgram.posterName);
    formData.append("posterEmail", newProgram.posterEmail);
    formData.append("posterPhone", newProgram.posterPhone);
    formData.append("posterLocation", newProgram.posterLocation);
    formData.append("description", newProgram.description);

    const schedulesJson = JSON.stringify(newProgram.schedules);
    formData.append("schedules", schedulesJson);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:8090/api/programs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const savedProgram = await response.json();

        if (client) {
          client.publish({
            destination: "/topic/programs",
            body: JSON.stringify(savedProgram),
          });
          console.log("WebSocket 메시지 전송:", savedProgram);
        }

        alert("프로그램이 성공적으로 추가되었습니다.");
        setNewProgram({
          name: "",
          startDate: "",
          endDate: "",
          maxParticipants: "",
          category: "전체",
          target: "",
          gradeGender: "",
          department: "",
          posterName: "",
          posterEmail: "",
          posterPhone: "",
          posterLocation: "",
          description: "",
          schedules: [
            { scheduleName: "", date: "", maxApplicants: "", status: "" },
          ],
        });
        setImageFile(null);
        setImagePreview("");
        navigate("/programs");
      } else {
        alert("프로그램 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding program:", error);
    }
  };

  return (
    <div className="admin-page-container">
      <h2 className="admin-page-title text-center mb-4"></h2>

      <form onSubmit={handleAddProgram} className="admin-page-form-container">
        <div className="admin-page-form-group mb-4">
          <label>프로그램 이름</label>
          <input
            type="text"
            name="name"
            className="admin-page-form-control"
            value={newProgram.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-page-form-group mb-4">
          <label>카테고리 선택</label>
          <select
            name="category"
            className="admin-page-form-control"
            value={newProgram.category}
            onChange={handleInputChange}
            required
          >
            <option value="취업">취업</option>
            <option value="창업">창업</option>
            <option value="진로">진로</option>
          </select>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label>시작 날짜</label>
            <input
              type="date"
              name="startDate"
              className="admin-page-form-control"
              value={newProgram.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>종료 날짜</label>
            <input
              type="date"
              name="endDate"
              className="admin-page-form-control"
              value={newProgram.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="admin-page-form-group mb-4">
          <label>최대 신청자</label>
          <input
            type="number"
            name="maxParticipants"
            className="admin-page-form-control"
            value={newProgram.maxParticipants}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="row mb-4">
          <div className="col-md-6">
            <label>모집 대상</label>
            <input
              type="text"
              name="target"
              className="admin-page-form-control"
              value={newProgram.target}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>학년/성별</label>
            <input
              type="text"
              name="gradeGender"
              className="admin-page-form-control"
              value={newProgram.gradeGender}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="admin-page-form-group mb-4">
          <label>학과</label>
          <input
            type="text"
            name="department"
            className="admin-page-form-control"
            value={newProgram.department}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="row mb-4">
          <div className="col-md-6">
            <label>게시자 이름</label>
            <input
              type="text"
              name="posterName"
              className="admin-page-form-control"
              value={newProgram.posterName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>게시자 이메일</label>
            <input
              type="email"
              name="posterEmail"
              className="admin-page-form-control"
              value={newProgram.posterEmail}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-6">
            <label>게시자 전화번호</label>
            <input
              type="tel"
              name="posterPhone"
              className="admin-page-form-control"
              value={newProgram.posterPhone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>게시자 위치</label>
            <input
              type="text"
              name="posterLocation"
              className="admin-page-form-control"
              value={newProgram.posterLocation}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="admin-page-form-group mb-4">
          <label>프로그램 설명</label>
          <textarea
            name="description"
            className="admin-page-form-control"
            rows="3"
            value={newProgram.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-page-form-group mb-4">
          <label>이미지 업로드</label>
          <input
            type="file"
            accept="image/*"
            className="admin-page-form-control"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <div className="admin-page-image-preview">
              <img
                src={imagePreview}
                alt="미리보기"
                className="admin-page-image mt-3"
              />
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={removeImage}
              >
                이미지 삭제
              </button>
            </div>
          )}
        </div>
        <div className="admin-page-schedule-section">
          <h3 className="mb-3">프로그램 일정</h3>
          {newProgram.schedules.map((schedule, index) => (
            <div key={index} className="admin-page-schedule-item mb-4">
              <label>일정 이름</label>
              <input
                type="text"
                className="admin-page-form-control mb-2"
                value={schedule.scheduleName}
                onChange={(e) =>
                  handleScheduleChange(index, "scheduleName", e.target.value)
                }
                required
              />
              <label>날짜</label>
              <input
                type="date"
                className="admin-page-form-control mb-2"
                value={schedule.date}
                onChange={(e) =>
                  handleScheduleChange(index, "date", e.target.value)
                }
                required
              />
              <label>최대 모집 인원</label>
              <input
                type="number"
                className="admin-page-form-control mb-2"
                value={schedule.maxApplicants}
                onChange={(e) =>
                  handleScheduleChange(index, "maxApplicants", e.target.value)
                }
                required
              />
              <label>접수 상태</label>
              <input
                type="text"
                className="admin-page-form-control mb-2"
                value={schedule.status}
                onChange={(e) =>
                  handleScheduleChange(index, "status", e.target.value)
                }
                required
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeSchedule(index)}
              >
                일정 삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addSchedule}
          >
            일정 추가
          </button>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-4">
          프로그램 추가
        </button>
      </form>
    </div>
  );
}

export default AdminPage;