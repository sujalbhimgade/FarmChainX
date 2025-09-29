package com.farmchainx.api.retailer.repo;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.retailer.entities.RetailSale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RetailSaleRepository extends JpaRepository<RetailSale, Long> {
  List<RetailSale> findByRetailer(User retailer);
}
