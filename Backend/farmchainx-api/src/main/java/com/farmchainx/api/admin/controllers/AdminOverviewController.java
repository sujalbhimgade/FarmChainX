// com/farmchainx/api/admin/controllers/AdminOverviewController.java
package com.farmchainx.api.admin.controllers;

import com.farmchainx.api.admin.dto.OverviewResponse;
import com.farmchainx.api.admin.services.AdminOverviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/overview")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOverviewController {
  private final AdminOverviewService svc;
  public AdminOverviewController(AdminOverviewService svc) { this.svc = svc; }

  @GetMapping
  public ResponseEntity<OverviewResponse> get() { return ResponseEntity.ok(svc.get()); }
}
