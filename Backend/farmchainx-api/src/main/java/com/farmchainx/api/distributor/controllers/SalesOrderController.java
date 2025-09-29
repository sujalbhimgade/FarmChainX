package com.farmchainx.api.distributor.controllers;

import com.farmchainx.api.distributor.dto.*;
import com.farmchainx.api.distributor.services.SalesOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/distributor/orders")
@PreAuthorize("hasRole('DISTRIBUTOR')")
public class SalesOrderController {
  private final SalesOrderService service;
  public SalesOrderController(SalesOrderService service) { this.service = service; }

  @GetMapping
  public ResponseEntity<List<SalesOrderResponse>> list() {
    return ResponseEntity.ok(service.myOrders());
  }

  @PostMapping
  public ResponseEntity<SalesOrderResponse> create(@RequestBody @Valid SalesOrderCreateRequest req) {
    return ResponseEntity.ok(service.create(req));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<SalesOrderResponse> status(@PathVariable Long id, @RequestBody @Valid SalesOrderStatusUpdateRequest req) {
    return ResponseEntity.ok(service.updateStatus(id, req));
  }
}
