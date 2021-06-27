package com.geosumo.teamone.security;

import java.util.ArrayList;
import java.util.concurrent.locks.ReentrantLock;

public class TokenList {
	private static ReentrantLock lock = new ReentrantLock();

	volatile static ArrayList<String> tokens = new ArrayList<String>();

	public static void addToken(byte[] token) {
		lock.lock();
		System.out.println("Adding token");
		tokens.add(new String(token));
		lock.unlock();
	}

	public static void addToken(String token) {
		lock.lock();
		System.out.println("Adding token");
		tokens.add(token);
		lock.unlock();
	}

	public static boolean validToken(byte[] token) {
		try {
			lock.lock();
			if (tokens.isEmpty())
				return false;
			return true;
		} finally {
			lock.unlock();
		}

	}

	public static void print() {
		lock.lock();
		if (tokens.isEmpty()) {
			System.out.println("Tokens empty");
		} else {
			for (String tokenf : tokens) {
				System.out.println("Token in tokenlist " + tokenf);
			}
		}
		lock.unlock();
	}

}
