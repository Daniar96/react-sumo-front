package com.geosumo.teamone.security;

import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;


public class UsernameWithToken {
	String username;
	byte[] token;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getToken() {
		return new String(token);
	}

	public void setToken(byte[] token) {
		this.token = token;
	}

	public UsernameWithToken(String username) {
		this.username = username;
		this.token = getRandomToken();
	}

	public UsernameWithToken(String username, byte token[]) {
		this.username = username;
		this.token = token;
	}

	private static byte[] getRandomToken() {
		try {
			SecureRandom srd = SecureRandom.getInstance("SHA1PRNG", "SUN");
			byte[] token = new byte[20];
			srd.nextBytes(token);
			return token;
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
			return null;
		}

	}

}
