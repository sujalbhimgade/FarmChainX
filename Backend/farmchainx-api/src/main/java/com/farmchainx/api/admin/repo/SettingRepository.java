// com/farmchainx/api/admin/repo/SettingRepository.java
package com.farmchainx.api.admin.repo;
import com.farmchainx.api.admin.entities.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SettingRepository extends JpaRepository<Setting, Long> {
  Optional<Setting> findByConfigKey(String configKey);
}
