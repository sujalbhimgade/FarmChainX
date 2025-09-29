package com.farmchainx.api.distributor.repo;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.distributor.entities.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
  List<SalesOrder> findByDistributor(User distributor);
}
