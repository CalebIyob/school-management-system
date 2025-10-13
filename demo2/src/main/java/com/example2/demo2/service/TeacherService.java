package com.example2.demo2.service; // Package for service-layer classes

import com.example2.demo2.dto.MarkUpdateReq; // DTO containing new mark value
import com.example2.demo2.model.*; // Teacher, Student, Enrollment entities
import com.example2.demo2.repo.*; // Repositories for entities
import com.example2.demo2.error.ForbiddenException; // Custom runtime exception for authorization checks
import org.springframework.stereotype.Service; // Spring service annotation
import org.springframework.transaction.annotation.Transactional; // Transaction boundaries

import java.util.List; // Java List

@Service // Register class as a Spring service
@Transactional // Default transactional behavior for public methods
public class TeacherService { // Service for teacher-facing operations

    private final TeacherRepository teacherRepo; // Access teachers
    private final StudentRepository studentRepo; // Access students
    private final EnrollmentRepository enrollRepo; // Access enrollments

    // Constructor injection of dependencies
    public TeacherService(TeacherRepository teacherRepo,
            StudentRepository studentRepo,
            EnrollmentRepository enrollRepo) {
        this.teacherRepo = teacherRepo; // Assign teacher repo
        this.studentRepo = studentRepo; // Assign student repo
        this.enrollRepo = enrollRepo; // Assign enrollment repo
    }

    public List<Student> studentsOfTeacher(Long teacherId) { // Students in the teacher's class
        return studentRepo.findStudentsByTeacherId(teacherId); // Custom query joining classroom
    }

    public Enrollment setMark(Long teacherId, Long classId, Long studentId, MarkUpdateReq req) { // Upsert mark
        Teacher t = teacherRepo.findById(teacherId).orElseThrow(); // Ensure teacher exists
        if (!t.getClassroom().getId().equals(classId)) { // Verify teacher owns the class
            throw new ForbiddenException("Teacher does not own this class"); // Reject if mismatch
        }
        Enrollment e = enrollRepo // Locate the enrollment row
                .findOneByClassIdAndStudentId(classId, studentId)
                .orElseThrow(); // 404 if no enrollment exists
        e.setMark(req.mark()); // Apply new mark value
        return enrollRepo.save(e); // Persist and return updated enrollment
    }
}
