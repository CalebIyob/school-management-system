package com.example2.demo2.service; // Package containing service-layer classes

// Import DTOs used as request payloads for create/update operations
import com.example2.demo2.dto.*;
import com.example2.demo2.model.*; // Import JPA entity classes
import com.example2.demo2.repo.*; // Import Spring Data repositories
import org.springframework.security.crypto.password.PasswordEncoder; // For hashing passwords
import org.springframework.stereotype.Service; // Marks class as a Spring service bean
import org.springframework.transaction.annotation.Transactional; // Transaction boundary & settings

import java.util.List; // Java List interface

@Service // Register this class as a Spring-managed service component
@Transactional // Make all public methods transactional by default (read/write)
public class AdminService { // Service exposing admin capabilities (classes, users, enrollments)

    private final ClassroomRepository classRepo; // Repository for Classroom entities
    private final TeacherRepository teacherRepo; // Repository for Teacher entities
    private final StudentRepository studentRepo; // Repository for Student entities
    private final EnrollmentRepository enrollRepo; // Repository for Enrollment entities
    private final PasswordEncoder encoder; // Encoder used to hash passwords

    // Constructor injection of all dependencies (recommended for
    // immutability/testability)
    public AdminService(ClassroomRepository classRepo,
            TeacherRepository teacherRepo,
            StudentRepository studentRepo,
            EnrollmentRepository enrollRepo,
            PasswordEncoder encoder) {
        this.classRepo = classRepo; // Assign classroom repo
        this.teacherRepo = teacherRepo; // Assign teacher repo
        this.studentRepo = studentRepo; // Assign student repo
        this.enrollRepo = enrollRepo; // Assign enrollment repo
        this.encoder = encoder; // Assign password encoder
    }

    // ---- Classrooms ----
    public Classroom createClass(CreateClassroomReq req) { // Create a new class from request DTO
        Classroom c = new Classroom(); // Instantiate entity
        c.setName(req.name()); // Copy name from request
        return classRepo.save(c); // Persist and return saved entity
    }

    public List<Classroom> listClasses() { // Return all classes
        return classRepo.findAll(); // Delegate to repository
    }

    public Classroom updateClass(Long id, CreateClassroomReq req) { // Update an existing class name
        Classroom c = classRepo.findById(id).orElseThrow(); // Load or 404 if missing
        c.setName(req.name()); // Apply new name
        return classRepo.save(c); // Save updates
    }

    public void deleteClass(Long id) { // Delete a class by id
        classRepo.deleteById(id); // Remove entity
    }

    // ---- Teachers ----
    public Teacher createTeacher(CreateTeacherReq req) { // Create a teacher assigned to a class
        Classroom c = classRepo.findById(req.classId()).orElseThrow(); // Ensure target class exists
        Teacher t = new Teacher(); // New teacher entity
        t.setName(req.name()); // Copy name
        t.setEmail(req.email()); // Copy email
        t.setRole("TEACHER"); // Fixed role for teachers
        t.setPassword(encoder.encode(req.password())); // Hash and set password
        t.setClassroom(c); // Link teacher → classroom
        return teacherRepo.save(t); // Persist and return
    }

    public List<Teacher> listTeachers() { // List all teachers (with classroom eagerly fetched)
        return teacherRepo.findAllWithClassroom(); // Custom repo method that joins classroom
    }

    public Teacher updateTeacher(Long id, UpdateTeacherReq req) { // Update name/email/class
        Teacher t = teacherRepo.findById(id).orElseThrow(); // Load or fail
        t.setName(req.name()); // Update name
        t.setEmail(req.email()); // Update email
        if (req.classId() != null) { // If class change requested
            Classroom c = classRepo.findById(req.classId()).orElseThrow(); // Validate class
            t.setClassroom(c); // Re-assign class
        }
        return teacherRepo.save(t); // Persist changes
    }

    public void deleteTeacher(Long id) { // Remove a teacher by id
        teacherRepo.deleteById(id); // Delegate to repository
    }

    // ---- Students ----
    public Student createStudent(CreateStudentReq req) { // Create a new student
        Student s = new Student(); // New student entity
        s.setName(req.name()); // Copy name
        s.setEmail(req.email()); // Copy email
        s.setRole("STUDENT"); // Fixed role for students
        s.setPassword(encoder.encode(req.password())); // Hash and set password
        return studentRepo.save(s); // Persist and return
    }

    public List<Student> listStudents() { // List all students
        return studentRepo.findAll(); // Delegate to repository
    }

    public Student updateStudent(Long id, UpdateStudentReq req) { // Update student name/email
        Student s = studentRepo.findById(id).orElseThrow(); // Load or fail
        s.setName(req.name()); // Update name
        s.setEmail(req.email()); // Update email
        return studentRepo.save(s); // Persist changes
    }

    public void deleteStudent(Long id) { // Delete a student
        studentRepo.deleteById(id); // Delegate to repository
    }

    // ---- Enrollments ----
    public Enrollment enrollStudent(EnrollStudentReq req) { // Enroll student into class
        Student s = studentRepo.findById(req.studentId()).orElseThrow(); // Validate student
        Classroom c = classRepo.findById(req.classId()).orElseThrow(); // Validate class
        Enrollment e = new Enrollment(); // Create enrollment entity
        e.setStudent(s); // Link student
        e.setClassroom(c); // Link classroom
        return enrollRepo.save(e); // Persist and return
    }

    public void unenrollStudent(Long studentId, Long classId) { // Remove an enrollment
        Enrollment.Id id = new Enrollment.Id(); // Create composite id holder
        id.setStudentId(studentId); // Set student key part
        id.setClassId(classId); // Set class key part
        enrollRepo.deleteById(id); // Delete by composite key
    }
}
