package com.example2.demo2.repo; // Package for repository interfaces

import com.example2.demo2.model.Classroom; // Import the Classroom JPA entity
import org.springframework.data.jpa.repository.JpaRepository; // Base CRUD repository

// Repository for Classroom entities with primary key type Long.
// All standard CRUD/paging methods are inherited from JpaRepository.
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
}
