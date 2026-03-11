package com.apnaride.security;

import java.util.Map;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.apnaride.repository.UserRepository;
import com.apnaride.model.User;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
	@Autowired
	private UserRepository userRepository;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) {
		OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService();
		OAuth2User oAuth2User = delegate.loadUser(userRequest);
		Map<String, Object> attrs = oAuth2User.getAttributes();
		String email = (String) attrs.get("email");
		String name = (String) attrs.getOrDefault("name", attrs.get("given_name"));

		if (email == null) {
			throw new RuntimeException("Email not provided by OAuth2 provider");
		}

		User user = userRepository.findByEmail(email).orElse(null);
		if (user == null) {
			user = new User();
			user.setEmail(email);
			user.setName(name);
			user.setProvider("GOOGLE");
			// password left null -> forces setup flow
			userRepository.save(user);
		} else {
			// existing user: optionally update the name/provider
			user.setName(name);
			user.setProvider("GOOGLE");
			userRepository.save(user);
		}

		// use delegate authorities so principal has granted authorities
		return new DefaultOAuth2User(oAuth2User.getAuthorities(), attrs, "email");
	}
}
