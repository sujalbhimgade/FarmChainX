package com.farmchainx.api.retailer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record SaleRequest(
    @NotBlank String batchCode,
    @Positive Double quantityKg,
    @Positive Double totalAmount
) {}
