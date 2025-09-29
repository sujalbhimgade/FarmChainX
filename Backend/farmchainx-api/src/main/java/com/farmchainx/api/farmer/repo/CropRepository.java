package com.farmchainx.api.farmer.repo;

import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.auth.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CropRepository extends JpaRepository<Crop, Long> {
  List<Crop> findByFarmer(User farmer);
  Optional<Crop> findByBatchCode(String batchCode);
  Optional<Crop> findByPublicId(String publicId);
}
