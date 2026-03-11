package com.apnaride.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String email;
	private String name;
	private String password; // nullable for OAuth-created users
	private String provider; // e.g. GOOGLE, LOCAL
	private String role;     // "customer", "rider", "admin"
	private String phone;
	private String emergencyPhone;

	// Getters
	public Long getId() { return id; }
	public String getEmail() { return email; }
	public String getName() { return name; }
	public String getPassword() { return password; }
	public String getProvider() { return provider; }
	public String getRole() { return role; }
	public String getPhone() { return phone; }
	public String getEmergencyPhone() { return emergencyPhone; }

	// Setters
	public void setId(Long id) { this.id = id; }
	public void setEmail(String email) { this.email = email; }
	public void setName(String name) { this.name = name; }
	public void setPassword(String password) { this.password = password; }
	public void setProvider(String provider) { this.provider = provider; }
	public void setRole(String role) { this.role = role; }
	public void setPhone(String phone) { this.phone = phone; }
	public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }
}