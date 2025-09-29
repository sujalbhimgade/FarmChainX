// com/farmchainx/api/admin/controllers/AdminUserController.java
package com.farmchainx.api.admin.controllers;

import com.farmchainx.api.admin.dto.*;
import com.farmchainx.api.admin.services.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
  private final AdminUserService svc;
  public AdminUserController(AdminUserService svc) { this.svc = svc; }

  @GetMapping
  public ResponseEntity<PageResponse<UserDto>> list(
      @RequestParam(required = false) String q,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return ResponseEntity.ok(svc.list(q, page, size));
  }

  @PostMapping
  public ResponseEntity<UserDto> create(@RequestBody @Valid UserUpsertRequest req) {
    return ResponseEntity.ok(svc.create(req));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<UserDto> update(@PathVariable Long id, @RequestBody @Valid UserUpsertRequest req) {
    return ResponseEntity.ok(svc.update(id, req));
  }

  @PatchMapping("/{id}/roles")
  public ResponseEntity<UserDto> setRoles(@PathVariable Long id, @RequestBody Set<String> roles) {
    return ResponseEntity.ok(svc.setRoles(id, roles));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    svc.delete(id); return ResponseEntity.noContent().build();
  }
}
