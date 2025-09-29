package com.farmchainx.api.distributor.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public record SalesOrderCreateRequest(
		  @NotNull Long retailerUserId,
		  @NotEmpty List<OrderLineInput> lines,
		  LocalDate deliveryDate,
		  String paymentTerms,
		  String notes
		) {}