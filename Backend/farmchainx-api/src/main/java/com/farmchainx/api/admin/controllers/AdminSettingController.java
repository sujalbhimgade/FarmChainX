// com/farmchainx/api/admin/controllers/AdminSettingController.java
package com.farmchainx.api.admin.controllers;

import com.farmchainx.api.admin.dto.SettingDto;
import com.farmchainx.api.admin.services.AdminSettingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingController {
  private final AdminSettingService svc;
  public AdminSettingController(AdminSettingService svc) { this.svc = svc; }

  @GetMapping
  public ResponseEntity<List<SettingDto>> list() { return ResponseEntity.ok(svc.list()); }

  @PutMapping
  public ResponseEntity<SettingDto> upsert(@RequestBody @Valid SettingDto dto) { return ResponseEntity.ok(svc.upsert(dto)); }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) { svc.delete(id); return ResponseEntity.noContent().build(); }
}
