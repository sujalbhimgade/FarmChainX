package com.farmchainx.api.distributor.dto;

import java.time.LocalDate;
import java.util.List;

public record SalesOrderResponse(
    Long id,
    Long retailerUserId,
    String retailerName,
    Double totalAmount,
    String status,
    LocalDate deliveryDate,
    List<SalesOrderLineResponse> lines
) {}
