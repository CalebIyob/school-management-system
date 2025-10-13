package com.example2.demo2.model; // Entity package

import com.fasterxml.jackson.annotation.JsonIgnore; // Hide password in JSON
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Ignore proxy metadata
import jakarta.persistence.*; // JPA annotations

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) // Prevent proxy fields leaking into JSON
@Entity // Marks as JPA entity
@Table(name = "teachers") // Maps to "teachers" table
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment PK
    private Long id; // Teacher ID

    @Column(nullable = false, length = 50)
    private String name; // Name column: required
    @Column(nullable = false, length = 50, unique = true)
    private String email; // Email: required + unique
    @Column(nullable = false, length = 50)
    private String role; // Role string ("TEACHER")

    @JsonIgnore // Exclude password from API output
    @Column(nullable = false, length = 255) // Password column constraints
    private String password; // Hashed password

    @ManyToOne(optional = false, fetch = FetchType.LAZY) // Many teachers → one classroom; lazy to defer load
    @JoinColumn(name = "class_id", // FK column name in teachers table
            foreignKey = @ForeignKey(name = "fk_teacher_class")) // Named FK constraint (optional)
    private Classroom classroom; // Classroom this teacher owns/teaches

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
    } // Getter for password (kept server-side)

    public void setPassword(String password) {
        this.password = password;
    } // Setter for password

    public Classroom getClassroom() {
        return classroom;
    } // Getter for classroom relation

    public void setClassroom(Classroom classroom) {
        this.classroom = classroom;
    } // Setter for classroom
}
