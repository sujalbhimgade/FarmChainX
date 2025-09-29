package com.farmchainx.api.shipping.repo;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.shipping.entities.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
  List<Shipment> findByFromUser(User from);
  List<Shipment> findByToUser(User to);
  Optional<Shipment> findByShipmentId(String shipmentId);
}
