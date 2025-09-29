package com.farmchainx.api.distributor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public record InventoryRequest(
    @NotBlank String batchCode,
    @PositiveOrZero Double quantityKg,
    @PositiveOrZero Double unitPrice,
    String location
) {}
