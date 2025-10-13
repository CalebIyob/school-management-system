package com.example2.demo2.repo; // Package for repository interfaces

import com.example2.demo2.model.Student; // Student JPA entity
import org.springframework.data.jpa.repository.JpaRepository; // Base CRUD repository
import org.springframework.data.jpa.repository.Query; // Annotation for JPQL
import java.util.List; // Collections
import java.util.Optional; // Optional result container

// Repository for Student entities (primary key Long).
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Derived query to find a student by unique email.
    Optional<Student> findByEmail(String email);

    // Return students enrolled in a specific class.
    // JPQL selects the student from the Enrollment association where the classroom
    // id matches.
    @Query("select e.student from Enrollment e where e.classroom.id = :classId")
    List<Student> findStudentsByClassId(Long classId);

    // Return distinct students taught by a teacher.
    // The teacher teaches exactly one class; we use a subquery to fetch that class
    // id.
    // DISTINCT prevents duplicates if multiple enrollments could otherwise match.
    @Query("select distinct e.student from Enrollment e " +
            "where e.classroom.id = (select t.classroom.id from Teacher t where t.id = :teacherId)")
    List<Student> findStudentsByTeacherId(Long teacherId);
}
