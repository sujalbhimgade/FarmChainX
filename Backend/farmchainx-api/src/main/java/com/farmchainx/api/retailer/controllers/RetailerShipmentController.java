// src/main/java/com/farmchainx/api/retailer/controllers/RetailerShipmentController.java
package com.farmchainx.api.retailer.controllers;

import com.farmchainx.api.shipping.dto.ShipmentResponse;
import com.farmchainx.api.shipping.dto.ShipmentUpdateRequest;
import com.farmchainx.api.shipping.entities.ShipmentStatus;
import com.farmchainx.api.shipping.services.ShipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@RestController
@RequestMapping("/api/retailer/shipments")
public class RetailerShipmentController {

    private final ShipmentService shipments;
    public RetailerShipmentController(ShipmentService shipments) { this.shipments = shipments; }

    @GetMapping
    @PreAuthorize("hasRole('RETAILER')")
    public ResponseEntity<List<ShipmentResponse>> listIncoming() {
        // lists shipments addressed to the current retailer
        return ResponseEntity.ok(shipments.myIncoming());
    }

    public static record ReceiveRequest(@NotNull Long shipmentId, String currentLocation, Double temperatureC, Double humidity) {}

    // keep alias used by UI
    @PostMapping("/receive")
    @PreAuthorize("hasRole('RETAILER')")
    public ResponseEntity<ShipmentResponse> receive(@RequestBody ReceiveRequest req) {
        var update = new ShipmentUpdateRequest(
            ShipmentStatus.DELIVERED,
            req.currentLocation(),
            req.temperatureC(),
            req.humidity()
        );
        return ResponseEntity.ok(shipments.updateStatus(req.shipmentId(), update));
    }
}
