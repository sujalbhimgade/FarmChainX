// src/main/java/com/farmchainx/api/retailer/controllers/RetailerInventoryController.java
package com.farmchainx.api.retailer.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/retailer/inventory")
public class RetailerInventoryController {

  @GetMapping
  @PreAuthorize("hasRole('RETAILER')")
  public ResponseEntity<List<Map<String, Object>>> list() {
    // Return empty array for now; UI will render without errors
    return ResponseEntity.ok(List.of());
  }

  @PostMapping
  @PreAuthorize("hasRole('RETAILER')")
  public ResponseEntity<Map<String, Object>> upsert(@RequestBody Map<String, Object> body) {
    // Echo back posted item with defaults (stub)
    body.putIfAbsent("id", 1L);
    body.putIfAbsent("expiryDate", LocalDate.now().plusDays(30).toString());
    return ResponseEntity.ok(body);
  }
}
