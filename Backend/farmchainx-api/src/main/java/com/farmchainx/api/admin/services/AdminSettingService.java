// com/farmchainx/api/admin/services/AdminSettingService.java
package com.farmchainx.api.admin.services;

import com.farmchainx.api.admin.dto.SettingDto;
import com.farmchainx.api.admin.entities.Setting;
import com.farmchainx.api.admin.repo.SettingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminSettingService {
  private final SettingRepository settings;
  public AdminSettingService(SettingRepository settings) { this.settings = settings; }

  public List<SettingDto> list() {
    return settings.findAll().stream().map(this::toDto).toList();
  }

  public SettingDto upsert(SettingDto dto) {
    Setting s = settings.findByConfigKey(dto.configKey())
        .orElseGet(() -> Setting.builder().configKey(dto.configKey()).build());
    s.setConfigValue(dto.configValue());
    s.setCategory(dto.category());
    s.setDescription(dto.description());
    return toDto(settings.save(s));
  }

  public void delete(Long id) {
    if (!settings.existsById(id)) throw new EntityNotFoundException("Setting not found");
    settings.deleteById(id);
  }

  private SettingDto toDto(Setting s) {
    return new SettingDto(s.getId(), s.getConfigKey(), s.getConfigValue(), s.getCategory(), s.getDescription());
  }
}
