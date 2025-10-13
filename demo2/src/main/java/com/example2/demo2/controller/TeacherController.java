package com.example2.demo2.controller; // Controller package

import com.example2.demo2.dto.MarkUpdateReq; // DTO carrying the new/updated mark value
import com.example2.demo2.model.Enrollment; // Return Enrollment after update
import com.example2.demo2.model.Student; // Return list of Student for teacher
import com.example2.demo2.service.TeacherService; // Business logic layer for teacher actions
import org.springframework.web.bind.annotation.*; // Spring MVC annotations

import java.util.List; // For list responses

@RestController // Marks as REST controller
@RequestMapping("/teachers") // Base URL for teacher endpoints
public class TeacherController {

    private final TeacherService service; // Dependency on teacher service

    public TeacherController(TeacherService service) { // Constructor injection
        this.service = service; // Keep service reference
    }

    @GetMapping("/{teacherId}/students") // Handle GET /teachers/{teacherId}/students
    public List<Student> studentsOfTeacher( // Return students taught by this teacher
            @PathVariable Long teacherId // Extract teacher id from path
    ) {
        return service.studentsOfTeacher(teacherId); // Delegate query to service
    }

    @PutMapping("/{teacherId}/classes/{classId}/students/{studentId}/mark") // PUT to set/update a student's mark
    public Enrollment setMark( // Return the updated Enrollment
            @PathVariable Long teacherId, // Teacher performing the action
            @PathVariable Long classId, // Class to which the mark belongs
            @PathVariable Long studentId, // Student whose mark is being set
            @RequestBody MarkUpdateReq req // Payload with the new mark value
    ) {
        return service.setMark(teacherId, classId, studentId, req); // Delegate to service (validates ownership)
    }
}
