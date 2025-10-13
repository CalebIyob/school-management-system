package com.example2.demo2.repo; // Package for repository interfaces

import com.example2.demo2.model.Admin; // Import the Admin JPA entity
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data base repo
import java.util.Optional; // Container type for nullable results

// Repository interface for Admin entities.
// Extending JpaRepository gives CRUD methods out of the box.
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // Derives a query from the method name to look up an Admin by email.
    // Returns Optional so callers handle "not found" explicitly.
    Optional<Admin> findByEmail(String email);
}
