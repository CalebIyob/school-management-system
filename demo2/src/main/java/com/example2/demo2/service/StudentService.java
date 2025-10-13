package com.example2.demo2.service; // Package for service-layer classes

import com.example2.demo2.model.Enrollment; // Enrollment entity
import com.example2.demo2.repo.EnrollmentRepository; // Repository for enrollment queries
import org.springframework.stereotype.Service; // Marks as Spring service
import org.springframework.transaction.annotation.Transactional; // For transaction config

import java.util.List; // Java List

@Service // Register as a Spring service bean
@Transactional(readOnly = true) // All methods run in read-only transactions by default
public class StudentService { // Service focused on student-facing operations

    private final EnrollmentRepository enrollRepo; // Dependency to access enrollments

    public StudentService(EnrollmentRepository enrollRepo) { // Constructor injection
        this.enrollRepo = enrollRepo; // Assign repository
    }

    public List<Enrollment> myMarks(Long studentId) { // Return all enrollments/marks for student
        return enrollRepo.findByStudentId(studentId); // Query by student id
    }
}
