package com.example.hansei.recruitmentapi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.recruitmentapi.dto.EventDetailDto;
import com.example.hansei.recruitmentapi.dto.EventDto;
import com.example.hansei.recruitmentapi.service.EventService;

@RestController
@RequestMapping("/api/work/board")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDto>> searchWorkBoard(
            @RequestParam String returnType,
            @RequestParam String callTp,
            @RequestParam(defaultValue = "1") int startPage,
            @RequestParam(defaultValue = "10") int display,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String srchBgnDt,
            @RequestParam(required = false) String srchEndDt,
            @RequestParam(required = false) String areaCd,
            @RequestParam(required = false) String keyword) {

        List<EventDto> results = eventService.searchWorkBoard(
                returnType, callTp, eventType, srchBgnDt, srchEndDt, areaCd, keyword, startPage, display
        );

        return ResponseEntity.ok(results);
    }    
    
    @GetMapping("/detail")
    public ResponseEntity<EventDetailDto> getEventDetail(@RequestParam String eventNo, String areaCd) {
    	if (areaCd == null) {
            System.err.println("❌ areaCd가 null입니다.");
        } else {
            System.out.printf("areaCd:", areaCd);
        }

    	
        EventDetailDto xmlResponse = eventService.getEventDetail(eventNo, areaCd);
        return ResponseEntity.ok(xmlResponse);
    }

    
    
}
