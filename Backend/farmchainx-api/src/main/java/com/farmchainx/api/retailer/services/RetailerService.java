package com.farmchainx.api.retailer.services;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.repo.UserRepository;
import com.farmchainx.api.retailer.dto.SaleRequest;
import com.farmchainx.api.retailer.entities.RetailSale;
import com.farmchainx.api.retailer.repo.RetailSaleRepository;
import com.farmchainx.api.security.SecurityUtils;
import com.farmchainx.api.trace.entities.SupplyStage;
import com.farmchainx.api.trace.services.TraceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class RetailerService {
  private final RetailSaleRepository sales;
  private final UserRepository users;
  private final TraceService trace;

  public RetailerService(RetailSaleRepository sales, UserRepository users, TraceService trace) {
    this.sales = sales;
    this.users = users;
    this.trace = trace;
  }

  @Transactional
  public RetailSale sell(SaleRequest req) {
    var retailer = SecurityUtils.currentUser(users).orElseThrow();
    RetailSale s = RetailSale.builder()
        .batchCode(req.batchCode())
        .retailer(retailer)
        .quantityKg(req.quantityKg())
        .totalAmount(req.totalAmount())
        .createdAt(Instant.now())
        .build();
    RetailSale saved = sales.save(s);
    trace.add(saved.getBatchCode(), SupplyStage.RETAILER, null, "Retail sale recorded", retailer);
    return saved;
  }

  @Transactional(readOnly = true)
  public List<RetailSale> mySales() {
    var retailer = SecurityUtils.currentUser(users).orElseThrow();
    return sales.findByRetailer(retailer);
  }
}
