package com.farmchainx.api.farmer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCropStatusRequest(
    @NotBlank @Size(max = 40) String status
) {}
