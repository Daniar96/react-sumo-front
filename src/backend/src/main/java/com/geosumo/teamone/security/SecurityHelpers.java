package com.geosumo.teamone.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.util.Arrays;

public class SecurityHelpers {
	public static byte[] hexStringToByteArray(String s) {
		int len = s.length();
		byte[] data = new byte[len / 2];
		for (int i = 0; i < len; i += 2) {
			data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + Character.digit(s.charAt(i + 1), 16));
		}
		return data;
	}
	public static byte[][] hashSaltFromPassword(String passwordString) {
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
			SecureRandom srd = SecureRandom.getInstance("SHA1PRNG", "SUN");
			// Create random salt
			byte[] salt = new byte[20];
			srd.nextBytes(salt);
			// combine salt with a password
			String saltPlusPlainTextPassword = passwordString + new String(salt);
			// Hash password and salt
			messageDigest.update(saltPlusPlainTextPassword.getBytes(StandardCharsets.UTF_8));
			byte[][] toReturn = new byte[2][];
			toReturn[0] = messageDigest.digest();
			toReturn[1] = salt;
			return toReturn;
			
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
			return null;
		}
		
	}

	public static boolean passwordsEqual(String plainPassword, String saltHexStr, String hashPswrdHexStr) {

		try {
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
			// Digest salt and plain password
			messageDigest.update(
					(plainPassword + new String(hexStringToByteArray(saltHexStr))).getBytes(StandardCharsets.UTF_8));
			// Arrays with 2 passwords (from database, from user)
			byte[] hashedPasswordTocheck = messageDigest.digest();
			byte[] hashedPasswordStrored = hexStringToByteArray(hashPswrdHexStr);
			return Arrays.equals(hashedPasswordTocheck, hashedPasswordStrored);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return false;
		}

	}
}
