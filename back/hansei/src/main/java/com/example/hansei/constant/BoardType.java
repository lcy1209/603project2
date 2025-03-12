package com.example.hansei.constant;

public enum BoardType {
	
	NOTICE, ARCHIVE, FQA;
	
	// 소문자로 받아도 대문자로 변경
	public static BoardType fromString(String type) {
        return valueOf(type.toUpperCase());
    }

}
