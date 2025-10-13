package com.example2.demo2.repo; // Package for repository interfaces

import com.example2.demo2.model.Enrollment; // Enrollment entity (join table + mark)
import com.example2.demo2.model.Enrollment.Id; // Embedded/composite key type
import org.springframework.data.jpa.repository.JpaRepository; // Base CRUD repository
import org.springframework.data.jpa.repository.Query; // For JPQL custom queries
import java.util.List; // Collections
import java.util.Optional; // For possibly-absent results

// Repository for Enrollment entities. Primary key is composite (Enrollment.Id).
public interface EnrollmentRepository extends JpaRepository<Enrollment, Id> {

    // Spring Data derived query: navigates property path "classroom.id" via
    // "ClassroomId".
    // Returns all enrollments for a given classroom.
    List<Enrollment> findByClassroomId(Long classId);

    // Custom JPQL to fetch exactly one enrollment for a given class + student pair.
    // Using explicit query avoids ambiguity and clarifies the join conditions.
    @Query("select e from Enrollment e where e.classroom.id = :classId and e.student.id = :studentId")
    Optional<Enrollment> findOneByClassIdAndStudentId(Long classId, Long studentId);

    // Spring Data derived query: navigates "student.id" via "StudentId".
    // Returns all enrollments for a given student.
    List<Enrollment> findByStudentId(Long studentId);
}
