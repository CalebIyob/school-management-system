package com.example2.demo2.controller; // Package for web controllers

import com.example2.demo2.dto.*; // Import request DTO classes used as payloads
import com.example2.demo2.model.*; // Import entity models returned to clients
import com.example2.demo2.service.AdminService; // Business/service layer used by this controller
import org.springframework.web.bind.annotation.*; // Spring Web MVC annotations

import java.util.List; // Java collection type for list responses

@RestController // Marks this class as a REST controller (JSON by default)
@RequestMapping("/admin") // Base path prefix for all endpoints in this controller
public class AdminController {

    private final AdminService service; // Dependency on the admin service layer

    public AdminController(AdminService service) { // Constructor injection of the service
        this.service = service; // Keep a reference for use in handler methods
    }

    // ---- Classes ----

    @PostMapping("/classes") // Handle POST /admin/classes
    public Classroom createClass( // Return the created Classroom entity as JSON
            @RequestBody CreateClassroomReq req // Parse request body into CreateClassroomReq DTO
    ) {
        return service.createClass(req); // Delegate creation to service and return result
    }

    @GetMapping("/classes") // Handle GET /admin/classes
    public List<Classroom> listClasses() { // Return list of all classes
        return service.listClasses(); // Delegate to service
    }

    @PutMapping("/classes/{id}") // Handle PUT /admin/classes/{id}
    public Classroom updateClass( // Return the updated Classroom
            @PathVariable Long id, // Extract {id} from the URL path
            @RequestBody CreateClassroomReq req // Parse request body with new values (name)
    ) {
        return service.updateClass(id, req); // Delegate update to service and return
    }

    @DeleteMapping("/classes/{id}") // Handle DELETE /admin/classes/{id}
    public void deleteClass(@PathVariable Long id) { // No content on success
        service.deleteClass(id); // Delegate deletion to service
    }

    // ---- Teachers ----

    @PostMapping("/teachers") // Handle POST /admin/teachers
    public Teacher createTeacher( // Return created Teacher
            @RequestBody CreateTeacherReq req // Parse teacher creation payload
    ) {
        return service.createTeacher(req); // Delegate to service
    }

    @GetMapping("/teachers") // Handle GET /admin/teachers
    public List<Teacher> listTeachers() { // Return list of teachers (with classroom eagerly loaded)
        return service.listTeachers(); // Delegate to service
    }

    @PutMapping("/teachers/{id}") // Handle PUT /admin/teachers/{id}
    public Teacher updateTeacher( // Return updated Teacher
            @PathVariable Long id, // Extract teacher id from URL
            @RequestBody UpdateTeacherReq req // Parse update payload (name/email/classId)
    ) {
        return service.updateTeacher(id, req); // Delegate to service
    }

    @DeleteMapping("/teachers/{id}") // Handle DELETE /admin/teachers/{id}
    public void deleteTeacher(@PathVariable Long id) { // No content on success
        service.deleteTeacher(id); // Delegate to service
    }

    // ---- Students ----

    @PostMapping("/students") // Handle POST /admin/students
    public Student createStudent( // Return created Student
            @RequestBody CreateStudentReq req // Parse student creation payload
    ) {
        return service.createStudent(req); // Delegate to service
    }

    @GetMapping("/students") // Handle GET /admin/students
    public List<Student> listStudents() { // Return list of students
        return service.listStudents(); // Delegate to service
    }

    @PutMapping("/students/{id}") // Handle PUT /admin/students/{id}
    public Student updateStudent( // Return updated Student
            @PathVariable Long id, // Extract student id
            @RequestBody UpdateStudentReq req // Parse update payload (name/email)
    ) {
        return service.updateStudent(id, req); // Delegate to service
    }

    @DeleteMapping("/students/{id}") // Handle DELETE /admin/students/{id}
    public void deleteStudent(@PathVariable Long id) { // No content on success
        service.deleteStudent(id); // Delegate to service
    }

    // ---- Enrollment ----

    @PostMapping("/enrollments") // Handle POST /admin/enrollments
    public Enrollment enroll( // Return created Enrollment (student↔class link)
            @RequestBody EnrollStudentReq req // Parse payload containing studentId & classId
    ) {
        return service.enrollStudent(req); // Delegate to service
    }

    @DeleteMapping("/enrollments/{classId}/{studentId}") // Handle DELETE /admin/enrollments/{classId}/{studentId}
    public void unenroll( // No content on success
            @PathVariable Long classId, // Extract class id from path
            @PathVariable Long studentId // Extract student id from path
    ) {
        service.unenrollStudent(studentId, classId); // Delegate to service (note: service signature is (studentId,
                                                     // classId))
    }
}
