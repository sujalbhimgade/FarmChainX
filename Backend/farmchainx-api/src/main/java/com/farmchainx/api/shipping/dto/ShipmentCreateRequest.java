package com.farmchainx.api.shipping.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ShipmentCreateRequest(
  @NotNull Long cropId,
  @NotNull Long distributorUserId,
 // @NotBlank 
  String destinationLocation,
  @Positive Double quantityKg,
  @Positive Double unitPrice,
  String vehicle,
  String notes,
  LocalDate expectedDelivery
) {}
