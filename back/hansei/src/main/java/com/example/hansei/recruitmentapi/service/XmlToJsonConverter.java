package com.example.hansei.recruitmentapi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.stereotype.Component;

@Component
public class XmlToJsonConverter {

    private final XmlMapper xmlMapper;

    public XmlToJsonConverter() {
        this.xmlMapper = new XmlMapper(); // XML 처리할 XmlMapper 초기화
    }

    public JsonNode convertXmlToJson(String xmlData) {
        try {
            // XML 데이터를 JSON으로 변환하여 반환
            return xmlMapper.readTree(xmlData);
        } catch (Exception e) {
            System.err.println("🔴 XML 파싱 오류: " + e.getMessage());
            return null;
        }
    }
}
