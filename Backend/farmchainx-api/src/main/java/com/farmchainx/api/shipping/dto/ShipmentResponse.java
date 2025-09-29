package com.farmchainx.api.shipping.dto;

import com.farmchainx.api.shipping.entities.ShipmentStatus;
import com.farmchainx.api.trace.entities.SupplyStage;
import java.time.Instant;
import java.time.LocalDate;

public record ShipmentResponse(
  Long id,
  String shipmentId,
  String batchCode,
  Long cropId,
  String cropName,
  String productType,
  Long farmerId,
  String farmerName,
  Long distributorId,
  String distributorName,
  Double quantityKg,
  Double unitPrice,
  Double totalValue,
  String originLocation,
  String destinationLocation,
  String vehicle,
  Double temperatureC,
  Double humidity,
  ShipmentStatus status,
  SupplyStage fromStage,
  SupplyStage toStage,
  Instant createdAt,
  Instant updatedAt,
  LocalDate expectedDelivery
) {}
