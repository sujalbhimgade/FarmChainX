package com.farmchainx.api.distributor.controllers;

import com.farmchainx.api.distributor.dto.*;
import com.farmchainx.api.distributor.services.DistributorRetailerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/distributor/retailers")
@PreAuthorize("hasRole('DISTRIBUTOR')")
public class DistributorRetailerController {
  private final DistributorRetailerService service;
  public DistributorRetailerController(DistributorRetailerService service) { this.service = service; }

  @GetMapping
  public ResponseEntity<List<RetailerResponse>> list() {
    return ResponseEntity.ok(service.myRetailers());
  }

  @PostMapping
  public ResponseEntity<RetailerResponse> create(@RequestBody @Valid RetailerUpsertRequest req) {
    return ResponseEntity.ok(service.upsert(null, req));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<RetailerResponse> update(@PathVariable Long id, @RequestBody @Valid RetailerUpsertRequest req) {
    return ResponseEntity.ok(service.upsert(id, req));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
