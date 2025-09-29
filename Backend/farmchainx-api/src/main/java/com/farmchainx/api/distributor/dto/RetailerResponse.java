package com.farmchainx.api.distributor.dto;

public record RetailerResponse(
		  Long id,
		  String name,
		  String contact,
		  String phone,
		  String email,
		  String location,
		  Double creditLimit,
		  Double outstandingAmount,
		  Double rating
		) {}