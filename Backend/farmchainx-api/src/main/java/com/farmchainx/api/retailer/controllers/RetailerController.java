package com.farmchainx.api.retailer.controllers;

import com.farmchainx.api.retailer.dto.SaleRequest;
import com.farmchainx.api.retailer.entities.RetailSale;
import com.farmchainx.api.retailer.services.RetailerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/retailer")
public class RetailerController {
  private final RetailerService service;
  public RetailerController(RetailerService service) {
    this.service = service;
  }
  @PostMapping("/sales")
  public ResponseEntity<RetailSale> sell(@RequestBody @Valid SaleRequest req) {
    return ResponseEntity.ok(service.sell(req));
  }
  @GetMapping("/sales")
  public ResponseEntity<List<RetailSale>> sales() {
    return ResponseEntity.ok(service.mySales());
  }
}
