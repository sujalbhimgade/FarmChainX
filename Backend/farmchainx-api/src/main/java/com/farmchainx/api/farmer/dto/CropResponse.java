package com.farmchainx.api.farmer.dto;

import java.time.Instant;
import java.time.LocalDate;

public record CropResponse(
    Long id,
    String name,
    String type,
    String soil_type,
    String fieldLocation,
    Double area,
    String area_unit,
    Double gpsCoordinates,
    String image_url,
    String pesticides,
    LocalDate plantedDate,
    LocalDate harvestDate,
    String status,
    Double quantityKg,
    Double unitPrice,
    String qualityGrade,
    String notes,
    String batchCode,
    Instant created_at,
    Instant updated_at
) {}
