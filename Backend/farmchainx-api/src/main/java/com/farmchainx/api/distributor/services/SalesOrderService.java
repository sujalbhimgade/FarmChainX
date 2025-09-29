package com.farmchainx.api.distributor.services;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.repo.UserRepository;
import com.farmchainx.api.distributor.dto.*;
import com.farmchainx.api.distributor.entities.*;
import com.farmchainx.api.distributor.repo.*;
import com.farmchainx.api.distributor.entities.InventoryItem;
import com.farmchainx.api.distributor.repo.InventoryRepository;
import com.farmchainx.api.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service("salesOrderService")
public class SalesOrderService {
  private final SalesOrderRepository orders;
  private final InventoryRepository inventory;
  private final UserRepository users;

  public SalesOrderService(SalesOrderRepository orders, InventoryRepository inventory, UserRepository users) {
    this.orders = orders;
    this.inventory = inventory;
    this.users = users;
  }

  @Transactional(readOnly = true)
  public List<SalesOrderResponse> myOrders() {
    User me = SecurityUtils.currentUser(users).orElseThrow();
    return orders.findByDistributor(me).stream().map(this::toResponse).toList();
  }

  @Transactional
  public SalesOrderResponse create(SalesOrderCreateRequest req) {
    User dist = SecurityUtils.currentUser(users).orElseThrow();
    User retailer = users.findById(req.retailerUserId()).orElseThrow();

    SalesOrder order = SalesOrder.builder()
        .distributor(dist)
        .retailer(retailer)
        .status("PENDING_APPROVAL")
        .createdAt(Instant.now())
        .deliveryDate(req.deliveryDate())
        .paymentTerms(req.paymentTerms())
        .notes(req.notes())
        .build();

    double total = 0.0;
    for (var li : req.lines()) {
      InventoryItem stock = inventory.findByDistributorAndBatchCode(dist, li.batchCode())
          .orElseThrow(() -> new IllegalStateException("Batch not in inventory: " + li.batchCode()));
      if (stock.getQuantityKg() == null || stock.getQuantityKg() < li.quantityKg())
        throw new IllegalStateException("Insufficient stock for " + li.batchCode());

      double lineTotal = li.quantityKg() * li.pricePerKg();
      total += lineTotal;

      order.getLines().add(SalesOrderLine.builder()
          .order(order)
          .batchCode(li.batchCode())
          .productName(stock.getProductName())
          .quantityKg(li.quantityKg())
          .pricePerKg(li.pricePerKg())
          .lineTotal(lineTotal)
          .build());
    }
    order.setTotalAmount(total);
    return toResponse(orders.save(order));
  }

  @Transactional
  public SalesOrderResponse updateStatus(Long id, SalesOrderStatusUpdateRequest req) {
    User dist = SecurityUtils.currentUser(users).orElseThrow();
    SalesOrder o = orders.findById(id).orElseThrow();
    if (!o.getDistributor().getId().equals(dist.getId())) throw new IllegalStateException("Not allowed");

    switch (req.status()) {
      case "CONFIRMED" -> reserve(o);
      case "SHIPPED" -> shipAndDeduct(o);
      case "CANCELLED" -> unreserve(o);
      case "PENDING_APPROVAL" -> {} // no-op
      default -> throw new IllegalArgumentException("Invalid status");
    }
    o.setStatus(req.status());
    return toResponse(orders.save(o));
  }

  private void reserve(SalesOrder o) {
    // For demo keep it simple (no separate reserved bucket)
  }

  private void unreserve(SalesOrder o) {
    // For demo, nothing to return to stock if not deducted yet
  }

  private void shipAndDeduct(SalesOrder o) {
    for (var li : o.getLines()) {
      var stock = inventory.findByDistributorAndBatchCode(o.getDistributor(), li.getBatchCode())
          .orElseThrow();
      double newQty = (stock.getQuantityKg() == null ? 0.0 : stock.getQuantityKg()) - li.getQuantityKg();
      stock.setQuantityKg(Math.max(0.0, newQty));
      stock.setStatus(classify(newQty));
      inventory.save(stock);
    }
    // Optionally: create a distributor->retailer Shipment and append Trace here
  }

  private SalesOrderResponse toResponse(SalesOrder o) {
    return new SalesOrderResponse(
        o.getId(),
        o.getRetailer().getId(),
        o.getRetailer().getFullName(),
        o.getTotalAmount(),
        o.getStatus(),
        o.getDeliveryDate());
  }

  private String classify(double q) {
    if (q <= 0.0) return "out-of-stock";
    if (q < 20.0) return "critical";
    if (q < 100.0) return "low-stock";
    return "available";
  }
}
