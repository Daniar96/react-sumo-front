package com.geosumo.teamone.models;

import com.fasterxml.jackson.annotation.JsonRawValue;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class StaticGraphs {
	@JsonRawValue
	private String count;

	@JsonRawValue
	private String speed;

	public StaticGraphs() {
	}

	public StaticGraphs(String count, String speed) {
		this.count = count;
		this.speed = speed;
	}

	public String getCount() {
		return count;
	}

	public void setCount(String count) {
		this.count = count;
	}

	public String getSpeed() {
		return speed;
	}

	public void setSpeed(String speed) {
		this.speed = speed;
	}
}
