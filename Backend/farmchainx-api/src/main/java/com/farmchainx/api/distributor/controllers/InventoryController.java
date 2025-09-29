package com.farmchainx.api.distributor.controllers;

import com.farmchainx.api.distributor.dto.InventoryResponse;
import com.farmchainx.api.distributor.dto.InventoryUpsertRequest;
import com.farmchainx.api.distributor.services.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController("inventoryController")
@RequestMapping("/api/distributor/inventory")
@PreAuthorize("hasRole('DISTRIBUTOR')")
public class InventoryController {
  private final InventoryService service;
  public InventoryController(InventoryService service) { this.service = service; }

  @GetMapping
  public ResponseEntity<List<InventoryResponse>> list() {
    return ResponseEntity.ok(service.myItems());
  }

  @PostMapping
  public ResponseEntity<InventoryResponse> upsert(@RequestBody @Valid InventoryUpsertRequest req) {
    return ResponseEntity.ok(service.upsertByBatch(req));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
