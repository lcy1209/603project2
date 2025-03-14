package com.example.hansei.recruitmentapi.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.hansei.recruitmentapi.dto.EventDetailDto;
import com.example.hansei.recruitmentapi.dto.EventDto;
import com.example.hansei.recruitmentapi.repository.EventFavoriteRepository;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {

	private final RestTemplate restTemplate = new RestTemplate();

    // authKey를 application.properties에서 주입 받음
    @Value("${authKey}")
    private String authKey;

    private final XmlToJsonConverter xmlToJsonConverter;
    private final EventFavoriteRepository eventFavoriteRepository;

    public List<EventDto> searchWorkBoard(
            String returnType,
            String callTp,
            String eventType,
            String srchBgnDt,
            String srchEndDt,
            String areaCd,
            String keyword,
            int startPage,
            int display
    ) {
        try {
            if (authKey == null || authKey.isEmpty()) {
                throw new IllegalArgumentException("❌ authKey가 설정되지 않았습니다.");
            }

            String apiUrl = "https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210L11.do";

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("authKey", authKey)
                    .queryParam("returnType", returnType)
                    .queryParam("callTp", callTp)
                    .queryParam("startPage", startPage)
                    .queryParam("display", display);

            if (srchBgnDt != null && !srchBgnDt.isEmpty()) builder.queryParam("srchBgnDt", srchBgnDt);
            if (srchEndDt != null && !srchEndDt.isEmpty()) builder.queryParam("srchEndDt", srchEndDt);
            if (keyword != null && !keyword.isEmpty()) builder.queryParam("keyword", keyword);
            if (areaCd != null && !areaCd.isEmpty()) builder.queryParam("areaCd", areaCd);

            String finalUrl = builder.toUriString();
            System.out.println("🔍 외부 API 호출 URL: " + finalUrl);

            ResponseEntity<String> response = restTemplate.getForEntity(finalUrl, String.class);
            System.out.println("🔍 API 응답 본문: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseExternalApiResponse(response.getBody());
            } else {
                System.err.println("❌ API 응답 실패: HTTP " + response.getStatusCode());
                return Collections.emptyList();
            }
        } catch (Exception e) {
            System.err.println("❌ API 호출 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    private List<EventDto> parseExternalApiResponse(String xmlResponse) {
    	try {
    	    // XML을 JSON으로 변환
    	    JsonNode root = xmlToJsonConverter.convertXmlToJson(xmlResponse);
    	    System.out.println("🔍 변환된 JSON: " + root.toString());
    	    if (root == null) {
    	        System.err.println("❌ XML을 JSON으로 변환하는 데 실패했습니다.");
    	        return Collections.emptyList();
    	    }

    	    // XML에서 필요한 데이터 추출
    	    JsonNode dataArray = root.path("empEvent");
    	    if (!dataArray.isArray() || dataArray.isEmpty()) {
    	        System.err.println("❌ API 응답 데이터가 비어 있습니다.");
    	        return Collections.emptyList();
    	    }
    	    
    	    // 데이터 파싱
    	    List<EventDto> eventList = new ArrayList<>();
    	    for (JsonNode eventNode : dataArray) {
    	        String eventNo = eventNode.path("eventNo").asText();
    	        String title = eventNode.path("eventNm").asText();
                String area = eventNode.path("area").asText();
                String areaCd = eventNode.path("areaCd").asText();
                String eventTerm = eventNode.path("eventTerm").asText();

                LocalDate startDate = null;
                LocalDate endDate = null;

                try {
                    String[] dates = eventTerm.split(" ~ ");
                    if (dates.length == 2) {
                        startDate = LocalDate.parse(dates[0].trim());
                        endDate = LocalDate.parse(dates[1].trim());
                    } else {
                        startDate = LocalDate.parse(eventNode.path("startDt").asText());
                        endDate = startDate;
                    }
                } catch (Exception e) {
                    System.err.println("⚠️ 날짜 변환 오류 발생: " + e.getMessage());
                    startDate = LocalDate.now(); // 기본값 설정
                    endDate = LocalDate.now();
                }

                eventList.add(new EventDto(eventNo, title, area, areaCd, eventTerm, startDate, endDate));
            }

            return eventList;
        } catch (Exception e) {
            System.err.println("🔴 XML 파싱 오류: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
  //상세페이지 외부api 호출
    public EventDetailDto getEventDetail(String eventNo, String areaCd) {
        try {
            System.out.println("🔍 areaCd 값: " + areaCd);

            if (authKey == null || authKey.isEmpty()) {
                throw new IllegalArgumentException("❌ authKey가 설정되지 않았습니다.");
            }

            String apiUrl = "https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210D11.do";

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("authKey", authKey)
                    .queryParam("returnType", "XML")
                    .queryParam("callTp", "D")
                    .queryParam("eventNo", eventNo)
                    .queryParam("areaCd", areaCd);

            String finalUrl = builder.toUriString();
            System.out.println("🔍 외부 API 호출 URL: " + finalUrl);

            ResponseEntity<String> response = restTemplate.getForEntity(finalUrl, String.class);
            System.out.println("🔍 API 응답 본문: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // XML 응답을 JSON으로 변환
                JsonNode jsonNode = xmlToJsonConverter.convertXmlToJson(response.getBody());
                System.out.println("🔍 변환된 JSON: " + jsonNode.toString());

                // EventDetailDto 객체 생성
                return new EventDetailDto(
                    jsonNode.path("eventNm").asText(), // 행사명
                    jsonNode.path("eventNm").asText(), // 행사명
                    jsonNode.path("area").asText(), // 지역 (필요한 경우)
                    jsonNode.path("areaCd").asText(), // 지역 코드 (필요한 경우)
                    jsonNode.path("eventTerm").asText(), // 행사 기간
                    jsonNode.path("eventPlc").asText(), // 행사 장소
                    jsonNode.path("joinCoWantedInfo").asText(), // 참여 기업 정보
                    jsonNode.path("subMatter").asText(), // 추가 사항
                    jsonNode.path("inqTelNo").asText(), // 문의 전화번호
                    jsonNode.path("fax").asText(), // 팩스 번호
                    jsonNode.path("charger").asText(), // 담당자
                    jsonNode.path("email").asText(), // 이메일
                    jsonNode.path("visitPath").asText() // 방문 경로
                );
            } else {
                System.err.println("❌ API 응답 실패: HTTP " + response.getStatusCode());
                return null; // 실패 시 null 반환
            }
        } catch (Exception e) {
            System.err.println("❌ API 호출 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return null; // 오류 발생 시 null 반환
        }
    }
    
    public List<EventDto> getAllEvents() {
        try {
            String apiUrl = "https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210L11.do";
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("authKey", authKey)
                    .queryParam("returnType", "XML")
                    .queryParam("callTp", "L")
                    .queryParam("startPage", 1)
                    .queryParam("display", 100);  // 최대 100개 조회

            String finalUrl = builder.toUriString();
            ResponseEntity<String> response = restTemplate.getForEntity(finalUrl, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseExternalApiResponse(response.getBody());
            } else {
                System.err.println("❌ API 응답 실패: HTTP " + response.getStatusCode());
                return Collections.emptyList();
            }
        } catch (Exception e) {
            System.err.println("❌ API 호출 중 오류 발생: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // ✅ 즐겨찾기한 이벤트 목록 조회
    public List<EventDto> getFavoriteEvents(Long userId) {
        List<String> favoriteEventNos = eventFavoriteRepository.findByUser_UserIdAndIsDeletedFalse(userId)
                .stream()
                .map(event -> event.getEventNo())
                .collect(Collectors.toList());

        // 전체 이벤트 목록 가져오기
        List<EventDto> allEvents = getAllEvents();

        // 즐겨찾기한 이벤트만 필터링
        return allEvents.stream()
                .filter(event -> favoriteEventNos.contains(event.getEventNo()))
                .collect(Collectors.toList());
    }
}