// src/main/java/com/farmchainx/api/shipping/controllers/DistributorShipmentController.java
package com.farmchainx.api.shipping.controllers;

import com.farmchainx.api.shipping.dto.DistributorToRetailerCreateRequest;
import com.farmchainx.api.shipping.dto.ShipmentResponse;
import com.farmchainx.api.shipping.services.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/distributor/shipments")
@PreAuthorize("hasRole('DISTRIBUTOR')")
public class DistributorShipmentController {
    private final ShipmentService shipments;
    public DistributorShipmentController(ShipmentService shipments) { this.shipments = shipments; }

    @PostMapping("/to-retailer")
    public ResponseEntity<ShipmentResponse> toRetailer(@RequestBody @Valid DistributorToRetailerCreateRequest req) {
        return ResponseEntity.ok(shipments.createToRetailer(req));
    }
}
