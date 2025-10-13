package com.example2.demo2.repo; // Package for repository interfaces

import com.example2.demo2.model.Teacher; // Teacher JPA entity
import org.springframework.data.jpa.repository.JpaRepository; // Base CRUD repository
import org.springframework.data.jpa.repository.Query; // For custom JPQL
import java.util.List; // Collections

// Repository for Teacher entities (primary key Long).
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    // Fetch all teachers and eagerly load their classroom in a single query.
    // 'join fetch' avoids N+1 queries and LazyInitializationException when
    // accessing classroom outside tx.
    @Query("select t from Teacher t join fetch t.classroom")
    List<Teacher> findAllWithClassroom();
}
