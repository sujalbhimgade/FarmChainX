// com/farmchainx/api/admin/controllers/GlobalExceptionHandler.java
package com.farmchainx.api.admin.controllers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("error", "validation_failed");
    Map<String, String> fields = new LinkedHashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(fe -> fields.put(fe.getField(), fe.getDefaultMessage()));
    body.put("fields", fields);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler({IllegalArgumentException.class, ConstraintViolationException.class})
  public ResponseEntity<Map<String, Object>> handleBadRequest(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "bad_request", "message", ex.getMessage()));
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFound(EntityNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "not_found", "message", ex.getMessage()));
  }
}
