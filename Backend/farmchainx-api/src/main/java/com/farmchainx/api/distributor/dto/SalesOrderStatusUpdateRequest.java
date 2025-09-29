package com.farmchainx.api.distributor.dto;

import jakarta.validation.constraints.*;

public record SalesOrderStatusUpdateRequest(
  @NotBlank String status // PENDING_APPROVAL | CONFIRMED | SHIPPED | CANCELLED
) {}