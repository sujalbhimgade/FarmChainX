package com.farmchainx.api.distributor.dto;
import java.time.LocalDate;

public record SalesOrderResponse(
  Long id,
  Long retailerId,
  String retailerName,
  Double totalAmount,
  String status,
  LocalDate deliveryDate
) {}