package com.farmchainx.api.distributor.dto;

import jakarta.validation.constraints.*;

public record OrderLineInput(
		  @NotBlank String batchCode,
		  @Positive Double quantityKg,
		  @Positive Double pricePerKg
		) {}