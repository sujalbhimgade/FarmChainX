package com.farmchainx.api.shipping.controllers;

import com.farmchainx.api.shipping.dto.*;
import com.farmchainx.api.shipping.services.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {
  private final ShipmentService service;
  public ShipmentController(ShipmentService service) { this.service = service; }

  // Farmer creates shipment to a distributor
  @PostMapping
  @PreAuthorize("hasRole('FARMER')")
  public ResponseEntity<ShipmentResponse> create(@RequestBody @Valid ShipmentCreateRequest req) {
    return ResponseEntity.ok(service.create(req));
  }

  // Farmer view
  @GetMapping("/outgoing")
  @PreAuthorize("hasRole('FARMER')")
  public ResponseEntity<List<ShipmentResponse>> outgoing() {
    return ResponseEntity.ok(service.myOutgoing());
  }

  // Distributor view
  @GetMapping("/incoming")
  @PreAuthorize("hasRole('DISTRIBUTOR')")
  public ResponseEntity<List<ShipmentResponse>> incoming() {
    return ResponseEntity.ok(service.myIncoming());
  }

  // Either side updates status when assigned (accept, in-transit, delivered, cancel)
  @PatchMapping("/{id}/status")
  @PreAuthorize("@shipmentService.canUpdate(#id)")
  public ResponseEntity<ShipmentResponse> updateStatus(@PathVariable Long id, @RequestBody @Valid ShipmentUpdateRequest req) {
    return ResponseEntity.ok(service.updateStatus(id, req));
  }
}
