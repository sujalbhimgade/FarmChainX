package com.farmchainx.api.distributor.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record InventoryResponse(
		  Long id,
		  String batchCode,
		  Long cropId,
		  String productName,
		  Double quantityKg,
		  String location,
		  String grade,
		  Double pricePerKg,
		  LocalDate expiryDate,
		  Boolean qualityChecked,
		  String status
		) {}