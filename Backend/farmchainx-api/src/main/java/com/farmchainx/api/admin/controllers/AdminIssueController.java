// com/farmchainx/api/admin/controllers/AdminIssueController.java
package com.farmchainx.api.admin.controllers;

import com.farmchainx.api.admin.dto.IssueDto;
import com.farmchainx.api.admin.services.AdminIssueService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/issues")
@PreAuthorize("hasRole('ADMIN')")
public class AdminIssueController {
  private final AdminIssueService svc;
  public AdminIssueController(AdminIssueService svc) { this.svc = svc; }

  @GetMapping
  public ResponseEntity<Page<IssueDto>> list(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size) {
    return ResponseEntity.ok(svc.list(page, size));
  }

  @PostMapping
  public ResponseEntity<IssueDto> create(@RequestBody @Valid IssueDto dto) {
    return ResponseEntity.ok(svc.create(dto));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<IssueDto> setStatus(@PathVariable Long id, @RequestParam String status) {
    return ResponseEntity.ok(svc.updateStatus(id, status));
  }
}
