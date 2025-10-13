package com.example2.demo2.dto;
public record CreateTeacherReq(String name, String email, String password, Long classId) {} //payload for creating a new teacher and assigning them to a class
