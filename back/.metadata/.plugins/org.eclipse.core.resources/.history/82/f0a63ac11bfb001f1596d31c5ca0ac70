package com.example.hansei.programs;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ProgramWebSocketController {
    @MessageMapping("/addProgram")
    @SendTo("/topic/programs")
    public Program sendProgramUpdate(Program program) {
        return program;
    }
}
