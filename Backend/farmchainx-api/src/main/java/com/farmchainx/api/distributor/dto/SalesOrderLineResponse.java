package com.farmchainx.api.distributor.dto;

public record SalesOrderLineResponse(
    Long id,
    String batchCode,
    String productName,
    Double quantityKg,
    Double pricePerKg,
    Double lineTotal
) {}
