// com/farmchainx/api/admin/dto/PageResponse.java
package com.farmchainx.api.admin.dto;
import java.util.List;

public record PageResponse<T>(List<T> content, long totalElements, int totalPages, int page, int size) {}
