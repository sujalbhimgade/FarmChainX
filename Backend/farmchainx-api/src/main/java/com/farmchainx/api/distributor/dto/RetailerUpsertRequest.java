package com.farmchainx.api.distributor.dto;

import jakarta.validation.constraints.*;

public record RetailerUpsertRequest(
  @NotBlank String name,
  String contact,
  String phone,
  String email,
  String location,
  Double creditLimit,
  Double rating,
  String preferredProducts,
  String notes,
  Long retailerUserId // optional link to a real user
) {}

