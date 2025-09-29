package com.farmchainx.api.farmer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

public record CreateCropRequest(
    @NotBlank @Size(max = 120) String name,
    @Size(max = 120) String type,
    @PositiveOrZero Double area,
    @Size(max = 160) String location,
    LocalDate plantingDate,
    LocalDate harvestDate,
    @PositiveOrZero Double expectedYield,
    @Size(max = 40) String status,
    @Size(max = 160) String certification
) {}
