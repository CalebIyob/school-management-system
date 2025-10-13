package com.example2.demo2.controller; // Controller package

import com.example2.demo2.model.Enrollment; // Enrollment model returned (contains marks)
import com.example2.demo2.service.StudentService; // Service that provides student-specific operations
import org.springframework.web.bind.annotation.*; // Spring MVC annotations

import java.util.List; // For list responses

@RestController // Expose REST endpoints
@RequestMapping("/students") // Base path for student-related endpoints
public class StudentController {

    private final StudentService service; // Dependency on service layer

    public StudentController(StudentService service) { // Constructor-based injection
        this.service = service; // Store reference
    }

    // In a real app you’d enforce "current user == {studentId}" via auth middleware
    // / security config
    @GetMapping("/{studentId}/marks") // Handle GET /students/{studentId}/marks
    public List<Enrollment> myMarks( // Return list of enrollments (with class + mark)
            @PathVariable Long studentId // Extract student id from URL
    ) {
        return service.myMarks(studentId); // Delegate to service method
    }
}
