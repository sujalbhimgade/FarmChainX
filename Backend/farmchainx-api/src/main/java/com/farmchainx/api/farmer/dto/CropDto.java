package com.farmchainx.api.farmer.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CropDto(
    @NotBlank String name,
    String type,
    String soil_type,
    String fieldLocation,
    @PositiveOrZero Double area,
    String area_unit,
    Double gpsCoordinates,
    String image_url,
    String pesticides,
    LocalDate plantedDate,
    LocalDate harvestDate,
    String status,
    @PositiveOrZero Double quantityKg,
    @PositiveOrZero Double unitPrice,
    String qualityGrade,
    String notes
) {}
