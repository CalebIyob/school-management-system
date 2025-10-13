package com.example2.demo2.model; // Package containing JPA entities

import com.fasterxml.jackson.annotation.JsonIgnore; // Jackson annotation to exclude fields from JSON
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Jackson annotation to ignore proxy fields
import jakarta.persistence.*; // JPA annotations

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) // Avoid serializing Hibernate proxy internals
@Entity // Marks this class as a JPA entity
@Table(name = "admins") // Maps to the "admins" table
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK with auto-increment identity strategy
    private Long id; // Admin ID (primary key)

    @Column(nullable = false, length = 50)
    private String name; // Name column: required, max 50 chars
    @Column(nullable = false, length = 50, unique = true)
    private String email; // Email: required, unique, max 50
    @Column(nullable = false, length = 50)
    private String role; // Role string (e.g., "ADMIN")
    @JsonIgnore // Do not include in JSON responses
    @Column(nullable = false, length = 255)
    private String password; // Hashed password

    public Long getId() {
        return id;
    } // Getter for id

    public void setId(Long id) {
        this.id = id;
    } // Setter for id

    public String getName() {
        return name;
    } // Getter for name

    public void setName(String name) {
        this.name = name;
    } // Setter for name

    public String getEmail() {
        return email;
    } // Getter for email

    public void setEmail(String email) {
        this.email = email;
    } // Setter for email

    public String getRole() {
        return role;
    } // Getter for role

    public void setRole(String role) {
        this.role = role;
    } // Setter for role

    public String getPassword() {
        return password;
    } // Getter for password (still present in Java)

    public void setPassword(String password) {
        this.password = password;
    } // Setter for password
}
