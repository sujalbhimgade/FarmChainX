package com.farmchainx.api.distributor.controllers;

import com.farmchainx.api.distributor.dto.InventoryRequest;
import com.farmchainx.api.distributor.entities.InventoryItem;
import com.farmchainx.api.distributor.services.DistributorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("distributorController")
@RequestMapping("/api/distributor")
public class DistributorController {
  private final DistributorService service;
  public DistributorController(DistributorService service) {
    this.service = service;
  }
  @PostMapping("/dashboard")
  public ResponseEntity<InventoryItem> add(@RequestBody @Valid InventoryRequest req) {
    return ResponseEntity.ok(service.addToInventory(req));
  }
  @GetMapping("/dashboard")
  public ResponseEntity<List<InventoryItem>> list() {
    return ResponseEntity.ok(service.myInventory());
  }
}
