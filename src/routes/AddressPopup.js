
import React, { useState } from "react";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import axios from "axios";
import "./AddressPopup.css"; // 팝업 스타일 따로

const AddressPopup = ({ onClose, onSaved }) => {
    const open = useDaumPostcodePopup();
    const [zonecode, setZonecode] = useState("");
    const [roadAddress, setRoadAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        if (data.addressType === 'R') {
            if (data.bname) extraAddress += data.bname;
            if (data.buildingName) {
                extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress ? ` (${extraAddress})` : '';
        }
        setZonecode(data.zonecode);
        setRoadAddress(fullAddress);
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    const handleSave = async () => {
        if (!roadAddress || !detailAddress) {
            alert("주소를 모두 입력해주세요.");
            return;
        }

        try {
            await axios.post("/address", {
                address: roadAddress,
                addressDetail: detailAddress
            }, { withCredentials: true });

            alert("주소가 저장되었습니다!");
            onSaved(); // 저장 후 콜백
            onClose();
        } catch (err) {
            console.error("주소 저장 실패:", err);
            alert("주소 저장 실패");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>주소 등록</h2>
                <div className="input-group">
                    <label>우편번호</label>
                    <div className="input-container">
                        <input value={zonecode} readOnly />
                        <button onClick={handleClick}>우편번호 찾기</button>
                    </div>
                </div>
                <div className="input-group">
                    <label>도로명 주소</label>
                    <input value={roadAddress} readOnly />
                </div>
                <div className="input-group">
                    <label>상세 주소</label>
                    <input value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
                </div>
                <div className="popup-buttons">
                    <button onClick={handleSave}>저장</button>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default AddressPopup;
