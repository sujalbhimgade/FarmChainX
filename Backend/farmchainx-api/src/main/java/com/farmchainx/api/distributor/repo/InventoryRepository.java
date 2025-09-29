package com.farmchainx.api.distributor.repo;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.distributor.entities.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
  List<InventoryItem> findByDistributor(User distributor);
  Optional<InventoryItem> findByDistributorAndBatchCode(User distributor, String batchCode);

}
