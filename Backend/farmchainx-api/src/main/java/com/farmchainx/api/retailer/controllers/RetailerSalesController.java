package com.farmchainx.api.retailer.controllers;

import com.farmchainx.api.retailer.dto.SaleRequest;
import com.farmchainx.api.retailer.entities.RetailSale;
import com.farmchainx.api.retailer.services.RetailerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/retailer/sales")
public class RetailerSalesController {

  private final RetailerService retailerService;

  public RetailerSalesController(RetailerService retailerService) {
    this.retailerService = retailerService;
  }

  @GetMapping
  @PreAuthorize("hasRole('RETAILER')")
  public ResponseEntity<List<RetailSale>> listMySales() {
    return ResponseEntity.ok(retailerService.mySales());
  }

  @PostMapping
  @PreAuthorize("hasRole('RETAILER')")
  
  public ResponseEntity<RetailSale> createSale(@RequestBody SaleRequest req) {
    return ResponseEntity.ok(retailerService.sell(req));
  }
}
