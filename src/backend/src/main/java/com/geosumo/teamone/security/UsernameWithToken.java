package com.geosumo.teamone.security;

import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;

public class UsernameWithToken {
	private static final char[] CHARS_ARRAY = "abcdefghijklmnopqrstuvwxyz1234567890".toCharArray();
	String username;
	String token;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getToken() {
		return new String(token);
	}

	public void setToken(String token) {
		this.token = token;
	}

	public UsernameWithToken(String username) {
		this.username = username;
		this.token = getRandomToken();
	}

	public UsernameWithToken(String username, String token) {
		this.username = username;
		this.token = token;
	}

	private static String getRandomToken() {
		try {
			StringBuilder sb = new StringBuilder();
			SecureRandom srd = SecureRandom.getInstance("SHA1PRNG", "SUN");
			for (int i = 0; i < 50; i++) {
				sb.append(CHARS_ARRAY[srd.nextInt(CHARS_ARRAY.length)]);
			}
			return sb.toString();
			
			// byte[] token = new byte[20];
			// srd.nextBytes(token);
			// return new String(token);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
			return null;
		}

	}

}
