package com.example2.demo2.model; // Package for entities

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // For proxy-field ignoring
import jakarta.persistence.*; // JPA annotations

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) // Ignore Hibernate proxy properties in JSON
@Entity // JPA entity
@Table(name = "classes") // Maps to "classes" table
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK with identity generation
    private Long id; // Classroom ID

    @Column(nullable = false, length = 50)
    private String name; // Class name: required, max 50

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
}
