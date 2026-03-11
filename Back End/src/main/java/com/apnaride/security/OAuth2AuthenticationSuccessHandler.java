package com.apnaride.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import com.apnaride.repository.UserRepository;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
	private final UserRepository userRepository;

	@Value("${app.frontend.url:http://localhost:3000}")
	private String frontendUrl;

	public OAuth2AuthenticationSuccessHandler(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		Object principal = authentication.getPrincipal();
		String email = null;
		try {
			// principal may be DefaultOAuth2User
			java.lang.reflect.Method m = principal.getClass().getMethod("getAttribute", String.class);
			email = (String) m.invoke(principal, "email");
		} catch (Exception e) {
			// ignore
		}

		if (email != null) {
			var user = userRepository.findByEmail(email).orElse(null);
			if (user != null && (user.getPassword() == null || user.getPassword().isBlank())) {
				// redirect to frontend setup password page
				response.sendRedirect(frontendUrl + "/setup-password?email=" + java.net.URLEncoder.encode(email, "UTF-8"));
				return;
			}
		}
		// default redirect
		response.sendRedirect(frontendUrl + "/");
	}
}
