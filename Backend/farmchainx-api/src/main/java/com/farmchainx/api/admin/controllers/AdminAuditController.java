// com/farmchainx/api/admin/controllers/AdminAuditController.java
package com.farmchainx.api.admin.controllers;

import com.farmchainx.api.admin.dto.AuditLogDto;
import com.farmchainx.api.admin.services.AdminAuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAuditController {
  private final AdminAuditService svc;
  public AdminAuditController(AdminAuditService svc) { this.svc = svc; }

  @GetMapping
  public ResponseEntity<List<AuditLogDto>> list() { return ResponseEntity.ok(svc.list()); }
}
