package com.example2.demo2.model; // Package for entities

import jakarta.persistence.*; // JPA annotations
import java.io.Serializable; // Needed for embedded key
import java.util.Objects; // equals/hashCode helpers

@Entity // JPA entity
@Table(name = "enrollments") // Maps to "enrollments" (join table + mark)
public class Enrollment {

    @Embeddable // Marks composite key class as embeddable
    public static class Id implements Serializable { // Composite primary key type (must be Serializable)
        private Long studentId; // FK part: student id
        private Long classId; // FK part: classroom id

        public Long getStudentId() {
            return studentId;
        } // Getter for studentId

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        } // Setter for studentId

        public Long getClassId() {
            return classId;
        } // Getter for classId

        public void setClassId(Long classId) {
            this.classId = classId;
        } // Setter for classId

        @Override
        public boolean equals(Object o) { // Equality for key comparison
            if (this == o)
                return true; // Same instance → equal
            if (!(o instanceof Id id))
                return false; // Type check
            return Objects.equals(studentId, id.studentId) // Compare both key parts
                    && Objects.equals(classId, id.classId);
        }

        @Override
        public int hashCode() { // Hash for key (must match equals)
            return Objects.hash(studentId, classId);
        }
    }

    @EmbeddedId // Use composite key as the entity's PK
    private Id id = new Id(); // Initialize key object

    @ManyToOne(optional = false)
    @MapsId("studentId") // Join to Student and bind to key's studentId
    @JoinColumn(name = "student_id") // FK column name in enrollments table
    private Student student; // Associated student

    @ManyToOne(optional = false)
    @MapsId("classId") // Join to Classroom and bind to key's classId
    @JoinColumn(name = "class_id") // FK column name in enrollments table
    private Classroom classroom; // Associated classroom

    @Column(length = 10) // Small mark/grade string (e.g., "A" or "95")
    private String mark; // Teacher-entered mark

    public Id getId() {
        return id;
    } // Getter for composite id

    public void setId(Id id) {
        this.id = id;
    } // Setter for composite id

    public Student getStudent() {
        return student;
    } // Getter for student

    public void setStudent(Student student) { // Setter for student + keep key consistent
        this.student = student;
        if (student != null)
            this.id.setStudentId(student.getId()); // Sync embedded key part
    }

    public Classroom getClassroom() {
        return classroom;
    } // Getter for classroom

    public void setClassroom(Classroom classroom) { // Setter for classroom + sync key
        this.classroom = classroom;
        if (classroom != null)
            this.id.setClassId(classroom.getId()); // Sync embedded key part
    }

    public String getMark() {
        return mark;
    } // Getter for mark

    public void setMark(String mark) {
        this.mark = mark;
    } // Setter for mark
}
