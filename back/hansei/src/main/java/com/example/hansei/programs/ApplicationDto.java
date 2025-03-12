package com.example.hansei.programs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor // ✅ 기본 생성자 추가 (JSON 변환 시 필요)
public class ApplicationDto {
    private Long id;             // 신청 ID
    private String posterName;    // 기관명
    private String programName;   // 프로그램명
    private String startDate;     // 교육 시작일
    private String endDate;       // 교육 종료일
    private List<String> userNames; // ✅ 여러 신청자들의 이름을 리스트로 저장
    private String status;        // 신청 상태 (String 타입으로 변환)

    /**
     * ✅ `Application` 엔티티에서 `ApplicationDto`로 변환하는 정적 메서드 추가
     * → 같은 프로그램에 여러 신청자가 있을 경우, 모든 신청자를 포함
     */
    public static ApplicationDto fromApplications(Long programId, List<Application> applications) {
        if (applications == null || applications.isEmpty()) {
            throw new IllegalArgumentException("🚨 변환할 Application 데이터가 없습니다!");
        }

        Program program = applications.get(0).getProgram();

        return new ApplicationDto(
                programId,
                program.getPosterName(),
                program.getName(),
                program.getStartDate(),
                program.getEndDate(),
                applications.stream()
                        .map(app -> app.getUser().getName()) // ✅ 여러 신청자의 이름을 가져옴
                        .toList(),
                applications.get(0).getStatus().name() // ✅ 신청 상태 (모두 동일하므로 첫 번째 신청자의 상태 사용)
        );
    }
}