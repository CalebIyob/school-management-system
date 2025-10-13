package com.example2.demo2.model; // Entity package

import com.fasterxml.jackson.annotation.JsonIgnore; // Exclude password from JSON
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Ignore proxy fields
import jakarta.persistence.*; // JPA annotations

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) // Avoid serializing Hibernate proxy fields
@Entity // JPA entity
@Table(name = "students") // Maps to "students" table
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK with identity generation
    private Long id; // Student ID

    @Column(nullable = false, length = 50)
    private String name; // Name: required, max 50
    @Column(nullable = false, length = 50, unique = true)
    private String email; // Unique email: required, max 50
    @Column(nullable = false, length = 50)
    private String role; // Role string ("STUDENT")
    @JsonIgnore // Never serialize the password
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
    } // Getter for password (not serialized)

    public void setPassword(String password) {
        this.password = password;
    } // Setter for password
}
