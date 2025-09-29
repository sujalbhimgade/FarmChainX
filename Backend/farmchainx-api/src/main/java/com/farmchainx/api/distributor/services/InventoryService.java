package com.farmchainx.api.distributor.services;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.repo.UserRepository;
import com.farmchainx.api.distributor.dto.InventoryResponse;
import com.farmchainx.api.distributor.dto.InventoryUpsertRequest;
import com.farmchainx.api.distributor.entities.InventoryItem;
import com.farmchainx.api.distributor.repo.InventoryRepository;
import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.farmer.repo.CropRepository;
import com.farmchainx.api.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service("inventoryService")
public class InventoryService {
  private final InventoryRepository inventory;
  private final UserRepository users;
  private final CropRepository crops;

  public InventoryService(InventoryRepository inventory, UserRepository users, CropRepository crops) {
    this.inventory = inventory;
    this.users = users;
    this.crops = crops;
  }

  @Transactional(readOnly = true)
  public List<InventoryResponse> myItems() {
    User me = SecurityUtils.currentUser(users).orElseThrow();
    return inventory.findByDistributor(me).stream().map(this::toResponse).toList();
  }

  @Transactional
  public InventoryResponse upsertByBatch(InventoryUpsertRequest req) {
    User me = SecurityUtils.currentUser(users).orElseThrow();
    InventoryItem item = inventory.findByDistributorAndBatchCode(me, req.batchCode())
        .orElseGet(() -> buildNew(me, req.batchCode()));
    if (req.quantityKg() != null) item.setQuantityKg(req.quantityKg());
    item.setLocation(req.location());
    item.setGrade(req.grade());
    item.setPricePerKg(req.pricePerKg());
    item.setExpiryDate(req.expiryDate());
    item.setQualityChecked(req.qualityChecked() == null ? Boolean.FALSE : req.qualityChecked());
    item.setNotes(req.notes());
    item.setStatus(classify(item.getQuantityKg()));
    return toResponse(inventory.save(item));
  }

  @Transactional
  public void delete(Long id) {
    User me = SecurityUtils.currentUser(users).orElseThrow();
    var item = inventory.findById(id).orElseThrow();
    if (!item.getDistributor().getId().equals(me.getId())) throw new IllegalStateException("Not allowed");
    inventory.delete(item);
  }

  // called by Shipments when farmer->distributor delivery happens
  @Transactional
  public void intakeFromDelivery(User distributor, Crop crop, String batchCode, Double qtyKg, Double pricePerKg) {
    InventoryItem item = inventory.findByDistributorAndBatchCode(distributor, batchCode)
        .orElseGet(() -> InventoryItem.builder()
            .distributor(distributor)
            .crop(crop)
            .batchCode(batchCode)
            .productName(crop.getName())
            .receivedAt(Instant.now())
            .qualityChecked(Boolean.FALSE)
            .build());
    item.setQuantityKg((item.getQuantityKg() == null ? 0.0 : item.getQuantityKg()) + (qtyKg == null ? 0.0 : qtyKg));
    if (pricePerKg != null) item.setPricePerKg(pricePerKg);
    item.setStatus(classify(item.getQuantityKg()));
    inventory.save(item);
  }

  private InventoryItem buildNew(User me, String batch) {
    Crop crop = crops.findByBatchCode(batch).orElseThrow();
    return InventoryItem.builder()
        .distributor(me)
        .crop(crop)
        .batchCode(batch)
        .productName(crop.getName())
        .receivedAt(Instant.now())
        .qualityChecked(Boolean.FALSE)
        .quantityKg(0.0)
        .status("available")
        .build();
  }

  private String classify(Double qty) {
    double q = qty == null ? 0.0 : qty;
    if (q <= 0.0) return "out-of-stock";
    if (q < 20.0) return "critical";
    if (q < 100.0) return "low-stock";
    return "available";
  }

  private InventoryResponse toResponse(InventoryItem i) {
    return new InventoryResponse(
        i.getId(), i.getBatchCode(), i.getCrop().getId(), i.getProductName(),
        i.getQuantityKg(), i.getLocation(), i.getGrade(), i.getPricePerKg(),
        i.getExpiryDate(), i.getQualityChecked(), i.getStatus());
  }
}
