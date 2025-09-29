package com.farmchainx.api.shipping.dto;

import com.farmchainx.api.shipping.entities.ShipmentStatus;
import jakarta.validation.constraints.*;

public record ShipmentUpdateRequest(
  @NotNull ShipmentStatus status,
  String currentLocation,
  Double temperatureC,
  Double humidity
) {}
