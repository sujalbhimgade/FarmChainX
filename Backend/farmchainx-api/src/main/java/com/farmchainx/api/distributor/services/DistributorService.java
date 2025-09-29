package com.farmchainx.api.distributor.services;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.repo.UserRepository;
import com.farmchainx.api.distributor.dto.InventoryRequest;
import com.farmchainx.api.distributor.entities.InventoryItem;
import com.farmchainx.api.distributor.repo.InventoryRepository;
import com.farmchainx.api.farmer.repo.CropRepository;
import com.farmchainx.api.security.SecurityUtils;
import com.farmchainx.api.trace.entities.SupplyStage;
import com.farmchainx.api.trace.services.TraceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class DistributorService {
  private final InventoryRepository inventory;
  private final CropRepository crops;
  private final UserRepository users;
  private final TraceService trace;

  public DistributorService(InventoryRepository inventory, CropRepository crops, UserRepository users, TraceService trace) {
    this.inventory = inventory;
    this.crops = crops;
    this.users = users;
    this.trace = trace;
  }

  @Transactional
  public InventoryItem addToInventory(InventoryRequest req) {
    User distributor = SecurityUtils.currentUser(users).orElseThrow();
    var crop = crops.findByBatchCode(req.batchCode()).orElse(null);

    InventoryItem item = InventoryItem.builder()
        .distributor(distributor)
        .crop(crop)
        .batchCode(req.batchCode())
        .productName(crop != null ? crop.getName() : null)
        .quantityKg(req.quantityKg())
        .pricePerKg(req.unitPrice())     // if your entity uses pricePerKg
        .location(req.location())
        .qualityChecked(Boolean.FALSE)
        .receivedAt(Instant.now())       // if your entity uses receivedAt
        .status("available")
        .build();

    InventoryItem saved = inventory.save(item);
    trace.add(saved.getBatchCode(), SupplyStage.DISTRIBUTOR, saved.getLocation(), "Inventory received", distributor);
    return saved;
  }

  @Transactional(readOnly = true)
  public List<InventoryItem> myInventory() {
    User distributor = SecurityUtils.currentUser(users).orElseThrow();
    return inventory.findByDistributor(distributor);
  }

}
