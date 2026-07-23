package com.example.HotelManagement;

import com.example.HotelManagement.entity.Role;
import com.example.HotelManagement.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class HotelManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(HotelManagementApplication.class, args);
	}
	@Bean
    CommandLineRunner init(RoleRepository roleRepository) {
		return args -> {
			// Check and create ROLE_USER
			if (roleRepository.findByName("ROLE_USER").isEmpty()) {
				Role userRole = new Role();
				userRole.setName("ROLE_USER");
				roleRepository.save(userRole);
				System.out.println("Initialized: ROLE_USER");
			}

			// Check and create ROLE_MANAGER
			if (roleRepository.findByName("ROLE_MANAGER").isEmpty()) {
				Role managerRole = new Role();
				managerRole.setName("ROLE_MANAGER");
				roleRepository.save(managerRole);
				System.out.println("Initialized: ROLE_MANAGER");
			}

			// Check and create ROLE_ADMIN
			if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
				Role adminRole = new Role();
				adminRole.setName("ROLE_ADMIN");
				roleRepository.save(adminRole);
				System.out.println("Initialized: ROLE_ADMIN");
			}
		};
	}

}
