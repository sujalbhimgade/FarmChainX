package com.farmchainx.api.distributor.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record InventoryUpsertRequest(
  @NotBlank String batchCode,
  @NotNull Double quantityKg,
  String location,
  String grade,
  Double pricePerKg,
  LocalDate expiryDate,
  Boolean qualityChecked,
  String notes
) {}