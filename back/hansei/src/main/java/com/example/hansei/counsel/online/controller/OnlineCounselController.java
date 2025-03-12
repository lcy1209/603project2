package com.example.hansei.counsel.online.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.counsel.online.dto.OnlineCounselDto;
import com.example.hansei.counsel.online.service.OnlineCounselService;

@RestController
@RequestMapping("/api/counsel")
public class OnlineCounselController {
	@Autowired
    private OnlineCounselService counselService;

	@GetMapping
    public ResponseEntity<Page<OnlineCounselDto>> getCounsels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sort,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword) {
        
        return ResponseEntity.ok(
            counselService.getCounsels(page, size, sort, searchType, keyword)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OnlineCounselDto> getCounsel(@PathVariable Long id) {
        return ResponseEntity.ok(counselService.getCounsel(id));
    }

    @PostMapping
    public ResponseEntity<OnlineCounselDto> createCounsel(@RequestBody OnlineCounselDto counselDto) {
        return ResponseEntity.ok(counselService.createCounsel(counselDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OnlineCounselDto> updateCounsel(@PathVariable Long id, @RequestBody OnlineCounselDto counselDto) {
        return ResponseEntity.ok(counselService.updateCounsel(id, counselDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCounsel(@PathVariable Long id) {
        counselService.deleteCounsel(id);
        return ResponseEntity.ok().build();
    }
    
    /*-----------------------------------------답 변-----------------------------------------*/

    @PostMapping("/{id}/answer")
    public ResponseEntity<OnlineCounselDto> addAnswer(
            @PathVariable Long id,
            @RequestBody Map<String, String> answerMap) {
        String answer = answerMap.get("answer");
        String answerer = answerMap.get("answerer");
        return ResponseEntity.ok(counselService.addAnswer(id, answer, answerer));
    }
    
    @DeleteMapping("/{id}/answer")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long id) {
        counselService.deleteAnswer(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/answer")
    public ResponseEntity<Map<String, String>> getAnswer(@PathVariable Long id) {
        return ResponseEntity.ok(counselService.getAnswer(id));
    }

    @PutMapping("/{id}/answer")
    public ResponseEntity<OnlineCounselDto> updateAnswer(
            @PathVariable Long id,
            @RequestBody Map<String, String> answerMap) {
        String answer = answerMap.get("answer");
        String answerer = answerMap.get("answerer");
        return ResponseEntity.ok(counselService.updateAnswer(id, answer, answerer));
    }
}
