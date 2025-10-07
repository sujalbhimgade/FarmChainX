package com.farmchainx.api.shipping.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record DistributorToRetailerCreateRequest(
    @NotNull Long retailerUserId,
    @NotNull Long cropId,
    @NotNull Double quantityKg,
    @NotNull Double unitPrice,
    String originLocation,
    String destinationLocation,
    String vehicle,
    Instant expectedDelivery
) {}
