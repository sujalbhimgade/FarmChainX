package com.farmchainx.api.distributor.repo;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.distributor.entities.RetailerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RetailerRepository extends JpaRepository<RetailerProfile, Long> {
  List<RetailerProfile> findByDistributor(User distributor);
}
